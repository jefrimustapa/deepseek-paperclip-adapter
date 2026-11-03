export const type = "deepseek_local";
export const label = "DeepSeek";

export const DEFAULT_DEEPSEEK_LOCAL_MODEL = "deepseek/deepseek-flash";

export const models = [
  { id: "deepseek/deepseek-flash", label: "DeepSeek Flash" },
  { id: "deepseek/deepseek-v4-pro", label: "DeepSeek V4 Pro" },
  { id: "opencode/deepseek-v4.1-flash-free", label: "DeepSeek V4.1 Flash (Free)" }
];

export const agentConfigurationDoc = `# deepseek_local agent configuration

Adapter: deepseek_local

Use when:
- You want Paperclip to run DeepSeek models (deepseek-flash, deepseek-v4-pro)
- You have DEEPSEEK_API_KEY configured in environment or via Paperclip Connectors (/apps)
- You want full AI coding agent capabilities (file read/write, bash execution, tools, sessions)

Models:
- deepseek/deepseek-flash (Default, ultra-fast and cost-effective)
- deepseek/deepseek-v4-pro (High intelligence, advanced reasoning)
- opencode/deepseek-v4.1-flash-free (Free tier flash model)

Core fields:
- cwd (string, optional): working directory fallback for the agent process
- instructionsFilePath (string, optional): path to markdown instructions (AGENTS.md)
- model (string, optional): defaults to "deepseek/deepseek-flash"
- env (object, optional): KEY=VALUE environment variables (e.g. DEEPSEEK_API_KEY)
- timeoutSec (number, optional): run timeout in seconds
- graceSec (number, optional): SIGTERM grace period in seconds
`;

export { createServerAdapter } from "./server/index.js";
