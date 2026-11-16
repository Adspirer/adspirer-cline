# Adspirer — Cline listing details

| Field | Value |
| --- | --- |
| Name | Adspirer |
| MCP server URL | `https://mcp.adspirer.com/mcp` |
| Transport | Streamable HTTP |
| Sign-in | OAuth 2.1 in the browser (dynamic client registration, PKCE); no API key |
| Install | `cline mcp install adspirer --transport http https://mcp.adspirer.com/mcp` |
| Skills | `cline skill install Adspirer/adspirer-cline` |
| Category tags | `marketing`, `data` (server); `marketing`, `business` (skills) |
| Read-only | No — changes need user approval |
| Icon | [assets/icon.svg](assets/icon.svg) (square SVG), [assets/icon.png](assets/icon.png) |
| Website | https://www.adspirer.com |
| Documentation | https://www.adspirer.com/docs |
| Privacy | https://www.adspirer.com/privacy |
| Terms | https://www.adspirer.com/terms |
| Support | support@adspirer.com |

## Marketplace entries

The Cline Marketplace (https://github.com/cline/marketplace) takes one folder per entry. Ours are
kept here, ready to copy:

| Entry | Copy to |
| --- | --- |
| [marketplace/mcps/adspirer/](marketplace/mcps/adspirer) | `registry/mcps/adspirer/` |
| [marketplace/skills/adspirer-ads-skills/](marketplace/skills/adspirer-ads-skills) | `registry/skills/adspirer-ads-skills/` |

`node scripts/validate.mjs` applies the same checks as the marketplace's own
`npm run validate`, plus the schema limits its script does not enforce.

## Example prompts

- "How did my ad campaigns perform across all platforms over the last 30 days?"
- "Find wasted spend in my Google Ads account and propose fixes for my approval."
- "Plan a Meta campaign for our spring launch with a $50/day budget, and build it paused."

## Status

Not yet submitted.
