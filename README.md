# DeepSeek Adapter for Paperclip

External adapter plugin for [Paperclip](https://github.com/paperclipai/paperclip) adding first-class support for DeepSeek AI models.

## Features

- **Models Supported:**
  - `deepseek/deepseek-flash` (Default, high-speed, cost-efficient)
  - `deepseek/deepseek-v4-pro` (High intelligence, advanced reasoning)
  - `opencode/deepseek-v4.1-flash-free` (Free tier flash model)
- **Seamless Key Management:** Works with `DEEPSEEK_API_KEY` set in the environment or configured manually by the user via Paperclip's **Connectors** menu (`/apps`).
- **Interactive UI Transcript Parser:** Live streaming tool calls, reasoning/thinking traces, and token usage metrics directly in Paperclip's execution view.
- **Full Coding Agent Capabilities:** File operations, bash command execution, skills sync, and session persistence across heartbeat runs.

## Installation in Paperclip

### Option A: From NPM (Recommended)
1. In Paperclip, go to **Settings > Adapters** (`/company/settings/adapters`).
2. Click **+ Install Adapter**.
3. Under the **npm package** tab, enter:
   ```text
   deepseek-paperclip-adapter
   ```
4. Click **Install**.

### Option B: From Local Path
1. Clone this repository locally on your Paperclip server:
   ```bash
   git clone https://github.com/jefrimustapa/deepseek-paperclip-adapter.git /path/to/deepseek-paperclip-adapter
   ```
2. In Paperclip, go to **Settings > Adapters** -> **+ Install Adapter**.
3. Under the **Local path** tab, enter `/path/to/deepseek-paperclip-adapter`.
4. Click **Install**.

## Configuration

Set your DeepSeek API key using either:
1. **Paperclip Connectors Menu:** Navigate to `/apps`, click **DeepSeek**, and enter your API key (`sk-...`).
2. **Environment Variable:** Set `DEEPSEEK_API_KEY=sk-...` in your server environment or agent's adapter environment settings.

## License

Apache-2.0
