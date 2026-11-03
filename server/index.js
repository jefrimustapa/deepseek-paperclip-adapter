import { execute } from "./execute.js";
import { testEnvironment } from "./test.js";
import {
  sessionCodec as baseSessionCodec,
  listOpenCodeSkills,
  syncOpenCodeSkills,
} from "@paperclipai/adapter-opencode-local/server";

export const type = "deepseek_local";
export const label = "DeepSeek";

export const models = [
  { id: "deepseek/deepseek-flash", label: "DeepSeek Flash" },
  { id: "deepseek/deepseek-v4-pro", label: "DeepSeek V4 Pro" },
  { id: "opencode/deepseek-v4.1-flash-free", label: "DeepSeek V4.1 Flash (Free)" }
];

export const sessionCodec = baseSessionCodec;
export const listSkills = listOpenCodeSkills;
export const syncSkills = syncOpenCodeSkills;

export function createServerAdapter() {
  return {
    type,
    execute,
    testEnvironment,
    sessionCodec,
    listSkills,
    syncSkills,
    models,
    supportsLocalAgentJwt: true,
    supportsInstructionsBundle: true,
    instructionsPathKey: "instructionsFilePath",
    requiresMaterializedRuntimeSkills: true,
  };
}
