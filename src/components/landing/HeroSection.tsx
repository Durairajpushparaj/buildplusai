import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroDashboard from "@/assets/hero-dashboard.jpg";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            Now in Beta — Join early
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Smarter construction tracking.{" "}
            <span className="text-primary">Faster project completion.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
            BuildPlus centralizes progress tracking, provides visual updates, and delivers intelligent alerts to keep projects on schedule.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/auth">
              <Button variant="hero" size="xl">Start Free Trial</Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="hero-outline" size="xl">See How It Works</Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required · Free forever for small teams</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
            <img src={heroDashboard} alt="BuildPlus dashboard showing construction project tracking" className="w-full" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-brand-orange/20 rounded-full blur-2xl" />
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
