import { supabase } from "@/integrations/supabase/client";

// ── Projects ──

export async function getProjects(options?: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase.from("projects").select("*", { count: "exact" }).order("updated_at", { ascending: false });

  if (options?.search) query = query.ilike("name", `%${options.search}%`);
  if (options?.status) query = query.eq("status", options.status);
  if (options?.limit) {
    const off = options.offset ?? 0;
    query = query.range(off, off + options.limit - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProject(project: {
  user_id: string;
  name: string;
  description?: string;
  status?: string;
  progress?: number;
  milestone?: string;
  start_date?: string;
  end_date?: string;
}) {
  const { data, error } = await supabase.from("projects").insert(project).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: {
  name?: string;
  description?: string;
  status?: string;
  progress?: number;
  milestone?: string;
  start_date?: string;
  end_date?: string;
}) {
  const { data, error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ── Project Updates ──

export async function getProjectUpdates(options?: {
  projectId?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from("project_updates")
    .select("*, projects(name)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (options?.projectId) query = query.eq("project_id", options.projectId);
  if (options?.limit) {
    const off = options.offset ?? 0;
    query = query.range(off, off + options.limit - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function createProjectUpdate(update: {
  project_id: string;
  user_id: string;
  description: string;
  image_url?: string;
}) {
  const { data, error } = await supabase.from("project_updates").insert(update).select().single();
  if (error) throw error;
  // Also update the project's updated_at
  await supabase.from("projects").update({ updated_at: new Date().toISOString() }).eq("id", update.project_id);
  return data;
}

export async function deleteProjectUpdate(id: string) {
  const { error } = await supabase.from("project_updates").delete().eq("id", id);
  if (error) throw error;
}

// ── Alerts ──

export async function getAlerts(options?: { unreadOnly?: boolean }) {
  let query = supabase.from("alerts").select("*, projects(name)").order("created_at", { ascending: false });
  if (options?.unreadOnly) query = query.eq("is_read", false);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function markAlertRead(id: string) {
  const { error } = await supabase.from("alerts").update({ is_read: true }).eq("id", id);
  if (error) throw error;
}

// ── Profiles ──

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
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
