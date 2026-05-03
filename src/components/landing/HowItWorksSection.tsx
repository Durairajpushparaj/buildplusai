import { motion } from "framer-motion";
import { ClipboardList, Upload, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Create Your Project",
    description: "Add project details, set milestones, and invite your team members.",
  },
  {
    icon: Upload,
    step: "02",
    title: "Upload Daily Updates",
    description: "Post progress photos and notes. Everything is timestamped automatically.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Track & Deliver",
    description: "Monitor progress, receive smart alerts, and keep stakeholders informed.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Get started in <span className="text-brand-orange">3 simple steps</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From setup to real-time tracking in minutes, not days.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="text-6xl font-black text-primary/10 mb-4">{s.step}</div>
              <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-7 h-7 text-brand-orange" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
