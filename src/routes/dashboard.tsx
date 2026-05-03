import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Building2, Home, FolderKanban, Bell, LogOut, Plus, Clock,
  AlertTriangle, CheckCircle2, TrendingUp, Camera, Search, ChevronLeft, ChevronRight, Pencil, Trash2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import * as db from "@/services/database";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BuildPlus" },
      { name: "description", content: "Manage your construction projects with BuildPlus dashboard." },
    ],
  }),
  component: DashboardPage,
});

type Project = NonNullable<Awaited<ReturnType<typeof db.getProjectById>>>;
type ProjectUpdate = Awaited<ReturnType<typeof db.getProjectUpdates>>["data"][number];
type Alert = Awaited<ReturnType<typeof db.getAlerts>>[number];

function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 6;

  // Forms
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // New project form
  const [newProject, setNewProject] = useState({ name: "", description: "", milestone: "", status: "On Track" });
  // New update form
  const [newUpdate, setNewUpdate] = useState({ project_id: "", description: "" });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/auth" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [projectsRes, updatesRes, alertsRes] = await Promise.all([
        db.getProjects({ search: searchQuery || undefined, status: statusFilter || undefined, limit: PAGE_SIZE, offset: page * PAGE_SIZE }),
        db.getProjectUpdates({ limit: 5 }),
        db.getAlerts({ unreadOnly: true }),
      ]);
      setProjects(projectsRes.data);
      setProjectCount(projectsRes.count);
      setUpdates(updatesRes.data);
      setAlerts(alertsRes);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user, searchQuery, statusFilter, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await db.createProject({ ...newProject, user_id: user.id });
      toast.success("Project created!");
      setNewProject({ name: "", description: "", milestone: "", status: "On Track" });
      setShowAddProject(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project");
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      await db.updateProject(editingProject.id, {
        name: editingProject.name,
        description: editingProject.description ?? undefined,
        milestone: editingProject.milestone ?? undefined,
        status: editingProject.status,
        progress: editingProject.progress,
      });
      toast.success("Project updated!");
      setEditingProject(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await db.deleteProject(id);
      toast.success("Project deleted");
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    }
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await db.createProjectUpdate({ ...newUpdate, user_id: user.id });
      toast.success("Update posted!");
      setNewUpdate({ project_id: "", description: "" });
      setShowAddUpdate(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to post update");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (authLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  const totalPages = Math.ceil(projectCount / PAGE_SIZE);
  const onTrack = projects.filter(p => p.status === "On Track").length;
  const delayed = projects.filter(p => p.status === "Delayed").length;
  const avgProgress = projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border p-6">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Build<span className="text-brand-orange">Plus</span></span>
        </Link>
        <nav className="space-y-1 flex-1">
          <SidebarItem icon={Home} label="Dashboard" active />
          <SidebarItem icon={FolderKanban} label="Projects" />
          <SidebarItem icon={Bell} label={`Alerts${alerts.length ? ` (${alerts.length})` : ""}`} />
        </nav>
        <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.email}!</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddUpdate(!showAddUpdate)} className="gap-2">
                <Plus className="w-4 h-4" /> Add Update
              </Button>
              <Button variant="orange" onClick={() => setShowAddProject(!showAddProject)} className="gap-2">
                <Plus className="w-4 h-4" /> New Project
              </Button>
            </div>
          </div>

          {/* New Project Form */}
          {showAddProject && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card rounded-2xl border border-border p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">New Project</h3>
                <button onClick={() => setShowAddProject(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleCreateProject} className="grid sm:grid-cols-2 gap-4">
                <InputField label="Project Name" value={newProject.name} onChange={v => setNewProject(p => ({ ...p, name: v }))} required />
                <InputField label="Milestone" value={newProject.milestone} onChange={v => setNewProject(p => ({ ...p, milestone: v }))} />
                <div className="sm:col-span-2">
                  <InputField label="Description" value={newProject.description} onChange={v => setNewProject(p => ({ ...p, description: v }))} textarea />
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <Button type="submit" variant="hero">Create Project</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowAddProject(false)}>Cancel</Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Edit Project Modal */}
          {editingProject && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card rounded-2xl border border-border p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Edit Project</h3>
                <button onClick={() => setEditingProject(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleUpdateProject} className="grid sm:grid-cols-2 gap-4">
                <InputField label="Project Name" value={editingProject.name} onChange={v => setEditingProject(p => p ? { ...p, name: v } : p)} required />
                <InputField label="Milestone" value={editingProject.milestone ?? ""} onChange={v => setEditingProject(p => p ? { ...p, milestone: v } : p)} />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
                  <select value={editingProject.status} onChange={e => setEditingProject(p => p ? { ...p, status: e.target.value } : p)} className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="On Track">On Track</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Progress (%)</label>
                  <input type="number" min={0} max={100} value={editingProject.progress} onChange={e => setEditingProject(p => p ? { ...p, progress: Number(e.target.value) } : p)} className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Description" value={editingProject.description ?? ""} onChange={v => setEditingProject(p => p ? { ...p, description: v } : p)} textarea />
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <Button type="submit" variant="hero">Save Changes</Button>
                  <Button type="button" variant="ghost" onClick={() => setEditingProject(null)}>Cancel</Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Add Update Form */}
          {showAddUpdate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-card rounded-2xl border border-border p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">New Update</h3>
                <button onClick={() => setShowAddUpdate(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleCreateUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Project</label>
                  <select value={newUpdate.project_id} onChange={e => setNewUpdate(u => ({ ...u, project_id: e.target.value }))} required className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <InputField label="Description" value={newUpdate.description} onChange={v => setNewUpdate(u => ({ ...u, description: v }))} textarea required />
                <div className="flex gap-3">
                  <Button type="submit" variant="hero">Submit Update</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowAddUpdate(false)}>Cancel</Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Projects" value={String(projectCount)} icon={FolderKanban} />
            <StatCard label="On Track" value={String(onTrack)} icon={CheckCircle2} />
            <StatCard label="Delayed" value={String(delayed)} icon={AlertTriangle} />
            <StatCard label="Avg Progress" value={`${avgProgress}%`} icon={TrendingUp} />
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(0); }} className="h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Projects */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Projects</h2>
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading projects...</p>
            ) : projects.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <FolderKanban className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No projects found. Create your first project!</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  {projects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={() => setEditingProject({ ...project })}
                      onDelete={() => setDeleteConfirm(project.id)}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Delete Confirmation */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold text-foreground mb-2">Delete Project?</h3>
                <p className="text-sm text-muted-foreground mb-6">This action cannot be undone. All updates for this project will also be deleted.</p>
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                  <Button variant="destructive" onClick={() => handleDeleteProject(deleteConfirm)}>Delete</Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Updates */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Updates</h2>
              {updates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No updates yet.</p>
              ) : (
                <div className="space-y-4">
                  {updates.map(update => (
                    <div key={update.id} className="bg-card rounded-xl border border-border p-4">
                      <p className="text-sm font-medium text-foreground">{(update as { projects?: { name?: string } | null }).projects?.name ?? "Unknown"}</p>
                      <p className="text-sm text-muted-foreground mt-1">{update.description}</p>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="w-3 h-3" />
                        {new Date(update.created_at).toLocaleString()}
                        {update.image_url && <><Camera className="w-3 h-3 ml-2 text-primary" /> Photo</>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alerts */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Alerts</h2>
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No alerts. Everything looks good!</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div key={alert.id} className={`rounded-xl border p-4 flex items-start gap-3 ${alert.type === "warning" ? "border-brand-orange/30 bg-brand-orange/5" : "border-primary/30 bg-primary/5"}`}>
                      {alert.type === "warning" ? <AlertTriangle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> : <Bell className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{alert.message}</p>
                        <button onClick={() => db.markAlertRead(alert.id).then(fetchData)} className="text-xs text-primary mt-1 hover:underline">Mark as read</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
      <Icon className="w-5 h-5" />{label}
    </button>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
    </div>
  );
}

function ProjectCard({ project, onEdit, onDelete }: { project: Project; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{project.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Milestone: {project.milestone ?? "—"}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${project.status === "On Track" ? "bg-primary/10 text-primary" : project.status === "Delayed" ? "bg-brand-orange/10 text-brand-orange" : "bg-green-100 text-green-700"}`}>
            {project.status}
          </span>
          <button onClick={onEdit} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
          <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-foreground">{project.progress}%</span>
        </div>
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${project.status === "On Track" ? "bg-primary" : project.status === "Delayed" ? "bg-brand-orange" : "bg-green-500"}`} style={{ width: `${project.progress}%` }} />
        </div>
      </div>
      {project.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{project.description}</p>}
      <p className="text-xs text-muted-foreground mt-2">Updated: {new Date(project.updated_at).toLocaleDateString()}</p>
    </div>
  );
}

function InputField({ label, value, onChange, required, textarea }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; textarea?: boolean }) {
  const cls = "w-full px-4 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} required={required} className={`${cls} py-3 resize-none`} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} required={required} className={`${cls} h-11`} />
      )}
    </div>
  );
}
