import { logger } from "../lib/logger";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(messages: ChatMessage[], dbContext: any): Promise<string> {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  
  // Find the last user query
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || "";

  try {
    if (provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OPENAI_API_KEY is not defined");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API failed with status ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as any;
      return data.choices[0].message.content || "";
    }

    if (provider === "ollama") {
      const host = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
      const model = process.env.OLLAMA_MODEL || "llama3";

      const response = await fetch(`${host}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API failed with status ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as any;
      return data.message.content || "";
    }

    // Default: Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback: If no API key is present in environment, return a smart DB-context-driven rule-based response
      return generateSimulationResponse(lastUserMsg, dbContext);
    }

    // Convert messages to Gemini format
    const geminiContents = messages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Prefix system prompt to the first user message if system prompt exists
    const systemPrompt = messages.find(m => m.role === "system")?.content;
    if (systemPrompt && geminiContents.length > 0) {
      geminiContents[0].parts[0].text = `[SYSTEM INSTRUCTIONS]\n${systemPrompt}\n\n[USER INPUT]\n${geminiContents[0].parts[0].text}`;
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: geminiContents,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API failed with status ${response.status}: ${await response.text()}`);
    }

    const data = (await response.json()) as any;
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err) {
    logger.error({ err, provider }, "Error in AI chat provider; falling back to offline simulation response");
    // Return graceful DB-context-driven simulation fallback
    return generateSimulationResponse(lastUserMsg, dbContext);
  }
}

function getCountryFullName(code: string): string {
  const map: Record<string, string> = {
    US: "United States",
    KE: "Kenya",
    GB: "United Kingdom",
    DE: "Germany",
    IN: "India",
    JP: "Japan",
    FR: "France",
    CA: "Canada",
    AU: "Australia",
    KP: "North Korea",
    IR: "Iran",
    SY: "Syria",
    RU: "Russia",
  };
  return map[code.toUpperCase()] || code;
}

function generateSimulationResponse(query: string, context: any): string {
  const q = query.toLowerCase();

  if (q.includes("balance")) {
    return `Your current wallet balance is **$${parseFloat(context.balance || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${context.currency || "USD"}**. All funds are fully active.`;
  }

  if (q.includes("recipient") || q.includes("top")) {
    if (context.topRecipient) {
      return `Based on your records, your top recipient is **${context.topRecipient.name}** (${context.topRecipient.email}). You sent them **$${context.topRecipient.volume.toLocaleString(undefined, { minimumFractionDigits: 2 })}** across **${context.topRecipient.count} transfers**.`;
    }
    return "You have not made any recipient transfers yet.";
  }

  if (q.includes("kenya") || q.includes("country") || q.includes("destination")) {
    const target = context.countryDistribution?.find(
      (c: any) => c.country.toUpperCase() === "KE" || c.country.toLowerCase() === "kenya"
    );
    if (target) {
      const pct = Math.round((target.volume / (context.totalVolume || 1)) * 100);
      return `You transacted **$${target.volume.toLocaleString(undefined, { minimumFractionDigits: 2 })}** to **Kenya** this month, representing **${pct}%** of your total outward transfer volume.`;
    }
    const highest = context.countryDistribution?.[0];
    if (highest) {
      const pct = Math.round((highest.volume / (context.totalVolume || 1)) * 100);
      return `You haven't sent transfers to Kenya. However, your top transacted country is **${getCountryFullName(highest.country)}** receiving **$${highest.volume.toLocaleString(undefined, { minimumFractionDigits: 2 })}** (**${pct}%** of total).`;
    }
    return "No international transfers have been logged in your account.";
  }

  if (q.includes("flagged") || q.includes("risk") || q.includes("tx")) {
    const txIdMatch = q.match(/tx\s*(\d+)/);
    if (txIdMatch) {
      const id = parseInt(txIdMatch[1]);
      const tx = context.transactions?.find((t: any) => t.id === id);
      if (tx) {
        return `Transaction **TX${tx.id}** of **$${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}** to recipient ID ${tx.recipientId || "N/A"} had an AI risk score of **${tx.riskScore}/100** and status is **${tx.status}**.`;
      }
    }
    const flagged = context.transactions?.filter((t: any) => t.riskScore >= 70) || [];
    if (flagged.length > 0) {
      return `You have **${flagged.length} flagged transaction(s)**. For example, Transaction **TX${flagged[0].id}** of **$${parseFloat(flagged[0].amount).toLocaleString()}** has an AI compliance risk score of **${flagged[0].riskScore}/100** (status: **${flagged[0].status}**).`;
    }
    return `Your transactions are within standard compliance safety levels. Average wallet risk score is **${context.healthScore}/100** (where 100 is fully secure).`;
  }

  if (q.includes("summarize") || q.includes("activity") || q.includes("overview")) {
    return `Here is a complete summary of your EyePay activity:
- **Wallet Balance**: $${parseFloat(context.balance || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })} ${context.currency || "USD"}
- **Activity Volume**: $${context.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })} across ${context.transactions?.length || 0} transactions
- **AI Health Score**: **${context.healthScore}/100** with ${context.pendingAlertsCount || 0} pending fraud alerts
- **Top Recipient**: ${context.topRecipient ? `**${context.topRecipient.name}** ($${context.topRecipient.volume.toLocaleString(undefined, { minimumFractionDigits: 2 })})` : "None"}`;
  }

  return `Hello ${context.userName}! I am the EyePay AI Copilot. I've analyzed your financial ledger. You asked: "${query}".

I can answer questions like:
- *"What's my current balance?"*
- *"Who is my top recipient?"*
- *"How much did I send to Kenya this month?"*
- *"Why was my last transaction flagged?"*
- *"Summarize my activity."*`;
}
