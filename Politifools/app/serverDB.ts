import { createClient } from "@supabase/supabase-js";
import pg from "pg";
const { Pool } = pg;

export const serverDb = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  max: 15,
});

// uses the service key (admin)
export const supabase = createClient(
  "https://elsxssomogmdzputaijs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsc3hzc29tb2dtZHpwdXRhaWpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDg2ODA3MCwiZXhwIjoyMDQ2NDQ0MDcwfQ.rroJRU9iJILytAYyZ2NeWHijLjEKtDYD97FrB_o4u5w"
);
