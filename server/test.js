import { testEnvironment as opencodeTestEnvironment } from "@paperclipai/adapter-opencode-local/server";

export async function testEnvironment(ctx) {
  const result = await opencodeTestEnvironment(ctx);
  const checks = [...(result.checks || [])];

  const hasKey = Boolean(
    (ctx.config && ctx.config.env && ctx.config.env.DEEPSEEK_API_KEY) ||
    process.env.DEEPSEEK_API_KEY
  );

  if (!hasKey) {
    checks.push({
      level: "warn",
      message: "DEEPSEEK_API_KEY is not configured",
      hint: "Add your DeepSeek API key in the Connectors menu (/apps) or set DEEPSEEK_API_KEY in the environment.",
      code: "missing_deepseek_api_key",
    });
  } else {
    checks.push({
      level: "info",
      message: "DEEPSEEK_API_KEY is configured",
      code: "deepseek_api_key_configured",
    });
  }

  return {
    adapterType: "deepseek_local",
    status: checks.some((c) => c.level === "error") ? "fail" : "pass",
    checks,
    testedAt: new Date().toISOString(),
  };
}
