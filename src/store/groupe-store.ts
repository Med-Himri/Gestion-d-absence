import { create } from "zustand"
import { supabase } from "@/config/supabase"
import type { PostgrestError } from "@supabase/supabase-js"

export interface Group {
  field: any
  id: string
  name: string
  year: string
  number_student?: number
  field_id?: string
}

export interface GroupInput {
  name: string;
  year: string;
  number_student?: number;
  field_id?: string;
}

interface GroupState {
  groups: Group[]
  loading: boolean
  error: PostgrestError | null
  fetchGroups: () => Promise<void>
  addGroup: (input: GroupInput) => Promise<void>;
  updateGroup: (id: string, input: Partial<GroupInput>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  loading: false,
  error: null,

  fetchGroups: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.from("group").select(`id, 
      name, 
      year, 
      number_student,
      field:field_id (id, name)`)

    if (error) {
      console.error("❌ Error fetching groups:", error)
      set({ error, loading: false })
      return
    }

    set({ groups: data || [], loading: false })
  },

  addGroup: async (input: GroupInput) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from("group")
        .insert([input])
        .select()
        .single();

      if (error) throw error;

      // Refresh group list
      await useGroupStore.getState().fetchGroups();
    } catch (err: any) {
      console.error("❌ Error adding group:", err);
      set({ error: err.message, loading: false });
    }

    set({ loading: false });
  },

  updateGroup: async (id: string,
    input: {
      name?: string;
      year?: string;
      number_student?: number;
      field_id?: string | null; // allow null
    }
) => {
  set({ loading: true, error: null });

  try {
    // Update the group in Supabase
    console.log("Updating group:", id, input)
    const { error: groupError } = await supabase
      .from("group")
      .update({
        name: input.name,
        year: input.year,
        number_student: input.number_student,
        field_id: input.field_id ? input.field_id : null,
      })
      .eq("id", id);
    console.log("Update error:", groupError)
    if (groupError) throw groupError;

    // Refresh the group list
    const { data: updatedGroups, error: fetchError } = await supabase
      .from("group")
      .select(`
        id,
        name,
        year,
        number_student,
        field_id,
        field:field_id (id, name)
      `);

    if (fetchError) throw fetchError;

    set({ groups: updatedGroups || [], loading: false });

  } catch (error: any) {
    console.error("Error updating group:", error.message);
    set({ error: error.message, loading: false });
  }
},

  deleteGroup: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from("group").delete().eq("id", id);
      if (error) throw error;
      await useGroupStore.getState().fetchGroups();
    } catch (err: any) {
      console.error("Error deleting group:", err);
      set({ error: err.message, loading: false });
    }
  },

}))
