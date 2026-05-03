import { motion } from "framer-motion";
import { BarChart3, Camera, Bell, Users } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Track percentage completion with milestone-based updates from Foundation to Finishing.",
  },
  {
    icon: Camera,
    title: "Daily Visual Updates",
    description: "Upload timestamped images with descriptions to maintain a visual activity log.",
  },
  {
    icon: Bell,
    title: "AI-Based Alerts",
    description: "Get notified about delays, missed milestones, and inactive projects automatically.",
  },
  {
    icon: Users,
    title: "Client Portal",
    description: "Give clients transparent, read-only access to view progress updates in real time.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-surface">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Everything you need to <span className="text-primary">deliver on time</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Powerful features designed specifically for construction teams.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
