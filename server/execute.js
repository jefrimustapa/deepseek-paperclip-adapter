import { execute as opencodeExecute } from "@paperclipai/adapter-opencode-local/server";

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
  }

  config.env = env;

  return opencodeExecute({
    ...ctx,
    config,
  });
}
