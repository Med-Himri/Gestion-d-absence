import { create } from "zustand";
import { supabase } from "@/config/supabase";

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: "admin" | "ensiegnant";
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  signup: (
    nom: string,
    prenom: string,
    email: string,
    password: string,
    role: "admin" | "ensiegnant"
  ) => Promise<void>;
  login: (email: string, password: string, selectedRole: "admin" | "ensiegnant") => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  signup: async (nom, prenom, email, password, role) => {
    // 1️⃣ Create Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    // 2️⃣ Insert profile info into utilisateur
    const { error: insertError } = await supabase
      .from("utilisateur")
      .insert([
        {
          user_id: authData.user?.id,
          nom,
          prenom,
          role,
          email,
        },
      ]);

    if (insertError) throw insertError;

    // 3️⃣ Save user in Zustand
    set({
      user: {
        id: authData.user!.id,
        nom,
        prenom,
        email,
        role,
      },
    });
  },

  login: async (email, password, selectedRole) => {
    // 1️⃣ Sign in via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) throw authError;
    if (!authData.user) throw new Error("User not found");

    // 2️⃣ Fetch profile info (role, nom, prenom)
    const { data: profile, error: profileError } = await supabase
      .from("utilisateur")
      .select("*")
      .eq("user_id", authData.user.id)
      .single();

    if (profileError) throw profileError;

    // 3️⃣ Check role
    if (profile.role !== selectedRole) throw new Error("Invalid role selected");

    // 4️⃣ Save user in Zustand
    set({
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        nom: profile.nom,
        prenom: profile.prenom,
        role: profile.role,
      },
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
