import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TableName = keyof Database["public"]["Tables"];

// Generic CRUD operations
export async function getAll<T extends TableName>(
  table: T,
  options?: {
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    offset?: number;
    filters?: Record<string, unknown>;
    search?: { column: string; query: string };
  }
) {
  let query = supabase.from(table).select("*", { count: "exact" });

  if (options?.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(key, value);
      }
    }
  }

  if (options?.search?.query) {
    query = query.ilike(options.search.column, `%${options.search.query}%`);
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? false });
  }

  if (options?.limit) {
    const offset = options.offset ?? 0;
    query = query.range(offset, offset + options.limit - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data as Database["public"]["Tables"][T]["Row"][], count };
}

export async function getById<T extends TableName>(table: T, id: string) {
  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Database["public"]["Tables"][T]["Row"] | null;
}

export async function createRecord<T extends TableName>(
  table: T,
  record: Database["public"]["Tables"][T]["Insert"]
) {
  const { data, error } = await supabase.from(table).insert(record as never).select().single();
  if (error) throw error;
  return data as Database["public"]["Tables"][T]["Row"];
}

export async function updateRecord<T extends TableName>(
  table: T,
  id: string,
  updates: Database["public"]["Tables"][T]["Update"]
) {
  const { data, error } = await supabase.from(table).update(updates as never).eq("id", id).select().single();
  if (error) throw error;
  return data as Database["public"]["Tables"][T]["Row"];
}

export async function deleteRecord<T extends TableName>(table: T, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Domain-specific queries
export async function getProjectsWithUpdates(userId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select(`*, project_updates(*)`)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getRecentUpdates(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from("project_updates")
    .select(`*, projects(name)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getUnreadAlerts(userId: string) {
  const { data, error } = await supabase
    .from("alerts")
    .select(`*, projects(name)`)
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: { full_name?: string; role?: string; avatar_url?: string }) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
