import { create } from "zustand";
import { supabase } from "@/config/supabase";

export interface Field {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  field?: Field | null;
}

export interface Student {
  id: string;
  name: string;
  massar_code: string;
  group_id: string;
  group?: Group | null;
}

export interface StudentInput {
  name: string;
  massar_code: string;
  group_ids: string
}

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchStudents: (groupId?: string) => Promise<void>; // ✅ optional
  addStudent: (input: StudentInput) => Promise<void>;
  updateStudent: (id: string, input: StudentInput) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from("student")
      .select(`
      id,
      name,
      massar_code,
      group_id,
      group:group_id (id, name)
    `);

    if (error) {
      console.error("Error fetching students:", error.message);
      set({ error: error.message, loading: false });
      return;
    }

    set({ students: data as any[], loading: false });
  },
  
  addStudent: async ({ name, massar_code, group_ids }) => {
    set({ loading: true, error: null });

    try {
      const { error } = await supabase.from("student").insert({
        name,
        massar_code,
        group_id: group_ids, // ✅ only one group now
      });

      if (error) throw error;

      // optional: refetch or push locally
      set((state) => ({
        students: [
          ...state.students,
          { id: crypto.randomUUID(), name, massar_code, group_id: group_ids },
        ],
        loading: false,
      }));

      alert("✅ Étudiant ajouté avec succès !");
    } catch (err: any) {
      console.error("Error adding student:", err.message);
      set({ error: err.message, loading: false });
      alert("❌ Erreur lors de l’ajout de l’étudiant !");
    }
  },

  updateStudent: async (id: string, { name, massar_code, group_ids }: StudentInput) => {
    set({ loading: true, error: null });

    try {
      const { error } = await supabase
        .from("student")
        .update({
          name,
          massar_code,
          group_id: group_ids,
        })
        .eq("id", id);

      if (error) throw error;
      await useStudentStore.getState().fetchStudents();
      // ✅ Update local Zustand state
      set((state) => ({
        students: state.students.map((s) =>
          s.id === id
            ? { ...s, name, massar_code, group_id: group_ids, group: state.students.find((st) => st.group_id === group_ids)?.group }
            : s
        ),
        loading: false,
      }));

      console.log("✅ Student updated successfully");
    } catch (err: any) {
      console.error("❌ Error updating student:", err.message);
      set({ error: err.message, loading: false });
    }
  },

  deleteStudent: async (id) => {
    try {
      const { error } = await supabase.from("student").delete().eq("id", id);
      if (error) throw error;

      set((state) => ({
        students: state.students.filter((s) => s.id !== id),
      }));

      alert("🗑️ Étudiant supprimé avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("❌ Impossible de supprimer l'étudiant !");
    }
  }


}));
