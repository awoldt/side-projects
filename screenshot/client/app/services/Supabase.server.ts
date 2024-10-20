import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://mvrhhjxkjwltjefgwecx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cmhoanhrandsdGplZmd3ZWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2OTE3OTAsImV4cCI6MjAzODI2Nzc5MH0.L7ncXE3DriIvm84GJw5Uv0ABL0oDJYb2cX55z21cetM"
);

export class SupabaseService {
  static async CreateUser(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        console.log(error);
        return null;
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async InsertRecord(table: string, data: object) {
    try {
      const newRecord = await supabase.from(table).insert(data);
      return newRecord;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async GetUser(id: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("fk_authuser_id", id)
        .single();

      if (error) {
        console.log(error);
        return null;
      }

      console.log("user data in bnackend", data);

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async SignIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log(error);
        return null;
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async GetUsersScreenshots(userID: number) {
    try {
      const { data, error } = await supabase
        .from("screenshots")
        .select()
        .eq("fk_user_id", userID);
      if (error) {
        console.log(error);
        return null;
      }

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
