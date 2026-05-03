import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For freelancers and small teams",
    features: ["Up to 2 projects", "5 team members", "Daily photo updates", "Basic progress tracking"],
    cta: "Get Started",
    variant: "hero-outline" as const,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing construction companies",
    features: ["Unlimited projects", "25 team members", "AI-based alerts", "Client portal access", "Priority support"],
    cta: "Start Free Trial",
    variant: "hero" as const,
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$79",
    period: "/month",
    description: "For enterprise construction firms",
    features: ["Everything in Pro", "Unlimited team members", "Custom branding", "API access", "Dedicated account manager", "Advanced analytics"],
    cta: "Contact Sales",
    variant: "hero-outline" as const,
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 bg-surface">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Simple, transparent <span className="text-primary">pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free. Scale as your business grows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-2xl p-8 border ${
                plan.highlighted
                  ? "border-primary bg-card shadow-xl shadow-primary/10 relative"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-brand-orange-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block mt-8">
                <Button variant={plan.variant} size="lg" className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
