# Adspirer MCP server: install guide for AI agents

This file is for AI coding agents (Cline and others) that set up MCP servers on a user's behalf.
It contains only what is needed to install and verify the server. Human-facing docs are in
[README.md](README.md).

## What this server does

Adspirer is a hosted MCP server for advertising. It reads and, with the user's approval, changes
campaigns on Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads, Amazon Ads and ChatGPT Ads.

## Prerequisites

- An Adspirer account. The user creates one during sign-in or at https://www.adspirer.com.
- Nothing to install locally: no package, no Docker image, no API key, no environment variables.

## Install (hosted remote server)

- URL: `https://mcp.adspirer.com/mcp`
- Transport: Streamable HTTP
- Auth: OAuth 2.1 with discovery, dynamic client registration and PKCE. The endpoint returns
  `401` with a `WWW-Authenticate` header until the user signs in.

Cline CLI:

```bash
cline mcp install adspirer --transport http https://mcp.adspirer.com/mcp
```

Cline settings file (`cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "adspirer": {
      "type": "streamableHttp",
      "url": "https://mcp.adspirer.com/mcp"
    }
  }
}
```

Keep `"type": "streamableHttp"`. Without it Cline uses the older SSE transport and the connection
fails. Do not add an `Authorization` header and do not ask the user for a token.

## Sign in

Start the OAuth flow (in the CLI: `cline mcp` → Authorize OAuth; in VS Code: the server's row in
the MCP Servers panel). A browser window opens; the user signs in to Adspirer and approves
access. Wait for them to finish. Then the user connects ad accounts at
https://adspirer.ai/connections.

## Verify

Call the `get_connections_status` tool. Success is a list of connected ad platforms (it may be
empty for a new account). It is read-only and does not use the user's tool-call allowance.

## Optional: skills

```bash
cline skill install Adspirer/adspirer-cline
```

## Do not

- Do not create, change or unpause campaigns as part of installation or verification.
- Do not purchase or upgrade an Adspirer plan for the user.
