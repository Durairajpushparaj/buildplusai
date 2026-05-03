import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2, Home, FolderKanban, Bell, LogOut, Plus, Upload, Clock,
  AlertTriangle, CheckCircle2, TrendingUp, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BuildPlus" },
      { name: "description", content: "Manage your construction projects with BuildPlus dashboard." },
    ],
  }),
  component: DashboardPage,
});

interface Project {
  id: string;
  name: string;
  progress: number;
  status: "On Track" | "Delayed";
  milestone: string;
  lastUpdate: string;
}

interface Update {
  id: string;
  project: string;
  description: string;
  timestamp: string;
  hasImage: boolean;
}

interface Alert {
  id: string;
  message: string;
  type: "warning" | "info";
}

const mockProjects: Project[] = [
  { id: "1", name: "Riverside Apartments", progress: 72, status: "On Track", milestone: "Structure", lastUpdate: "2 hours ago" },
  { id: "2", name: "Metro Office Complex", progress: 45, status: "Delayed", milestone: "Foundation", lastUpdate: "1 day ago" },
  { id: "3", name: "Green Valley Villas", progress: 91, status: "On Track", milestone: "Finishing", lastUpdate: "30 min ago" },
  { id: "4", name: "Central Mall Renovation", progress: 18, status: "On Track", milestone: "Foundation", lastUpdate: "5 hours ago" },
];

const mockUpdates: Update[] = [
  { id: "1", project: "Riverside Apartments", description: "Completed 3rd floor framing. Electrical rough-in scheduled for tomorrow.", timestamp: "Today, 2:30 PM", hasImage: true },
  { id: "2", project: "Green Valley Villas", description: "Interior painting complete on units 1-4. Final inspection pending.", timestamp: "Today, 11:15 AM", hasImage: true },
  { id: "3", project: "Central Mall Renovation", description: "Foundation excavation started. Soil testing results received.", timestamp: "Yesterday, 4:00 PM", hasImage: false },
];

const mockAlerts: Alert[] = [
  { id: "1", message: "Metro Office Complex — No updates in 3 days", type: "warning" },
  { id: "2", message: "Riverside Apartments — Milestone 'Structure' is 5 days behind schedule", type: "warning" },
  { id: "3", message: "Green Valley Villas — Approaching final milestone", type: "info" },
];

function DashboardPage() {
  const [showAddUpdate, setShowAddUpdate] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border p-6">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            Build<span className="text-brand-orange">Plus</span>
          </span>
        </Link>

        <nav className="space-y-1 flex-1">
          <SidebarItem icon={Home} label="Dashboard" active />
          <SidebarItem icon={FolderKanban} label="Projects" />
          <SidebarItem icon={Bell} label="Alerts" />
        </nav>

        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-4 h-4" /> Log out
        </Link>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your project overview.</p>
            </div>
            <Button variant="orange" onClick={() => setShowAddUpdate(!showAddUpdate)} className="gap-2">
              <Plus className="w-4 h-4" /> Add Update
            </Button>
          </div>

          {/* Add Update Form */}
          {showAddUpdate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-card rounded-2xl border border-border p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">New Update</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Project</label>
                  <select className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {mockProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Upload Image</label>
                  <div className="h-11 border border-dashed border-input rounded-lg flex items-center justify-center gap-2 text-sm text-muted-foreground cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-4 h-4" /> Choose file
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe today's progress..."
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="hero" size="default">Submit Update</Button>
                <Button variant="ghost" size="default" onClick={() => setShowAddUpdate(false)}>Cancel</Button>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Projects" value="4" icon={FolderKanban} />
            <StatCard label="On Track" value="3" icon={CheckCircle2} />
            <StatCard label="Delayed" value="1" icon={AlertTriangle} />
            <StatCard label="Avg Progress" value="56%" icon={TrendingUp} />
          </div>

          {/* Projects */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Projects</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Updates */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Updates</h2>
              <div className="space-y-4">
                {mockUpdates.map((update) => (
                  <div key={update.id} className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{update.project}</p>
                        <p className="text-sm text-muted-foreground mt-1">{update.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> {update.timestamp}
                          </span>
                          {update.hasImage && (
                            <span className="flex items-center gap-1 text-xs text-primary">
                              <Camera className="w-3 h-3" /> Photo attached
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Alerts</h2>
              <div className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-xl border p-4 flex items-start gap-3 ${
                      alert.type === "warning"
                        ? "border-brand-orange/30 bg-brand-orange/5"
                        : "border-primary/30 bg-primary/5"
                    }`}
                  >
                    {alert.type === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    ) : (
                      <Bell className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm text-foreground">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{project.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Milestone: {project.milestone}</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            project.status === "On Track"
              ? "bg-primary/10 text-primary"
              : "bg-brand-orange/10 text-brand-orange"
          }`}
        >
          {project.status}
        </span>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-foreground">{project.progress}%</span>
        </div>
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              project.status === "On Track" ? "bg-primary" : "bg-brand-orange"
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Last update: {project.lastUpdate}</p>
    </div>
  );
}
