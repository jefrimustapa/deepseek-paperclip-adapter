import { testEnvironment as opencodeTestEnvironment } from "@paperclipai/adapter-opencode-local/server";

export async function testEnvironment(ctx) {
  const result = await opencodeTestEnvironment(ctx);
  const checks = [...(result.checks || [])];

  const apiKey =
    (ctx.config && ctx.config.env && ctx.config.env.DEEPSEEK_API_KEY) ||
    process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    checks.push({
      level: "warn",
      message: "DEEPSEEK_API_KEY is not configured",
      hint: "Add your DeepSeek API key in the Connectors menu (/apps) or set DEEPSEEK_API_KEY in the environment.",
      code: "missing_deepseek_api_key",
    });
  } else {
    try {
      const res = await fetch("https://api.deepseek.com/user/balance", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const data = await res.json();
        const infos = Array.isArray(data.balance_infos) ? data.balance_infos : [];

        // Format balances e.g. "1.47 CNY / 0.00 USD"
        const balanceParts = infos
          .map((b) => `${b.total_balance} ${b.currency}`)
          .filter(Boolean);
        const balanceStr = balanceParts.join(" / ") || "0.00";

        const isAvailable = data.is_available === true;
        const totalAmount = infos.reduce(
          (acc, b) => acc + (parseFloat(b.total_balance) || 0),
          0
        );

        if (!isAvailable || totalAmount <= 0) {
          checks.push({
            level: "warn",
            message: `DeepSeek balance exhausted (${balanceStr})`,
            hint: "Your DeepSeek account has zero remaining balance. Top up at https://platform.deepseek.com/",
            code: "deepseek_balance_exhausted",
          });
        } else {
          const detailParts = infos
            .map(
              (b) =>
                `${b.currency}: ${b.total_balance} (top-up: ${b.topped_up_balance ?? 0}, grant: ${b.granted_balance ?? 0})`
            )
            .join(" | ");

          checks.push({
            level: "info",
            message: `DeepSeek Balance: ${balanceStr}`,
            hint: `${detailParts}. API status: Available`,
            code: "deepseek_account_balance",
          });
        }
      } else if (res.status === 401 || res.status === 403) {
        checks.push({
          level: "error",
          message: `DeepSeek API key rejected (${res.status} Unauthorized)`,
          hint: "Your DEEPSEEK_API_KEY was not accepted by api.deepseek.com. Please check your key.",
          code: "deepseek_auth_error",
        });
      } else {
        checks.push({
          level: "warn",
          message: `DeepSeek balance query returned HTTP ${res.status}`,
          code: "deepseek_balance_http_error",
        });
      }
    } catch (err) {
      checks.push({
        level: "warn",
        message: "Could not query DeepSeek balance API",
        hint: err instanceof Error ? err.message : String(err),
        code: "deepseek_balance_unreachable",
      });
    }
  }

  return {
    adapterType: "deepseek_local",
    status: checks.some((c) => c.level === "error") ? "fail" : "pass",
    checks,
    testedAt: new Date().toISOString(),
  };
}
