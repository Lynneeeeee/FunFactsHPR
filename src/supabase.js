import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://fdbfrpptpijxaarzcizt.supabase.co/"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkYmZycHB0cGlqeGFhcnpjaXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyNjk2NTIsImV4cCI6MjAyNzg0NTY1Mn0.TCdX4fdgemcu7Cicl2kuORublnM01t4YyrtldIZYrFs"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;