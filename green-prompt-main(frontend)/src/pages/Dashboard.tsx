// export default Dashboard;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Leaf,
  Award,
  History as HistoryIcon,
  BarChart3,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  PageTransition,
  staggerContainer,
  fadeUpItem,
  hoverLift,
} from "@/components/ui/PageTransition";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const API_URL = "http://localhost:5000";

/* ✅ TYPE DEFINITION */
interface PromptHistory {
  id: number;
  prompt: string;
  tokens: number;
  co2: number;
  green_score: number;
  created_at: string;
}

const Dashboard = () => {
  const [history, setHistory] = useState<PromptHistory[]>([
  {
    id: 1,
    prompt: "Explain climate change in simple words",
    tokens: 120,
    co2: 0.002,
    green_score: 78,
    created_at: "2025-02-01T10:00:00"
  },
  {
    id: 2,
    prompt: "Write a paragraph on trees",
    tokens: 90,
    co2: 0.0015,
    green_score: 85,
    created_at: "2025-02-02T12:30:00"
  },
  {
    id: 3,
    prompt: "Benefits of renewable energy",
    tokens: 150,
    co2: 0.0025,
    green_score: 92,
    created_at: "2025-02-03T15:45:00"
  },
  {id: 4,
    prompt:
      "So I really really wanted to ask you a doubt from many days what are the most trending skills in engineering and what do I need to study to be the best from all",
    tokens: 50,
    co2: 0.0008,
    green_score: 80,
    created_at: "2026-02-05T18:00:00+05:30"
  },
  {
    id: 5,
    prompt:
      "I am feeling very nervous today because of our hackathon review — how will the judges evaluate our EcoPrompt project about the environment?",
    tokens: 45,
    co2: 0.0007,
    green_score: 75,
    created_at: "2026-02-05T18:05:00+05:30"
  }
]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${API_URL}/history`)
      .then((res) => res.json())
      .then((data: PromptHistory[]) => {
        console.log("HISTORY DATA:", data);
        setHistory(data);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ----- Derived Stats ----- */
  const totalPrompts = history.length;
  const totalCo2 = history.reduce((sum, p) => sum + p.co2, 0);
  const avgGreenScore =
    history.reduce((sum, p) => sum + p.green_score, 0) /
    (history.length || 1);

  const statsCards = [
    {
      icon: Leaf,
      title: "Total CO₂ Emitted",
      value: `${totalCo2.toFixed(3)} kg`,
    },
    {
      icon: TrendingUp,
      title: "Total Prompts",
      value: totalPrompts.toString(),
    },
    {
      icon: Award,
      title: "Average Green Score",
      value: Math.round(avgGreenScore).toString(),
    },
  ];

  /* Chart data */
  const chartData = history
    .slice()
    .reverse()
    .map((item) => ({
      date: new Date(item.created_at).toLocaleDateString(),
      co2: item.co2,
    }));

  return (
    <Layout>
      <PageTransition>
        <section className="eco-section">
          <div className="eco-container">
            <motion.h1
              variants={fadeUpItem}
              initial="initial"
              animate="animate"
              className="text-4xl font-bold mb-8"
            >
              Your <span className="text-primary">Dashboard</span>
            </motion.h1>

            {/* Stats Cards */}
            <motion.div
              className="grid gap-6 md:grid-cols-3 mb-12"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {statsCards.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    variants={fadeUpItem}
                    {...hoverLift}
                    className="eco-card p-6"
                  >
                    <Icon className="h-6 w-6 text-primary" />
                    <p className="text-sm text-muted-foreground mt-4">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Chart */}
            <div className="eco-card p-6 mb-10">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">CO₂ Over Time</h2>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="co2"
                      stroke="#16a34a"
                      fill="#16a34a33"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* History Table */}
            <div className="eco-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <HistoryIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Prompt History</h2>
              </div>

              {loading ? (
                <p>Loading history...</p>
              ) : history.length === 0 ? (
                <p>No history found.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Prompt</th>
                      <th className="text-right py-2">CO₂</th>
                      <th className="text-right py-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 text-sm">
                          {new Date(item.created_at).toLocaleString()}
                        </td>
                        <td className="py-2 text-sm max-w-[300px] truncate">
                          {item.prompt}
                        </td>
                        <td className="py-2 text-right">
                          {item.co2.toFixed(3)}
                        </td>
                        <td className="py-2 text-right font-semibold text-primary">
                          {item.green_score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default Dashboard;