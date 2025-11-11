import { create } from "zustand";
import { supabase } from "@/config/supabase";

interface Group {
    id: string;
    name: string;
    year: number;
}

interface Field {
    id: string;
    name: string;
    groups?: Group[];
}
export interface FieldInput {
    name: string;
    group_ids?: string[];
}

interface FieldState {
    fields: Field[];
    loading: boolean;
    error: string | null;
    fetchFields: () => Promise<void>;
    updateField: (id: string, input: FieldInput) => Promise<void>;
    addField: (input: FieldInput) => Promise<void>;
    deleteField: (id: string) => Promise<void>
}


export const useFieldStore = create<FieldState>((set) => ({
    fields: [],
    loading: false,
    error: null,

    fetchFields: async () => {
        set({ loading: true, error: null });

        const { data, error } = await supabase
            .from("field")
            .select(`
        id,
        name,
        groups:group!field_id (
          id,
          name
        )
      `);

        if (error) {
            console.error("Error fetching fields:", error.message);
            set({ error: error.message, loading: false });
            return;
        }

        set({
            fields: (data || []).map((field: any) => ({
                ...field,
                groups: (field.groups || []).map((group: any) => ({
                    ...group,
                    year: group.year ?? 0 // Provide a default year or fetch it if available
                }))
            })),
            loading: false
        });
    },
    addField: async (input: FieldInput) => {
        set({ loading: true, error: null });
        try {
            // 1️⃣ Insert field
            const { data: fieldData, error: fieldError } = await supabase
                .from("field")
                .insert([{ name: input.name }])
                .select("id")
                .single();

            if (fieldError) throw fieldError;

            // 2️⃣ Assign selected groups to this new field
            if (input.group_ids && input.group_ids.length > 0) {
                const { error: updateError } = await supabase
                    .from("group")
                    .update({ field_id: fieldData.id })
                    .in("id", input.group_ids);

                if (updateError) throw updateError;
            }

            // 3️⃣ Refresh fields
            await useFieldStore.getState().fetchFields();

        } catch (err: any) {
            console.error("Error adding field:", err.message || err);
            set({ error: err.message || "Unknown error", loading: false });
            return;
        }

        set({ loading: false });
    },

    updateField: async (id: string, input: FieldInput) => {
        set({ loading: true, error: null });

        try {
            // 1️⃣ Update field name
            const { error: fieldError } = await supabase
                .from("field")
                .update({ name: input.name })
                .eq("id", id);

            if (fieldError) throw fieldError;

            // 2️⃣ Unlink all existing groups from this field
            const { error: unlinkError } = await supabase
                .from("group")
                .update({ field_id: null })
                .eq("field_id", id);

            if (unlinkError) throw unlinkError;

            // 3️⃣ Link new selected groups
            if (input.group_ids && input.group_ids.length > 0) {
                const { error: linkError } = await supabase
                    .from("group")
                    .update({ field_id: id })
                    .in("id", input.group_ids);

                if (linkError) throw linkError;
            }

            // 4️⃣ Refresh the fields in your store
            await useFieldStore.getState().fetchFields();

            set({ loading: false });
        } catch (error: any) {
            console.error("Error updating field:", error.message);
            set({ error: error.message, loading: false });
        }
    },

    deleteField: async (id: string) => {
        set({ loading: true, error: null });

        try {
            // 1️⃣ Unlink all groups connected to this field
            const { error: unlinkError } = await supabase
                .from("group")
                .update({ field_id: null })
                .eq("field_id", id);

            if (unlinkError) throw unlinkError;

            // 2️⃣ Delete the field itself
            const { error: deleteError } = await supabase
                .from("field")
                .delete()
                .eq("id", id);

            if (deleteError) throw deleteError;

            // 3️⃣ Refresh field list after deletion
            const { data: updatedFields, error: fetchError } = await supabase
                .from("field")
                .select(`
        id,
        name,
        groups:group!field_id (
          id,
          name
        )
      `);

            if (fetchError) throw fetchError;

            set({
                fields: (updatedFields || []).map((field: any) => ({
                    ...field,
                    groups: (field.groups || []).map((group: any) => ({
                        ...group,
                        year: 0
                    }))
                })),
                loading: false
            });
        } catch (error: any) {
            console.error("Error deleting field:", error.message);
            set({ error: error.message, loading: false });
        }
    },







}));




