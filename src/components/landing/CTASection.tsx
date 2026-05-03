import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl text-center bg-primary rounded-3xl p-12 md:p-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
            Ready to build smarter?
          </h2>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">
            Join hundreds of construction teams already using BuildPlus to deliver projects on time and under budget.
          </p>
          <Link to="/auth" className="inline-block mt-8">
            <Button variant="orange" size="xl" className="gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
