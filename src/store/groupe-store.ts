import { create } from "zustand"
import { supabase } from "@/config/supabase"
import type { PostgrestError } from "@supabase/supabase-js"

export interface Group {
  id: string
  name: string
  year?: string
}

interface GroupState {
  groups: Group[]
  loading: boolean
  error: PostgrestError | null
  fetchGroups: () => Promise<void>
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  loading: false,
  error: null,

  fetchGroups: async () => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.from("group").select("id, name, year")

    if (error) {
      console.error("❌ Error fetching groups:", error)
      set({ error, loading: false })
      return
    }

    set({ groups: data || [], loading: false })
  },
}))
