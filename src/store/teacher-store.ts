import { create } from "zustand";
import { supabase } from "@/config/supabase";  // Adjust path
import type { PostgrestError } from "@supabase/supabase-js";

export interface Teacher {
  user_id: string;
  name: string;
  email: string;
  role: string;
  course_names: string[];  // Array of course names
  groups: string[];  // Array of group names
}

export interface TeacherInput {
  name: string;
  email: string;
  password: string;
  course_ids: string[];  // Array
  group_ids: string[];  // Array
}

interface TeacherState {
  teachers: Teacher[];
  loading: boolean;
  error: PostgrestError | null;

  fetchTeachers: () => Promise<void>;
  addTeacher: (input: TeacherInput) => Promise<void>;
  updateTeacher: (user_id: string, input: Partial<TeacherInput>) => Promise<void>;
  deleteTeacher: (user_id: string) => Promise<void>;
}

export const useTeachersStore = create<TeacherState>((set, get) => ({
  teachers: [],
  loading: false,
  error: null,

  /***********************************************
   * FETCH TEACHERS
   ***********************************************/
  fetchTeachers: async () => {
  set({ loading: true, error: null });
  console.log("Fetching teachers...");

  try {
    const { data, error } = await supabase
      .from("teacher")
      .select(`
        user_id,
        user!user_id ( name, email, role ),
        teacher_course ( course:course_id ( name ) ),
        teacher_group ( group:group_id ( name ) )
      `);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Raw data:", data);

    const formatted: Teacher[] = data.map((t: any) => ({
      user_id: t.user_id,
      name: t.user?.name || "",
      email: t.user?.email || "",
      role: t.user?.role || "",
      course_names: t.teacher_course?.map((tc: any) => tc.course?.name).filter(Boolean) || [],
      groups: t.teacher_group?.map((tg: any) => tg.group?.name).filter(Boolean) || [],
    }));

    console.log("Formatted teachers:", formatted);
    set({ teachers: formatted, loading: false });
  } catch (err) {
    console.error("Error fetching teachers:", err);
    set({ error: err as PostgrestError, loading: false });
  }
},



  /***********************************************
   * ADD TEACHER
   ***********************************************/
  addTeacher: async (input) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke('add-teacher', {
        body: input,
      });

      if (error) throw error;

      console.log("Teacher created successfully with user_id:", data.user_id);
      alert("Teacher added successfully!");
      
      await get().fetchTeachers();  // Refresh
    } catch (err: any) {
      console.error("Error adding teacher:", err.message);
      set({ error: err, loading: false });
      alert("Error: " + err.message);
    } finally {
      set({ loading: false });
    }
  },

  /***********************************************
   * UPDATE TEACHER
   ***********************************************/
  updateTeacher: async (user_id: string, updates: Partial<TeacherInput>) => {
    set({ loading: true, error: null });

    try {
      // Update user table
      if (updates.name || updates.email) {
        const { error: userError } = await supabase
          .from("user")
          .update({
            ...(updates.name && { name: updates.name }),
            ...(updates.email && { email: updates.email }),
          })
          .eq("id", user_id);

        if (userError) throw userError;
      }

      // Update courses
      if (updates.course_ids) {
        await supabase.from("teacher_course").delete().eq("teacher_user_id", user_id);
        const rows = updates.course_ids.map((cid) => ({ teacher_user_id: user_id, course_id: cid }));
        if (rows.length > 0) {
          const { error } = await supabase.from("teacher_course").insert(rows);
          if (error) throw error;
        }
      }

      // Update groups
      if (updates.group_ids) {
        await supabase.from("teacher_group").delete().eq("teacher_user_id", user_id);
        const rows = updates.group_ids.map((gid) => ({ teacher_user_id: user_id, group_id: gid }));
        if (rows.length > 0) {
          const { error } = await supabase.from("teacher_group").insert(rows);
          if (error) throw error;
        }
      }

      await get().fetchTeachers();  // Refresh
    } catch (err: any) {
      console.error("UPDATE ERROR:", err);
      set({ error: err, loading: false });
    }

    set({ loading: false });
  },

  /***********************************************
   * DELETE TEACHER
   ***********************************************/
  deleteTeacher: async (user_id: string) => {
    set({ loading: true, error: null });

    try {
      await supabase.from("teacher_group").delete().eq("teacher_user_id", user_id);
      await supabase.from("teacher_course").delete().eq("teacher_user_id", user_id);
      await supabase.from("teacher").delete().eq("user_id", user_id);
      await supabase.from("user").delete().eq("id", user_id);
      await supabase.auth.admin.deleteUser(user_id);

      await get().fetchTeachers();  // Refresh
    } catch (err) {
      console.error("Error deleting teacher:", err);
      set({ error: err as PostgrestError, loading: false });
    }

    set({ loading: false });
  },
}));