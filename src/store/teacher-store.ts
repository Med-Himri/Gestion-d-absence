import { create } from 'zustand'
import { supabase } from '@/config/supabase'
import type { PostgrestError } from '@supabase/supabase-js'

export interface Teacher {
    user_id: string
    name: string
    email: string
    role: string
    course_name: string | null;
    group: string[];
}

export interface TeacherInput {
    new_group_name: any
    name: string
    email: string
    password: string
    course_id: string          // optional course assigned
    group_ids: string[]        // optional groups assigned
}

interface TeacherState {
    teachers: Teacher[]
    loading: boolean
    error: PostgrestError | null
    fetchTeachers: () => Promise<void>
    addTeacher: (input: TeacherInput) => Promise<void>
    updateTeacher: (
        teacher_id: string,
        updates: TeacherInput
    ) => Promise<void>;
    deleteTeacher: (teacher_id: string) => Promise<void>
}

export const useTeachersStore = create<TeacherState>((set) => ({
    teachers: [],
    loading: false,
    error: null,

    fetchTeachers: async () => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from("teacher")
            .select(`
      user_id,
      user:user_id (
        id,
        name,
        email,
        role
      ),
      course:course_id (
        id,
        name,
        group_course (
          group:group_id (
            id,
            name,
            year
          )
        )
      )
    `);

        if (error) {
            console.error("❌ Error fetching teachers:", error);
            set({ error, loading: false });
            return;
        }

        // ✅ Flatten data for easier frontend use
        const formatted: Teacher[] = (data ?? []).map((t: any) => ({
            user_id: t.user_id,
            name: t.user?.name ?? "",
            email: t.user?.email ?? "",
            role: t.user?.role ?? "",
            course_name: t.course?.name ?? "",
            group:
                t.course?.group_course?.map((gc: any) => gc.group?.name).filter(Boolean) ??
                [],
        }));

        set({ teachers: formatted, loading: false });
    },

    addTeacher: async (input: TeacherInput) => {
        set({ loading: true, error: null });

        try {
            // 1️⃣ Create user
            const { data: userData, error: userError } = await supabase
                .from('user')
                .insert([{
                    name: input.name,
                    email: input.email,
                    password: input.password,
                    role: 'teacher'
                }])
                .select('id')
                .single();
            if (userError) throw userError;
            const user_id = userData.id;

            // 2️⃣ Create teacher (link directly to course)
            const { error: teacherError } = await supabase
                .from('teacher')
                .insert([{
                    user_id,
                    course_id: input.course_id || null
                }]);
            if (teacherError) throw teacherError;

            // 3️⃣ Assign selected groups to the course
            if (input.group_ids && input.group_ids.length > 0 && input.course_id) {
                const groupCourseRows = input.group_ids.map(group_id => ({
                    course_id: input.course_id,
                    group_id
                }));
                const { error: gcError } = await supabase
                    .from('group_course')
                    .insert(groupCourseRows);
                if (gcError) throw gcError;
            }

            // 4️⃣ Refresh
            await useTeachersStore.getState().fetchTeachers();

        } catch (err: any) {
            console.error('Error adding teacher:', err);
            set({ error: err, loading: false });
            return;
        }

        set({ loading: false });
    },

    // ✅ UPDATE TEACHER
    updateTeacher: async (teacher_id, updates) => {
        set({ loading: true, error: null });

        try {
            // 1️⃣ Update teacher’s course
            const { error: teacherError } = await supabase
                .from("teacher")
                .update({ course_id: updates.course_id })
                .eq("user_id", teacher_id);
            if (teacherError) throw teacherError;

            // 2️⃣ Update user info
            const { error: userError } = await supabase
                .from("user")
                .update({
                    name: updates.name,
                    email: updates.email,
                })
                .eq("id", teacher_id);
            if (userError) throw userError;

            // 3️⃣ Get teacher’s course_id (for safety)
            const { data: teacherData, error: fetchTeacherError } = await supabase
                .from("teacher")
                .select("course_id")
                .eq("user_id", teacher_id)
                .single();
            if (fetchTeacherError) throw fetchTeacherError;

            const course_id = teacherData?.course_id;
            if (!course_id) throw new Error("Teacher has no assigned course.");

            // 4️⃣ Update group_course links (delete old + insert new)
            await supabase.from("group_course").delete().eq("course_id", course_id);

            if (updates.group_ids && updates.group_ids.length > 0) {
                const newLinks = updates.group_ids.map((group_id) => ({
                    course_id,
                    group_id,
                }));
                const { error: gcError } = await supabase
                    .from("group_course")
                    .insert(newLinks);
                if (gcError) throw gcError;
            }

            // 5️⃣ 🆕 Update group names linked to this teacher (like your SQL)
            if (updates.new_group_name) {
                // Find all group_ids related to teacher’s course
                const { data: groupCourses, error: groupFetchError } = await supabase
                    .from("group_course")
                    .select("group_id")
                    .eq("course_id", course_id);
                if (groupFetchError) throw groupFetchError;

                const groupIds = groupCourses.map((gc) => gc.group_id);

                // Update each group name one by one (Supabase doesn't support multi-join update)
                for (const group_id of groupIds) {
                    const { error: groupUpdateError } = await supabase
                        .from("group")
                        .update({ name: updates.new_group_name })
                        .eq("id", group_id);
                    if (groupUpdateError) throw groupUpdateError;
                }
            }

            // ✅ Refresh teacher data in the store
            await useTeachersStore.getState().fetchTeachers();
        } catch (err: any) {
            console.error("❌ Error updating teacher:", err);
            set({ error: err, loading: false });
            return;
        }

        set({ loading: false });
    },


    deleteTeacher: async (teacher_id) => {
        set({ loading: true, error: null });
        try {
            // 1️⃣ Remove teacher (auto cascade via foreign key)
            const { error: teacherErr } = await supabase
                .from("teacher")
                .delete()
                .eq("user_id", teacher_id);
            if (teacherErr) throw teacherErr;

            // 2️⃣ Delete the user itself
            const { error: userErr } = await supabase
                .from("user")
                .delete()
                .eq("id", teacher_id);
            if (userErr) throw userErr;

            await useTeachersStore.getState().fetchTeachers();
        } catch (err: any) {
            console.error("❌ Error deleting teacher:", err);
            set({ error: err, loading: false });
            return;
        }

        set({ loading: false });
    },

}))


