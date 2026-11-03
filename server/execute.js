import { execute as opencodeExecute } from "@paperclipai/adapter-opencode-local/server";

async function queryBalanceSummary(apiKey) {
  try {
    const res = await fetch("https://api.deepseek.com/user/balance", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const parts = (data.balance_infos || [])
      .map((b) => `${b.total_balance} ${b.currency}`)
      .filter(Boolean);
    return parts.join(" / ") || null;
  } catch {
    return null;
  }
}

export async function execute(ctx) {
  const config = { ...(ctx.config || {}) };

  // If no model or auto/default specified, default to deepseek/deepseek-flash
  const currentModel = typeof config.model === "string" ? config.model.trim() : "";
  if (!currentModel || currentModel === "auto" || currentModel === "default") {
    config.model = "deepseek/deepseek-flash";
  }

  // Ensure DEEPSEEK_API_KEY is available in the execution env (from connection binding or process)
  const env = { ...(config.env || {}) };
  if (!env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY) {
    env.DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  }

  // Also ensure OPENCODE_CONFIG_CONTENT has the deepseek apiKey if present
  if (env.DEEPSEEK_API_KEY) {
    try {
      const opencodeConf = env.OPENCODE_CONFIG_CONTENT ? JSON.parse(env.OPENCODE_CONFIG_CONTENT) : {};
      opencodeConf.provider = opencodeConf.provider || {};
      opencodeConf.provider.deepseek = opencodeConf.provider.deepseek || {};
      opencodeConf.provider.deepseek.options = opencodeConf.provider.deepseek.options || {};
      opencodeConf.provider.deepseek.options.apiKey = env.DEEPSEEK_API_KEY;
      env.OPENCODE_CONFIG_CONTENT = JSON.stringify(opencodeConf);
    } catch {}

    // Log account balance to execution transcript
    if (typeof ctx.onLog === "function") {
      try {
        const balance = await queryBalanceSummary(env.DEEPSEEK_API_KEY);
        if (balance) {
          await ctx.onLog(
            "stdout",
            `[deepseek] Account balance at start of run: ${balance}\n`
          );
        }
      } catch {}
    }
  }

  config.env = env;

  return opencodeExecute({
    ...ctx,
    config,
  });
}
