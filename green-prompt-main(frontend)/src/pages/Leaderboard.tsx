import { motion } from "framer-motion";
import { Trophy, Building2, GraduationCap, Users, Medal } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  PageTransition,
  staggerContainer,
  fadeUpItem,
} from "@/components/ui/PageTransition";

const collegesData = [
  { rank: 1, name: "MIT", avgCo2: "0.12g", greenScore: 98 },
  { rank: 2, name: "Stanford University", avgCo2: "0.14g", greenScore: 96 },
  { rank: 3, name: "UC Berkeley", avgCo2: "0.15g", greenScore: 94 },
  { rank: 4, name: "Carnegie Mellon", avgCo2: "0.16g", greenScore: 92 },
  { rank: 5, name: "Harvard University", avgCo2: "0.18g", greenScore: 89 },
];

const companiesData = [
  { rank: 1, name: "Patagonia", avgCo2: "0.10g", greenScore: 99 },
  { rank: 2, name: "Tesla", avgCo2: "0.12g", greenScore: 97 },
  { rank: 3, name: "Google", avgCo2: "0.13g", greenScore: 95 },
  { rank: 4, name: "Microsoft", avgCo2: "0.14g", greenScore: 93 },
  { rank: 5, name: "Apple", avgCo2: "0.15g", greenScore: 91 },
];

const usersData = [
  { rank: 1, name: "EcoSarah", points: 15420, co2Saved: "4.2kg" },
  { rank: 2, name: "GreenDev_Mike", points: 12850, co2Saved: "3.8kg" },
  { rank: 3, name: "ClimateChampion", points: 11200, co2Saved: "3.2kg" },
  { rank: 4, name: "SustainableAI", points: 9800, co2Saved: "2.9kg" },
  { rank: 5, name: "EcoPromptPro", points: 8650, co2Saved: "2.5kg" },
];

const getRankBadge = (rank: number) => {
  if (rank === 1) return { color: "text-amber-500", bg: "bg-amber-500/10" };
  if (rank === 2) return { color: "text-slate-400", bg: "bg-slate-400/10" };
  if (rank === 3) return { color: "text-amber-700", bg: "bg-amber-700/10" };
  return { color: "text-muted-foreground", bg: "bg-secondary" };
};

interface LeaderboardTableProps {
  title: string;
  icon: React.ElementType;
  data: Array<{
    rank: number;
    name: string;
    avgCo2?: string;
    greenScore?: number;
    points?: number;
    co2Saved?: string;
  }>;
  columns: Array<{ key: string; label: string; align?: "left" | "right" }>;
  delay?: number;
}

const LeaderboardTable = ({ title, icon: Icon, data, columns, delay = 0 }: LeaderboardTableProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="eco-card overflow-hidden"
  >
    <motion.div
      className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 border-b border-border"
      whileHover={{ backgroundColor: "hsl(152 76% 36% / 0.08)" }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="h-5 w-5 text-primary" />
        </motion.div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
    </motion.div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-4 text-sm font-medium text-muted-foreground ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const badge = getRankBadge(item.rank);
            return (
              <motion.tr
                key={index}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.1 + index * 0.05 }}
                whileHover={{ backgroundColor: "hsl(140, 25%, 94%)" }}
              >
                <td className="py-4 px-4">
                  <motion.div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${badge.bg}`}
                    whileHover={{ scale: 1.15, rotate: item.rank <= 3 ? [0, -10, 10, 0] : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.rank <= 3 ? (
                      <Medal className={`h-4 w-4 ${badge.color}`} />
                    ) : (
                      <span className={`text-sm font-bold ${badge.color}`}>
                        {item.rank}
                      </span>
                    )}
                  </motion.div>
                </td>
                {columns.slice(1).map((col) => (
                  <td
                    key={col.key}
                    className={`py-4 px-4 text-sm ${
                      col.align === "right" ? "text-right" : "text-left"
                    } ${
                      col.key === "greenScore" || col.key === "points"
                        ? "font-semibold text-primary"
                        : ""
                    }`}
                  >
                    {col.key === "greenScore" && (item as any)[col.key]
                      ? `${(item as any)[col.key]}/100`
                      : col.key === "points" && (item as any)[col.key]
                      ? (item as any)[col.key].toLocaleString()
                      : (item as any)[col.key]}
                  </td>
                ))}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </motion.div>
);

const Leaderboard = () => {
  return (
    <Layout>
      <PageTransition>
        <section className="eco-section bg-gradient-to-b from-sage-50 to-background">
          <div className="eco-container">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="text-center mb-12"
            >
              <motion.div variants={fadeUpItem} className="eco-badge mx-auto mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="mr-1.5 h-4 w-4" />
                </motion.div>
                Green AI Champions
              </motion.div>
              <motion.h1
                variants={fadeUpItem}
                className="text-4xl font-bold md:text-5xl"
              >
                Green <span className="text-primary">Leaderboard</span>
              </motion.h1>
              <motion.p
                variants={fadeUpItem}
                className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                See who's leading the charge in sustainable AI usage. Compete,
                climb the ranks, and make a difference!
              </motion.p>
            </motion.div>

            <div className="space-y-8">
              <LeaderboardTable
                title="Top Colleges"
                icon={GraduationCap}
                data={collegesData}
                columns={[
                  { key: "rank", label: "Rank" },
                  { key: "name", label: "College" },
                  { key: "avgCo2", label: "Avg CO₂", align: "right" },
                  { key: "greenScore", label: "Green Score", align: "right" },
                ]}
                delay={0}
              />

              <LeaderboardTable
                title="Top Companies"
                icon={Building2}
                data={companiesData}
                columns={[
                  { key: "rank", label: "Rank" },
                  { key: "name", label: "Company" },
                  { key: "avgCo2", label: "Avg CO₂", align: "right" },
                  { key: "greenScore", label: "Green Score", align: "right" },
                ]}
                delay={0.1}
              />

              <LeaderboardTable
                title="Top Individual Users"
                icon={Users}
                data={usersData}
                columns={[
                  { key: "rank", label: "Rank" },
                  { key: "name", label: "Name" },
                  { key: "points", label: "Green Points", align: "right" },
                  { key: "co2Saved", label: "CO₂ Saved", align: "right" },
                ]}
                delay={0.2}
              />
            </div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default Leaderboard;
