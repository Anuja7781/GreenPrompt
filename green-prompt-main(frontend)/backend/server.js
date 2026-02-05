require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const axios = require("axios");

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Model names MUST MATCH frontend
const MODELS = {
  'gpt4': { name: 'GPT-4', co2PerToken: 0.00004, energyPerToken: 0.00002 },
  'gemini': { name: 'Gemini', co2PerToken: 0.00003, energyPerToken: 0.000015 },
  'claude': { name: 'Claude', co2PerToken: 0.00002, energyPerToken: 0.00001 },
  'llama': { name: 'Llama', co2PerToken: 0.000015, energyPerToken: 0.000008 }
};

// Helper functions
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// ENHANCED rule-based optimization (presentation-ready)
function optimizeWithRules(text) {
  console.log("🔧 Using rule-based optimization (enhanced, presentation-ready)...");

  if (!text || !text.trim()) return "";

  let optimized = text;

  // -----------------------------
  // 1️⃣ Normalize text
  // -----------------------------
  optimized = optimized.trim();                   
  optimized = optimized.replace(/\s+/g, " ");    
  optimized = optimized.replace(/\s*([.,!?;:])\s*/g, "$1 ");

  // -----------------------------
  // 2️⃣ Lowercase for consistent processing
  // -----------------------------
  let lowerText = optimized.toLowerCase();

  // -----------------------------
  // 3️⃣ Remove filler words and weak phrases (expanded version)
  // -----------------------------
  const fillers = [
    "really", "very", "basically", "actually", "certainly", "quite", 
    "somewhat", "rather", "pretty", "just", "simply", "essentially",
    "i think", "in my humble opinion", "as a matter of fact", "for all intents and purposes",
    "kind of", "sort of", "like", "you know", "literally", "totally", "absolutely",
    "obviously", "at the end of the day", "if you ask me", "i guess", "i feel like",
    "in a way", "to be honest", "honestly", "in my opinion", "more or less",
    "by the way", "so yeah", "i mean", "as such", "it seems like", "actually speaking",
    "basically speaking", "for what it's worth", "at this point", "as far as i know"
  ];
  fillers.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    lowerText = lowerText.replace(regex, "");
  });

  // -----------------------------
  // 4️⃣ Replace long phrases with concise equivalents
  // -----------------------------
  const phraseReplacements = [
    { pattern: /\bin order to\b/gi, replacement: "to" },
    { pattern: /\bdue to the fact that\b/gi, replacement: "because" },
    { pattern: /\bat this point in time\b/gi, replacement: "now" },
    { pattern: /\bas soon as possible\b/gi, replacement: "soon" },
    { pattern: /\bwith regard to\b/gi, replacement: "about" },
    { pattern: /\bin the near future\b/gi, replacement: "soon" },
    { pattern: /\bit is important to note\b/gi, replacement: "" },
    { pattern: /\bprior to\b/gi, replacement: "before" },
    { pattern: /\bsubsequent to\b/gi, replacement: "after" },
    { pattern: /\bin the event that\b/gi, replacement: "if" },
    { pattern: /\bat the end of the day\b/gi, replacement: "" },
    { pattern: /\bfor all intents and purposes\b/gi, replacement: "" },
    { pattern: /\bit seems like\b/gi, replacement: "" },
    { pattern: /\bas far as i know\b/gi, replacement: "" }
  ];
  phraseReplacements.forEach(({ pattern, replacement }) => {
    lowerText = lowerText.replace(pattern, replacement);
  });

  // -----------------------------
  // 5️⃣ Remove repeated words
  // -----------------------------
  lowerText = lowerText.replace(/\b(\w+)\s+\1\b/gi, "$1");

  // -----------------------------
  // 6️⃣ Remove unnecessary "that" before verbs
  // -----------------------------
  lowerText = lowerText.replace(/\bthat\s+(?=\w+ing|\w+ed)/gi, "");

  // -----------------------------
  // 7️⃣ Correct common typos (expanded dictionary)
  // -----------------------------
  const typos = {
    "teh": "the",
    "recieve": "receive",
    "definately": "definitely",
    "proplery": "properly",
    "neccessary": "necessary",
    "lve": "love",
    "dount": "doubt",
    "insted": "instead",
    "acheive": "achieve",
    "engeineering": "engineering",
    "stduy": "study",
    "inn": "in",
    "ekdam": "",
    "nee": "need",
    "youu": "you",
    "u": "you",
    "alot": "a lot",
    "becuase": "because",
    "thier": "their",
    "wierd": "weird",
    "woudl": "would"
  };
  Object.entries(typos).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, "gi");
    lowerText = lowerText.replace(regex, correct);
  });

  // -----------------------------
  // 8️⃣ Capitalize first letter of each sentence
  // -----------------------------
  lowerText = lowerText.replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) { return c.toUpperCase(); });

  // -----------------------------
  // 9️⃣ Ensure period at end if missing
  // -----------------------------
  if (!/[.!?]$/.test(lowerText)) lowerText += ".";

  // -----------------------------
  // 🔟 Remove extra spaces around punctuation again
  // -----------------------------
  lowerText = lowerText.replace(/\s*([.,!?;:])\s*/g, "$1 ").replace(/\s+/g, " ").trim();

  // -----------------------------
  // 1️⃣1️⃣ Optional: limit sentence length (split long sentences)
  // -----------------------------
  const sentences = lowerText.split(/(?<=[.!?])/);
  optimized = sentences.map(s => s.trim()).join(" ");

  console.log("✅ Rule-based optimization complete");
  return optimized;
}

// CORRECTED Gemini AI OPTIMIZATION with CURRENT models
// IMPROVED Gemini AI OPTIMIZATION - Conservative and Meaning-Preserving
// SAFE Gemini AI OPTIMIZATION - PRESERVES ALL CONTENT
async function optimizeWithGemini(prompt, model = 'gemini') {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.log("⚠️ Gemini API key not configured, using rule-based");
      return optimizeWithRules(prompt);
    }
    
    console.log("🤖 Using Gemini for SAFE optimization (no content loss)...");
    
    const cleanApiKey = GEMINI_API_KEY.trim();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanApiKey}`;
    
    console.log(`  Using model: gemini-2.5-flash`);
    
    // SUPER SAFE instructions - NO content removal
    const optimizationInstruction = `You are a text editor. Do NOT remove any content from the following text.Dont cut by orignal prompt.The optimized prompt should have the same meaning as the original prompt. Only do these 4 things:

1. Fix obvious spelling mistakes (like "teh" → "the")
2. Fix obvious grammar errors
3. Remove ONLY these specific filler words IF they appear: "really", "very", "just", "basically", "actually"
4.Use high level english vocabulary 
DO NOT:
- Remove any facts, data, or information
- Shorten sentences
- Change the meaning
- Remove any instructions or details
- Cut any content

Return the EXACT same text with only the above minor fixes.

Original text: "${prompt}"

Edited text (same content, minor fixes only):`;

    const response = await axios.post(
      endpoint,
      {
        contents: [{
          parts: [{
            text: optimizationInstruction
          }]
        }],
        generationConfig: {
          temperature: 0.1,  // Very low for consistency
          topP: 0.7,
          maxOutputTokens: Math.max(2000, prompt.length * 1.2), // Plenty of tokens
        }
      },
      {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      let optimized = response.data.candidates[0].content.parts[0].text.trim();
      
      // Clean response
      optimized = optimized
        .replace(/^(Edited text:|Fixed text:|Result:)/i, '')
        .trim()
        .replace(/^["']|["']$/g, '');
      
      // CRITICAL SAFETY CHECK: If result is significantly shorter, discard it
      const originalWordCount = prompt.split(/\s+/).length;
      const optimizedWordCount = optimized.split(/\s+/).length;
      
      if (optimizedWordCount < originalWordCount * 0.9) { // Less than 90% of words
        console.log(`⚠️ Safety check: Gemini removed too many words!`);
        console.log(`   Original: ${originalWordCount} words`);
        console.log(`   Gemini: ${optimizedWordCount} words`);
        console.log(`   Using rule-based instead`);
        return optimizeWithRules(prompt);
      }
      
      // Check if key content is missing
      const originalHasQuestions = prompt.includes('?');
      const optimizedHasQuestions = optimized.includes('?');
      const originalSentences = prompt.split(/[.!?]+/).length;
      const optimizedSentences = optimized.split(/[.!?]+/).length;
      
      if (originalHasQuestions && !optimizedHasQuestions) {
        console.log("⚠️ Gemini removed questions, using rule-based");
        return optimizeWithRules(prompt);
      }
      
      if (optimizedSentences < originalSentences * 0.8) {
        console.log("⚠️ Gemini removed too many sentences, using rule-based");
        return optimizeWithRules(prompt);
      }
      
      console.log(`✅ Safe optimization complete`);
      console.log(`   Original: ${prompt.length} chars, ${originalWordCount} words`);
      console.log(`   Optimized: ${optimized.length} chars, ${optimizedWordCount} words`);
      
      return optimized;
    }
    
    return optimizeWithRules(prompt);
    
  } catch (error) {
    console.log("⚠️ Gemini API failed:", error.message);
    return optimizeWithRules(prompt);
  }
}

// Route 1: Analyze (with rule-based optimization)
app.post("/api/analyze", (req, res) => {
  console.log("📥 Analyze request:", req.body);
  
  try {
    const { prompt, model = 'gpt4', useRuleBased = false } = req.body;
    
    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const optimizedPrompt = useRuleBased ? optimizeWithRules(prompt) : prompt;
    const tokens = estimateTokens(optimizedPrompt);
    const modelData = MODELS[model] || MODELS['gpt4'];
    
    const result = {
      original: {
        prompt,
        tokens: estimateTokens(prompt),
        co2: (estimateTokens(prompt) * modelData.co2PerToken).toFixed(6),
        energy: (estimateTokens(prompt) * modelData.energyPerToken).toFixed(6)
      },
      optimized: useRuleBased ? {
        prompt: optimizedPrompt,
        tokens: tokens,
        co2: (tokens * modelData.co2PerToken).toFixed(6),
        energy: (tokens * modelData.energyPerToken).toFixed(6)
      } : null,
      green_score: Math.max(20, 100 - Math.floor(tokens * 0.5)),
      optimization_method: useRuleBased ? "rule-based" : "none"
    };

    console.log("📤 Analyze response sent");
    res.json(result);
  } catch (error) {
    console.error("Analyze error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// Route 2: Optimize (WITH GEMINI AI or rule-based)
app.post("/api/optimize", async (req, res) => {
  console.log("📥 Optimize request:", req.body);
  
  try {
    const { prompt, model = 'gpt4', optimizationMethod = 'gemini' } = req.body;
    
    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("🔄 Starting optimization process...");
    console.log(`   Method: ${optimizationMethod}`);
    console.log(`   Model: ${model}`);

    // Choose optimization method
    let optimizedPrompt;
    let optimizationUsed = optimizationMethod;
    
    if (optimizationMethod === 'gemini') {
      optimizedPrompt = await optimizeWithGemini(prompt, model);
      // If Gemini failed and fell back to rule-based, update the method
      if (optimizationMethod === 'gemini') {
        // Check if the prompt was actually optimized by Gemini or rule-based
        // Simple check: if prompt is same as rule-based optimized version
        const ruleBasedVersion = optimizeWithRules(prompt);
        if (optimizedPrompt === ruleBasedVersion) {
          optimizationUsed = 'rule-based';
        }
      }
    } else {
      optimizedPrompt = optimizeWithRules(prompt);
    }

    const originalTokens = estimateTokens(prompt);
    const optimizedTokens = estimateTokens(optimizedPrompt);
    const modelData = MODELS[model] || MODELS['gpt4'];

    const savings = {
      tokens: originalTokens - optimizedTokens,
      co2: ((originalTokens - optimizedTokens) * modelData.co2PerToken).toFixed(6),
      energy: ((originalTokens - optimizedTokens) * modelData.energyPerToken).toFixed(6),
      reductionPercent: Math.round((1 - optimizedTokens / originalTokens) * 100)
    };

    const result = {
      original: {
        prompt,
        tokens: originalTokens,
        co2: (originalTokens * modelData.co2PerToken).toFixed(6),
        energy: (originalTokens * modelData.energyPerToken).toFixed(6)
      },
      optimized: {
        prompt: optimizedPrompt,
        tokens: optimizedTokens,
        co2: (optimizedTokens * modelData.co2PerToken).toFixed(6),
        energy: (optimizedTokens * modelData.energyPerToken).toFixed(6),
        reduction: savings.reductionPercent
      },
      savings,
      green_score: Math.max(20, 100 - Math.floor(optimizedTokens * 0.5)),
      optimization_method: optimizationUsed,
      model_used: model
    };

    console.log("✅ Optimization successful!");
    console.log(`   Method used: ${optimizationUsed}`);
    console.log(`   Original: ${originalTokens} tokens`);
    console.log(`   Optimized: ${optimizedTokens} tokens`);
    console.log(`   Reduction: ${savings.reductionPercent}%`);

    // Save to database
    const insertQuery = `
      INSERT INTO user_prompts (prompt, tokens, co2, green_score, optimization_method, model_used)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [
      prompt, 
      originalTokens, 
      result.original.co2, 
      result.green_score,
      optimizationUsed,
      model
    ], (err) => {
      if (err) {
        // If column doesn't exist, use simpler query
        if (err.code === 'ER_BAD_FIELD_ERROR') {
          console.log("⚠️ Using fallback database query (old schema)");
          const fallbackQuery = `
            INSERT INTO user_prompts (prompt, tokens, co2, green_score)
            VALUES (?, ?, ?, ?)
          `;
          db.query(fallbackQuery, [
            prompt, 
            originalTokens, 
            result.original.co2, 
            result.green_score
          ], (fallbackErr) => {
            if (fallbackErr) {
              console.error("Fallback DB Error:", fallbackErr);
            } else {
              console.log("💾 Saved to database (fallback)");
            }
          });
        } else {
          console.error("DB Insert Error:", err);
        }
      } else {
        console.log("💾 Saved to database");
      }
    });

    res.json(result);
  } catch (error) {
    console.error("Optimization error:", error);
    res.status(500).json({ 
      error: "Optimization failed",
      details: error.message 
    });
  }
});

// Route 3: Get prompt history
app.get("/api/history", (req, res) => {
  console.log("📥 Fetching history");
  
  const query = `
    SELECT id, prompt, tokens, co2, green_score, 
           COALESCE(optimization_method, 'none') as optimization_method,
           COALESCE(model_used, 'gpt4') as model_used,
           created_at
    FROM user_prompts
    ORDER BY created_at DESC
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch history" });
    }

    console.log(`📤 Sending ${results.length} history items`);
    res.json(results);
  });
});

// Route 4: Get dashboard stats
app.get("/api/stats", (req, res) => {
  console.log("📥 Fetching stats");
  
  const query = `
    SELECT 
      COUNT(*) as total_prompts,
      SUM(tokens) as total_tokens,
      SUM(co2) as total_co2_saved,
      AVG(green_score) as avg_green_score
    FROM user_prompts
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Stats error:", err);
      return res.status(500).json({ error: "Failed to fetch stats" });
    }

    const stats = results[0] || {
      total_prompts: 0,
      total_tokens: 0,
      total_co2_saved: 0,
      avg_green_score: 0
    };
    
    console.log("📤 Sending stats:", stats);
    res.json(stats);
  });
});

// Test Gemini API with current models
app.get("/api/test-gemini", async (req, res) => {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.json({ 
        status: "No API key ❌", 
        message: "Add GEMINI_API_KEY to .env file",
        help: "Get free key: https://makersuite.google.com/app/apikey"
      });
    }
    
    console.log("🔑 Testing Gemini API...");
    
    // CURRENT working models (as of 2024)
    const modelsToTest = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest",
      "gemini-1.0-pro-latest"
    ];
    
    const results = [];
    const cleanApiKey = GEMINI_API_KEY.trim();
    
    // Try each model
    for (const model of modelsToTest) {
      try {
        console.log(`  Testing model: ${model}`);
        
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanApiKey}`,
          {
            contents: [{
              parts: [{ text: "Say just 'OK' if you are working" }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 5
            }
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
          }
        );
        
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        
        results.push({
          model,
          status: "✅ Working",
          response: text.trim(),
          code: response.status
        });
        
        console.log(`  ✅ ${model} works!`);
        
      } catch (error) {
        results.push({
          model,
          status: "❌ Failed",
          error: error.response?.status || error.code,
          message: error.response?.data?.error?.message || error.message
        });
        console.log(`  ❌ ${model} failed: ${error.response?.status || error.message}`);
      }
    }
    
    const workingModels = results.filter(r => r.status === "✅ Working");
    
    res.json({
      status: workingModels.length > 0 ? "Some models working ✅" : "All models failed ❌",
      api_key_present: true,
      key_preview: cleanApiKey.substring(0, 10) + "...",
      working_models: workingModels.map(m => m.model),
      all_results: results,
      recommended_model: "gemini-1.5-flash (free, fast)",
      help: workingModels.length === 0 ? 
        "Check available models: https://ai.google.dev/gemini-api/docs/models" :
        `Use endpoint: https://generativelanguage.googleapis.com/v1beta/models/${workingModels[0].model}:generateContent`
    });
    
  } catch (error) {
    console.error("Gemini test error:", error.message);
    
    res.json({
      status: "Test failed ❌",
      error: error.message,
      error_code: error.response?.status,
      help: "Make sure your API key is valid and enabled"
    });
  }
});

// Test rule-based optimization endpoint
app.post("/api/test-rules", (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("🧪 Testing rule-based optimization...");
    
    const optimized = optimizeWithRules(prompt);
    const originalTokens = estimateTokens(prompt);
    const optimizedTokens = estimateTokens(optimized);
    
    res.json({
      original: {
        text: prompt,
        tokens: originalTokens,
        length: prompt.length
      },
      optimized: {
        text: optimized,
        tokens: optimizedTokens,
        length: optimized.length
      },
      reduction: {
        tokens: originalTokens - optimizedTokens,
        percent: Math.round((1 - optimizedTokens / originalTokens) * 100),
        chars: prompt.length - optimized.length
      },
      message: "Rule-based optimization complete"
    });
    
  } catch (error) {
    console.error("Rule test error:", error);
    res.status(500).json({ error: "Rule test failed" });
  }
});

// List available models endpoint
app.get("/api/models", (req, res) => {
  res.json({
    ai_models: MODELS,
    optimization_methods: [
      { id: 'gemini', name: 'Gemini AI', description: 'AI-powered optimization' },
      { id: 'rule-based', name: 'Rule-Based', description: 'Local algorithm optimization' }
    ],
    gemini_models_available: [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest', 
      'gemini-1.5-pro-latest',
      'gemini-1.0-pro-latest'
    ]
  });
});

// Health check
app.get("/", (req, res) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  res.json({ 
    status: "GreenPrompt Backend Running 🚀",
    time: new Date().toISOString(),
    gemini_api: GEMINI_API_KEY ? "✅ Configured" : "❌ Not configured",
    endpoints: [
      "POST /api/analyze",
      "POST /api/optimize", 
      "GET /api/history",
      "GET /api/stats",
      "GET /api/test-gemini",
      "POST /api/test-rules",
      "GET /api/models"
    ],
    models: Object.keys(MODELS),
    optimization_methods: ["gemini", "rule-based"],
    note: "Gemini-1.5-flash recommended (free tier)"
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  console.log(`🌿 GreenPrompt Backend running on http://localhost:${PORT}`);
  console.log(`📡 Frontend at: http://localhost:8080`);
  console.log(`🤖 Gemini API: ${GEMINI_API_KEY ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`🔧 Enhanced rule-based optimization: ✅ Available`);
  console.log(`🔍 Test Gemini: http://localhost:${PORT}/api/test-gemini`);
  console.log(`💡 Recommended: Use gemini-1.5-flash (free & fast)`);
});