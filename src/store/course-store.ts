import { create } from "zustand"
import { supabase } from "@/config/supabase"
export interface User {
  id: string;
  name: string;
}

export interface Teacher {
  user_id: string;
  user: User;
}

export interface Course {
  id: string;
  name: string;
  teacher_id: string;
  teacher: Teacher | null;
}

export interface CourseWithTeacher {
  id: string;
  name: string;
  teacher: {
    user_id: string;
    user: {
      name: string;
    };
  } | null;
}
interface CoursesState {
  courses: {course_id: string ; course_name: string; teacher_name: string }[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  loading: false,
  error: null,
  fetchCourses: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from("course")
      .select(`
        name,
        teacher (
          user_id,
          user (
            name
          )
        )
      `) as { data: CourseWithTeacher[] | null; error: any }; // cast here

    if (error) {
      console.error("Error fetching courses:", error);
      set({ error: error.message, loading: false });
      return;
    }

    const formatted = data?.map((course) => ({
      course_id: course.id,
      course_name: course.name,
      teacher_name: course.teacher?.user?.name || "No teacher assigned",
    })) || [];

    set({ courses: formatted, loading: false });
  },
}));