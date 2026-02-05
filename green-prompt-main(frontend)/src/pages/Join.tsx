import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Leaf, Mail, Calendar, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import {
  PageTransition,
  staggerContainer,
  fadeUpItem,
} from "@/components/ui/PageTransition";

const roles = ["Student", "Developer", "Researcher", "Professional"];

const benefits = [
  { icon: Mail, title: "Monthly newsletter", description: "Green AI tips & updates" },
  { icon: Award, title: "Green challenges", description: "Compete & earn badges" },
  { icon: Calendar, title: "Workshops and events", description: "Learn from experts" },
];

const Join = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      <PageTransition>
        <section className="eco-section bg-gradient-to-b from-sage-50 to-background">
          <div className="eco-container">
            <div className="max-w-2xl mx-auto">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="text-center mb-12"
              >
                <motion.div variants={fadeUpItem} className="eco-badge mx-auto mb-4">
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Be Part of the Change
                </motion.div>
                <motion.h1
                  variants={fadeUpItem}
                  className="text-4xl font-bold md:text-5xl"
                >
                  Join the <span className="text-primary">Movement</span>
                </motion.h1>
                <motion.p
                  variants={fadeUpItem}
                  className="mt-4 text-lg text-muted-foreground"
                >
                  Connect with thousands working towards sustainable AI.
                </motion.p>
              </motion.div>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="eco-card p-8 shadow-eco-xl"
                  >
                    <motion.div
                      className="space-y-6"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {[
                        { id: "name", label: "Name *", type: "text", placeholder: "Your full name", required: true },
                        { id: "email", label: "Email *", type: "email", placeholder: "you@example.com", required: true },
                        { id: "organization", label: "College / Company", type: "text", placeholder: "Your organization", required: false },
                      ].map((field, i) => (
                        <motion.div key={field.id} variants={fadeUpItem}>
                          <label
                            htmlFor={field.id}
                            className="block text-sm font-medium text-foreground mb-2"
                          >
                            {field.label}
                          </label>
                          <motion.input
                            type={field.type}
                            id={field.id}
                            name={field.id}
                            required={field.required}
                            value={(formData as any)[field.id]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className="eco-input"
                            whileFocus={{ boxShadow: "0 0 0 3px hsl(152 76% 36% / 0.15)" }}
                          />
                        </motion.div>
                      ))}

                      <motion.div variants={fadeUpItem}>
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Role *
                        </label>
                        <select
                          id="role"
                          name="role"
                          required
                          value={formData.role}
                          onChange={handleChange}
                          className="eco-input"
                        >
                          <option value="">Select your role</option>
                          {roles.map((role) => (
                            <option key={role} value={role.toLowerCase()}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div variants={fadeUpItem}>
                        <label
                          htmlFor="reason"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Why do you care about the environment?
                        </label>
                        <motion.textarea
                          id="reason"
                          name="reason"
                          rows={4}
                          value={formData.reason}
                          onChange={handleChange}
                          placeholder="Share your motivation..."
                          className="eco-input resize-none"
                          whileFocus={{ boxShadow: "0 0 0 3px hsl(152 76% 36% / 0.15)" }}
                        />
                      </motion.div>

                      <motion.div
                        variants={fadeUpItem}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button
                          type="submit"
                          variant="eco"
                          size="xl"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <motion.span
                                className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Joining...
                            </span>
                          ) : (
                            <>
                              <Leaf className="mr-2 h-5 w-5" />
                              Join Green AI Community
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="eco-card p-12 shadow-eco-xl text-center"
                  >
                    <motion.div
                      className="flex justify-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <motion.div
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                      </motion.div>
                    </motion.div>
                    <motion.h2
                      className="text-3xl font-bold mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Welcome to Green AI Community 🌱
                    </motion.h2>
                    <motion.p
                      className="text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      You're now part of a global movement for sustainable AI.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Benefits */}
              <motion.div
                className="mt-12 grid gap-4 sm:grid-cols-3"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={benefit.title}
                    variants={fadeUpItem}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default Join;
