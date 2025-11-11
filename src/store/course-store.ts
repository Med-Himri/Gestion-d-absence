import { create } from "zustand"
import { supabase } from "@/config/supabase"

export interface Course {
  id: string
  name: string
}

export interface inputCourse {
  course_name: string
}

interface CoursesState {
  courses: { course_id: string; course_name: string }[]
  loading: boolean
  error: string | null
  fetchCourses: () => Promise<void>
  addCourse: (input: inputCourse) => Promise<void>;
  updateCourse: (id: string, input: inputCourse) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null })

    const { data, error } = await supabase
      .from("course")
      .select("id, name")
    //.single();
    if (error) {
      console.error("❌ Error fetching courses:", error.message)
      set({ error: error.message, loading: false })
      return
    }

    const formatted =
      data?.map((course) => ({
        course_id: course.id,
        course_name: course.name,
      })) || []

    set({ courses: formatted, loading: false })
  },

  addCourse: async (input: inputCourse) => {
    set({ loading: true, error: null });

    try {
      // 1️⃣ Insert new course with default hour
      const { data, error } = await supabase
        .from("course")
        .insert([{
          name: input.course_name,
          hour: '00:00:00', // mandatory because of NOT NULL
        }])
        .select("id, name")
        .single();

      if (error) throw error;

      // 2️⃣ Refresh courses list
      await useCoursesStore.getState().fetchCourses();

      set({ loading: false });
    } catch (err: any) {
      console.error("❌ Error adding course:", err.message || err);
      set({ error: err.message || "Unknown error", loading: false });
    }
  },

  updateCourse: async (id: string, input: { course_name: string }) => {
    set({ loading: true, error: null });

    try {
      const { error } = await supabase
        .from("course")
        .update({ name: input.course_name })
        .eq("id", id);

      if (error) throw error;

      // Refresh the list after updating
      await useCoursesStore.getState().fetchCourses();

      set({ loading: false });
      alert("✅ Cours mis à jour avec succès !");
    } catch (err: any) {
      console.error("❌ Error updating course:", err.message || err);
      set({ error: err.message || "Unknown error", loading: false });
      alert("❌ Erreur lors de la mise à jour du cours !");
    }
  },

deleteCourse: async (id: string) => {
  try {
    const { error } = await supabase
      .from("course")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // ✅ Remove from local state immediately
    set((state) => ({
      courses: state.courses.filter((c) => c.course_id !== id),
    }));

    console.log("✅ Course deleted successfully");
  } catch (error: any) {
    console.error("❌ Error deleting course:", error.message);
  }
},

}))
