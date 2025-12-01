import { create } from "zustand";
import { supabase } from "@/config/supabase";  // Adjust path if needed
import type { PostgrestError } from "@supabase/supabase-js";

export interface Course {
  id: string;
  name: string;
  hour: string;  // Assuming 'hour' is a string (e.g., time)
  teachers?: { name: string; email: string }[];  // Optional: List of teachers teaching this course
}

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: PostgrestError | null;

  fetchCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'teachers'>) => Promise<void>;  // Example: Add if needed
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;  // Example: Update if needed
  deleteCourse: (id: string) => Promise<void>;  // Example: Delete if needed
}

export const useCoursesStore = create<CourseState>((set, get) => ({
  courses: [],
  loading: false,
  error: null,

  /***********************************************
   * FETCH COURSES
   ***********************************************/
  fetchCourses: async () => {
    set({ loading: true, error: null });

    try {
      // Fetch courses with related teachers via teacher_course
      // Use specific paths to avoid ambiguity: teacher_course(teacher!teacher_user_id(user!id(name, email)))
      const { data, error } = await supabase
        .from("course")
        .select(`
          id,
          name,
          hour,
          teacher_course (
            teacher!teacher_user_id (
              user!id (
                name,
                email
              )
            )
          )
        `);

      if (error) throw error;

      // Format the data
      const formatted: Course[] = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        hour: c.hour,
        teachers: c.teacher_course?.map((tc: any) => ({
          name: tc.teacher.user.name,
          email: tc.teacher.user.email,
        })) || [],
      }));

      set({ courses: formatted, loading: false });
    } catch (err) {
      set({ error: err as PostgrestError, loading: false });
      console.error("Error fetching courses:", err);
    }
  },

  /***********************************************
   * ADD COURSE (Example - Add if you need it)
   ***********************************************/
  addCourse: async (course) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("course")
        .insert([course])
        .select()
        .single();

      if (error) throw error;

      // Refresh list
      await get().fetchCourses();
    } catch (err) {
      set({ error: err as PostgrestError, loading: false });
    }
  },

  /***********************************************
   * UPDATE COURSE (Example - Add if you need it)
   ***********************************************/
  updateCourse: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("course")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      // Refresh list
      await get().fetchCourses();
    } catch (err) {
      set({ error: err as PostgrestError, loading: false });
    }
  },

  /***********************************************
   * DELETE COURSE (Example - Add if you need it)
   ***********************************************/
  deleteCourse: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("course")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Refresh list
      await get().fetchCourses();
    } catch (err) {
      set({ error: err as PostgrestError, loading: false });
    }
  },
}));