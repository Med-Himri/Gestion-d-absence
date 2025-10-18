import { create } from 'zustand'
import { supabase } from '@/config/supabase'
import type { PostgrestError } from '@supabase/supabase-js'

export interface Teacher {
    user_id: string
    name: string
    email: string
    role: string
    course_name: string
    group: string[]
    password?: string
}

export interface TeacherInput {
    name: string
    email: string
    password: string
    course: string
    course_id: string          // optional course assigned
    group_ids: string[]        // optional groups assigned
}

interface TeacherState {
    teachers: Teacher[]
    loading: boolean
    error: PostgrestError | null
    fetchTeachers: () => Promise<void>
    addTeacher: (input: TeacherInput) => Promise<void>
    updateTeacher: (user_id: string, input: TeacherInput) => Promise<void>
    deleteTeacher: (user_id: string) => Promise<void>
}

export const useTeachersStore = create<TeacherState>((set) => ({
    teachers: [],
    loading: false,
    error: null,

    fetchTeachers: async () => {
        set({ loading: true, error: null })
        const { data, error } = await supabase
            .from('teacher')
            .select(`
    user_id,
    user(
      name,
      email,
      role
    ),
    course:course_teacher_id_fkey (
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
  `)
        if (error) {
            set({ error, loading: false })
            console.error('Error fetching teachers:', error)
            return
        }

        // Flatten the nested user data
        const formatted = data.map((t: any) => ({
            user_id: t.user_id,
            name: t.user?.name ?? '',
            email: t.user?.email ?? '',
            role: t.user?.role ?? '',
            course_name: t.course?.map((c: any) => c.name) ?? [],
            group: t.course
                ?.flatMap((c: any) =>
                    c.group_course?.map((gc: any) => gc.group?.name)
                )
                .filter(Boolean) ?? [],
        }))

        set({ teachers: formatted, loading: false })
    },

    addTeacher: async (input: TeacherInput) => {
        set({ loading: true, error: null })

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
                .single()
            if (userError) throw userError
            const user_id = userData.id

            // 2️⃣ Create teacher
            const { data: teacherData, error: teacherError } = await supabase
                .from('teacher')
                .insert([{ user_id }])
                .select('user_id')
                .single()
            if (teacherError) throw teacherError
            const teacher_id = teacherData.user_id

            // 3️⃣ Create course (or assign existing course)
            let course_id = input.course_id
            if (!course_id) {
                const { data: courseData, error: courseError } = await supabase
                    .from('course')
                    .insert([{ name: 'Default Course', hour: '00:00', teacher_id }])
                    .select('id')
                    .single()
                if (courseError) throw courseError
                course_id = courseData.id
            } else {
                // Update course to assign teacher
                const { error: courseError } = await supabase
                    .from('course')
                    .update({ teacher_id })
                    .eq('id', course_id)
                if (courseError) throw courseError
            }

            // 4️⃣ Assign selected groups to the course
            if (input.group_ids && input.group_ids.length > 0) {
                const groupCourseRows = input.group_ids.map(group_id => ({
                    course_id,
                    group_id
                }))
                const { error: gcError } = await supabase
                    .from('group_course')
                    .insert(groupCourseRows)
                if (gcError) throw gcError
            }

            // 5️⃣ Refresh UI
            await useTeachersStore.getState().fetchTeachers()

        } catch (err: any) {
            console.error('Error adding teacher:', err)
            set({ error: err, loading: false })
            return
        }

        set({ loading: false })
    },
deleteTeacher: async (user_id: string) => {
    set({ loading: true, error: null });
    try {
        // 1️⃣ Find courses for that teacher
        const { data: courses, error: cErr } = await supabase
            .from("course")
            .select("id")
            .eq("teacher_id", user_id);
        if (cErr) throw cErr;

        // 2️⃣ Remove linked group_course rows
        if (courses?.length) {
            const courseIds = courses.map((c) => c.id);
            const { error: gcErr } = await supabase
                .from("group_course")
                .delete()
                .in("course_id", courseIds);
            if (gcErr) throw gcErr;
        }

        // 3️⃣ Delete courses
        const { error: courseDelErr } = await supabase
            .from("course")
            .delete()
            .eq("teacher_id", user_id);
        if (courseDelErr) throw courseDelErr;

        // 4️⃣ Delete teacher
        const { error: teacherDelErr } = await supabase
            .from("teacher")
            .delete()
            .eq("user_id", user_id);
        if (teacherDelErr) throw teacherDelErr;

        // 5️⃣ Delete user
        const { error: userDelErr } = await supabase
            .from("user")
            .delete()
            .eq("id", user_id);
        if (userDelErr) throw userDelErr;

        // 6️⃣ Refresh teacher list
        await useTeachersStore.getState().fetchTeachers();

    } catch (err: any) {
        console.error("Error deleting teacher:", err);
        set({ error: err, loading: false });
        return;
    }

    set({ loading: false });
},

    // updateTeacher inside teacher-store
    updateTeacher: async (teacher_id: string, updates: { name?: string; email?: string; group_ids?: string[] }) => {
        set({ loading: true, error: null });

        try {
            // 1️⃣ Update user info
            const { error: userError } = await supabase
                .from('user')
                .update({ name: updates.name, email: updates.email })
                .eq('id', teacher_id);
            if (userError) throw userError;

            // 2️⃣ Find teacher’s course
            const { data: courses, error: courseError } = await supabase
                .from('course')
                .select('id')
                .eq('teacher_id', teacher_id);
            if (courseError) throw courseError;

            if (courses.length > 0 && updates.group_ids?.length) {
                const course_id = courses[0].id;

                // 3️⃣ Clear existing links
                await supabase.from('group_course').delete().eq('course_id', course_id);

                // 4️⃣ Insert new ones
                const newLinks = updates.group_ids.map(group_id => ({
                    course_id,
                    group_id
                }));
                const { error: insertError } = await supabase.from('group_course').insert(newLinks);
                if (insertError) throw insertError;
            }

            // 5️⃣ Refresh
            await useTeachersStore.getState().fetchTeachers();

        } catch (err: any) {
            console.error("Error updating teacher:", err);
            set({ error: err, loading: false });
            return;
        }

        set({ loading: false });
    }







}))


