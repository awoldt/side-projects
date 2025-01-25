import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  "https://elsxssomogmdzputaijs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsc3hzc29tb2dtZHpwdXRhaWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NjgwNzAsImV4cCI6MjA0NjQ0NDA3MH0.Br2TzV9lOuyqvr68BK9r5dPYUCNI0uAjyTj9Pl7tdLM"
);
