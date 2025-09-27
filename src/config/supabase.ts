import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fcqcmzrlkbhtkqtpfyhz.supabase.co"
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcWNtenJsa2JodGtxdHBmeWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MTYyMjgsImV4cCI6MjA3MDI5MjIyOH0.X0H923MjyUmUMyEPVCQwK_SSSUOGNoCA9bmagTmiW9Q";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);