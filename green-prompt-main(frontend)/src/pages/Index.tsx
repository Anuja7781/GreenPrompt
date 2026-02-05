import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Droplets, Cloud, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import {
  PageTransition,
  staggerContainer,
  fadeUpItem,
  hoverLift,
  hoverGlow,
} from "@/components/ui/PageTransition";

const impactCards = [
  {
    icon: Zap,
    title: "Energy Use",
    description: "AI queries consume electricity in data centers.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Droplets,
    title: "Water Use",
    description: "Cooling AI servers requires large amounts of water.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Cloud,
    title: "Carbon Emissions",
    description: "Long prompts increase CO₂ footprint.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("chatgpt");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    tokens: number;
    co2: string;
    score: number;
  } | null>(null);

  const handleAnalyze = () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const tokenCount = prompt.split(/\s+/).length * 1.3;
      setResults({
        tokens: Math.round(tokenCount),
        co2: (tokenCount * 0.0004).toFixed(4),
        score: Math.max(20, 100 - Math.round(tokenCount * 0.5)),
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <Layout>
      <PageTransition>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sage-50 to-background">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-60 -left-40 h-60 w-60 rounded-full bg-accent/10 blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          <div className="eco-container relative">
            <motion.div
              className="flex flex-col items-center py-20 md:py-32 text-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeUpItem} className="eco-badge mb-6">
                <Sparkles className="mr-1.5 h-4 w-4" />
                Sustainable AI for Everyone
              </motion.div>

              <motion.h1
                variants={fadeUpItem}
                className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Reduce AI's Carbon Footprint —{" "}
                <span className="eco-gradient-text">One Prompt at a Time</span>
              </motion.h1>

              <motion.p
                variants={fadeUpItem}
                className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
              >
                Analyze, optimize, and track the environmental impact of your AI
                prompts in real time.
              </motion.p>

              <motion.div
                variants={fadeUpItem}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <motion.div {...hoverLift}>
                  <Button variant="eco" size="lg" asChild>
                    <Link to="/analyzer">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div {...hoverLift}>
                  <Button variant="eco-outline" size="lg" asChild>
                    <Link to="/analyzer">See How It Works</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Impact Cards */}
        <section className="eco-section bg-background">
          <div className="eco-container">
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
            >
              {impactCards.map((card) => (
                <motion.div
                  key={card.title}
                  variants={fadeUpItem}
                  {...hoverLift}
                  {...hoverGlow}
                  className="eco-card-hover text-center cursor-default"
                >
                  <motion.div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                  >
                    <card.icon className={`h-7 w-7 ${card.color}`} />
                  </motion.div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="mt-2 text-muted-foreground">{card.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section className="eco-section bg-sage-50">
          <div className="eco-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl"
            >
              <div className="text-center mb-10">
                <motion.h2
                  className="text-3xl font-bold md:text-4xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Try It <span className="text-primary">Now</span>
                </motion.h2>
                <motion.p
                  className="mt-3 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  See how your prompts impact the environment
                </motion.p>
              </div>

              <motion.div
                className="eco-card p-8 shadow-eco-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-4">
                  <motion.textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Type your prompt here…"
                    className="eco-input min-h-[120px] resize-none"
                    whileFocus={{ boxShadow: "0 0 0 3px hsl(152 76% 36% / 0.15)" }}
                  />

                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="eco-input sm:w-48"
                    >
                      <option value="chatgpt">ChatGPT</option>
                      <option value="claude">Claude</option>
                      <option value="gemini">Gemini</option>
                    </select>

                    <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        variant="eco"
                        size="lg"
                        className="w-full"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !prompt.trim()}
                      >
                        {isAnalyzing ? (
                          <span className="flex items-center gap-2">
                            <motion.span
                              className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Analyzing...
                          </span>
                        ) : (
                          "Analyze Prompt"
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Results */}
                <motion.div
                  className="mt-8 grid gap-4 sm:grid-cols-3"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {[
                    { label: "Tokens", value: results?.tokens ?? "—", accent: false },
                    { label: "Estimated CO₂", value: results ? `${results.co2}g` : "—", accent: false },
                    { label: "Green Score", value: results ? `${results.score}/100` : "—", accent: true },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      variants={fadeUpItem}
                      className={`rounded-xl p-4 text-center transition-all duration-300 ${
                        item.accent ? "bg-primary/10" : "bg-secondary"
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <motion.p
                        className={`mt-1 text-2xl font-bold ${item.accent ? "text-primary" : "text-foreground"}`}
                        key={String(item.value)}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.value}
                      </motion.p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="eco-section bg-charcoal-900">
          <div className="eco-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-xl text-sage-100 md:text-2xl lg:text-3xl font-medium"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                If{" "}
                <motion.span
                  className="text-primary font-bold"
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  1 million people
                </motion.span>{" "}
                optimize their prompts, we can save{" "}
                <motion.span
                  className="text-accent font-bold"
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  tons of CO₂
                </motion.span>{" "}
                per year.
              </motion.p>
              <motion.div
                className="mt-10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="eco" size="xl" asChild>
                  <Link to="/join">
                    Join the Movement
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default Index;
