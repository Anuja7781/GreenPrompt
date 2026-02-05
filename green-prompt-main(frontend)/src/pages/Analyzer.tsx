import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Leaf, Zap, Cloud, Sparkles, RefreshCw, 
  TrendingDown, CheckCircle, AlertTriangle 
} from "lucide-react";

type ModelKey = "gpt4" | "gemini" | "claude" | "llama";

const MODELS = {
  gpt4: { name: "GPT-4", co2: 0.00004, energy: 0.00002 },
  gemini: { name: "Gemini", co2: 0.00003, energy: 0.000015 },
  claude: { name: "Claude", co2: 0.00002, energy: 0.00001 },
  llama: { name: "Llama", co2: 0.000015, energy: 0.000008 }
};

type AnalysisResult = {
  original: {
    prompt: string;
    tokens: number;
    co2: string;
    energy: string;
  };
  optimized?: {
    prompt: string;
    tokens: number;
    co2: string;
    energy: string;
    reduction: number;
  };
  savings?: {
    tokens: number;
    co2: string;
    energy: string;
    reductionPercent: number;
  };
  green_score: number;
  note?: string;
};

const Analyzer = () => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<ModelKey>("gpt4");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  /* ---------- LIVE CALCULATIONS ---------- */
  const chars = prompt.length;
  const tokens = Math.ceil(chars / 4);
  const co2 = tokens * MODELS[model].co2;
  const energy = tokens * MODELS[model].energy;

  /* ---------- ECO BAR ---------- */
  let meterColor = "bg-muted";
  let meterText = "Start typing to see impact";
  let meterWidth = "0%";

  if (tokens > 0 && tokens <= 50) {
    meterColor = "bg-green-500";
    meterText = "Eco-Friendly";
    meterWidth = `${(tokens / 50) * 33}%`;
  } else if (tokens > 50 && tokens <= 100) {
    meterColor = "bg-yellow-500";
    meterText = "Moderate impact";
    meterWidth = `${33 + ((tokens - 50) / 50) * 33}%`;
  } else if (tokens > 100) {
    meterColor = "bg-red-500";
    meterText = "High carbon footprint";
    meterWidth = `${66 + Math.min((tokens - 100) / 50, 1) * 34}%`;
  }

  /* ---------- API FUNCTIONS ---------- */
  const handleAnalyze = async () => {
  if (!prompt.trim()) return;
  setIsAnalyzing(true);

  try {
    // Use the selected model directly; fallback to 'gpt4' if somehow undefined
    const selectedModel: ModelKey = model || 'gpt4';

    const response = await fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        model: selectedModel  // Correctly sends the chosen model
      })
    });

    const data = await response.json();
    setResults(data);
  } catch (error) {
    console.error('Analysis error:', error);
    alert('Failed to analyze prompt. Please try again.');
  } finally {
    setIsAnalyzing(false);
  }
};


  const handleOptimize = async () => {
  if (!prompt.trim()) return;
  setIsOptimizing(true);

  try {
    // Use the selected model directly; fallback to 'gpt4' if undefined
    const selectedModel: ModelKey = model || 'gpt4';

    const response = await fetch('http://localhost:5000/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        model: selectedModel  // Send the actual selected model
      })
    });

    const data = await response.json();
    setResults(data);

    if (data.note) {
      console.log("Note:", data.note);
    }
  } catch (error) {
    console.error('Optimization error:', error);
    alert('Optimization failed. Please check backend connection.');
  } finally {
    setIsOptimizing(false);
  }
};

// Apply the optimized prompt to the textarea
const useOptimized = () => {
  if (results?.optimized?.prompt) {
    setPrompt(results.optimized.prompt);
  }
};


  /* ---------- RULE-BASED OPTIMIZATION (FALLBACK) ---------- */
  const optimizedText = useMemo(() => {
    let text = prompt;
    const replacements: Record<string, string> = {
      "in order to": "to",
      "due to the fact that": "because",
      "at this point in time": "now",
      "in my humble opinion": "",
      "with regard to": "about",
      "in the event that": "if",
      "prior to": "before",
      "subsequent to": "after",
      "in the near future": "soon",
      "it is important to note that": "",
      "as a matter of fact": "",
      "for all intents and purposes": "",
      "really": "",
      "very": "",
      "actually": "",
      "basically": "",
      "certainly": "",
      "quite": "",
      "somewhat": "",
      "rather": "",
      "pretty": ""
    };

    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      text = text.replace(regex, value);
    });

    return text.replace(/\s+/g, " ").trim();
  }, [prompt]);

  return (
    <Layout>
      <section className="eco-section">
        <div className="eco-container max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="text-center mb-10">
            <motion.h1 
              className="text-4xl font-bold text-primary mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Green Text Analyzer
            </motion.h1>
            <p className="text-muted-foreground">
              Reduce your AI's carbon footprint with Grok-powered optimization
            </p>
          </div>

          {/* MODEL SELECTION */}
          <div className="grid sm:grid-cols-4 gap-3 mb-8">
            {Object.entries(MODELS).map(([key, m]) => (
              <button
                key={key}
                onClick={() => setModel(key as ModelKey)}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  model === key
                    ? "border-primary bg-primary/5 shadow-eco-sm"
                    : "border-border hover:border-primary/40 hover:bg-secondary"
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(m.co2 * 1000).toFixed(3)} mg CO₂/token
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* TEXT AREA */}
          <div className="mb-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your AI prompt here… Example: 'In my humble opinion, I really think that at this point in time we should reduce energy usage.'"
              className="eco-input w-full min-h-[160px] mb-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{chars} characters</span>
              <span>{tokens} estimated tokens</span>
            </div>
          </div>

          {/* ECO BAR */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{meterText}</span>
              <span className={`text-sm font-medium ${
                tokens <= 50 ? "text-green-600" : 
                tokens <= 100 ? "text-yellow-600" : "text-red-600"
              }`}>
                {tokens <= 50 ? "✅ Good" : tokens <= 100 ? "⚠️ Could be better" : "❌ Needs optimization"}
              </span>
            </div>
            
            <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
              <motion.div
                className={`h-full ${meterColor}`}
                animate={{ width: meterWidth }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>Eco (50)</span>
              <span>Moderate (100)</span>
              <span>High (150+)</span>
            </div>
          </div>

          {/* LIVE METRICS */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="eco-card p-5 text-center">
              <Zap className="mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Live Tokens</p>
              <p className="text-2xl font-bold mt-1">{tokens}</p>
            </div>
            <div className="eco-card p-5 text-center">
              <Cloud className="mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Estimated CO₂</p>
              <p className="text-2xl font-bold mt-1">{co2.toFixed(6)}g</p>
            </div>
            <div className="eco-card p-5 text-center">
              <Leaf className="mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Estimated Energy</p>
              <p className="text-2xl font-bold mt-1">{energy.toFixed(6)} kWh</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button
              variant="eco"
              size="lg"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !prompt.trim()}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Prompt
                </>
              )}
            </Button>
            
            <Button
              variant="eco-outline"
              size="lg"
              onClick={handleOptimize}
              disabled={isOptimizing || !prompt.trim()}
              className="flex-1"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Optimizing with Grok...
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Optimize with AI
                </>
              )}
            </Button>
          </div>

          {/* RESULTS SECTION */}
          {results && (
            <motion.div 
              className="mt-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* COMPARISON TABLE */}
              <div className="eco-card p-6">
                <h3 className="text-xl font-bold text-primary mb-4">
                  Analysis Results
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Metric</th>
                        <th className="text-right py-3 px-2">Original</th>
                        {results.optimized && (
                          <th className="text-right py-3 px-2">Optimized</th>
                        )}
                        {results.savings && (
                          <th className="text-right py-3 px-2 text-green-600">Savings</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-2 font-medium">Tokens</td>
                        <td className="py-3 px-2 text-right">{results.original.tokens}</td>
                        {results.optimized && (
                          <td className="py-3 px-2 text-right">{results.optimized.tokens}</td>
                        )}
                        {results.savings && (
                          <td className="py-3 px-2 text-right text-green-600">
                            -{results.savings.tokens} ({results.savings.reductionPercent}%)
                          </td>
                        )}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-2 font-medium">CO₂ (g)</td>
                        <td className="py-3 px-2 text-right">{results.original.co2}</td>
                        {results.optimized && (
                          <td className="py-3 px-2 text-right">{results.optimized.co2}</td>
                        )}
                        {results.savings && (
                          <td className="py-3 px-2 text-right text-green-600">
                            -{results.savings.co2}g
                          </td>
                        )}
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-medium">Energy (kWh)</td>
                        <td className="py-3 px-2 text-right">{results.original.energy}</td>
                        {results.optimized && (
                          <td className="py-3 px-2 text-right">{results.optimized.energy}</td>
                        )}
                        {results.savings && (
                          <td className="py-3 px-2 text-right text-green-600">
                            -{results.savings.energy}kWh
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    <span className="font-medium">Green Score:</span>
                    <span className="ml-2 text-xl font-bold text-primary">
                      {results.green_score}/100
                    </span>
                  </div>
                  {results.note && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                      {results.note}
                    </p>
                  )}
                </div>
              </div>

              {/* OPTIMIZED PROMPT PREVIEW */}
              {results.optimized && (
                <motion.div 
                  className="eco-card p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-primary">
                      Optimized Prompt
                    </h3>
                    <Button
                      variant="eco"
                      size="sm"
                      onClick={useOptimized}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Use Optimized Version
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {results.optimized.prompt}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    <span>Reduced by {results.optimized.reduction}%</span>
                  </div>
                </motion.div>
              )}

              {/* RULE-BASED OPTIMIZATION (FALLBACK) */}
              {!results.optimized && optimizedText !== prompt && (
                <div className="eco-card p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">
                    Rule-Based Optimization
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Try AI optimization for better results:
                  </p>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm">{optimizedText}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Analyzer;