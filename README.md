# Adspirer for Cline

AI advertising agent for growing your business. Create, analyze, and optimize ad campaigns across Google, Meta, TikTok, LinkedIn, Amazon, and ChatGPT Ads—with your approval.

This package connects [Cline](https://cline.bot) to the hosted Adspirer MCP server and gives it
the skills to use it well. It can change ad accounts, and only with your approval: campaigns are
built paused, every change is shown first and read back afterwards.

## Install

**1. Add the MCP server.** Nothing runs locally and there is no API key.

```bash
cline mcp install adspirer --transport http https://mcp.adspirer.com/mcp
```

In VS Code or JetBrains: open the **MCP Servers** panel → **Remote Servers**, then add the name
`adspirer`, the URL `https://mcp.adspirer.com/mcp` and the transport **Streamable HTTP**.

**2. Sign in.** Cline opens Adspirer's sign-in page in your browser. Sign in or create an
account, approve access, then connect your ad accounts at https://adspirer.ai/connections.

**3. Add the skills** (recommended).

```bash
cline skill install Adspirer/adspirer-cline
```

**4. Add the rules** (optional). Copy [rules/adspirer.md](rules/adspirer.md) into your project's
`.clinerules/` folder so Cline always applies the approval rules for advertising work.

An AI agent installing this for you should read [llms-install.md](llms-install.md).

## Try it

- "How did my ad campaigns perform across all platforms over the last 30 days?"
- "Find wasted spend in my Google Ads account and propose fixes for my approval."
- "Plan a Meta campaign for our spring launch with a $50/day budget, and build it paused."
- "Audit my conversion tracking before I launch anything."

## What Cline can do with it

| Area | Capabilities |
| --- | --- |
| Cross-platform reporting | Compare spend, conversions, CPA, ROAS, CTR and pacing across connected platforms |
| Google Ads | Search, Performance Max, Demand Gen, YouTube, Display, keywords, assets and extensions |
| Meta Ads | Facebook and Instagram campaigns, audiences, creatives, lead generation and performance |
| TikTok Ads | In-feed video, Spark Ads, carousel, app promotion, targeting and analytics |
| LinkedIn Ads | Sponsored content, lead-gen forms, campaign groups, B2B targeting and reporting |
| Amazon Ads | Sponsored Products, Sponsored Brands, Sponsored Display, search terms, bids and ACoS |
| ChatGPT Ads | Campaigns, ad groups, creative assets, chat-card ads and reporting |
| Optimization | Wasted-spend analysis, budget pacing, creative fatigue and recommendations |

The hosted server is the source of truth for tool names and schemas; the skills teach Cline to
discover them at run time, not to guess.

## What's included

| File | Purpose |
| --- | --- |
| [connector.json](connector.json) | Connector details: name, URL, sign-in, install commands, links |
| [llms-install.md](llms-install.md) | Install and verify steps written for AI agents |
| [rules/adspirer.md](rules/adspirer.md) | Always-on rules to copy into `.clinerules/` |
| `skills/` | 14 Agent Skills (`SKILL.md` folders), installable with `cline skill install` |
| [marketplace/](marketplace) | The Cline Marketplace entries for the MCP server and the skills |
| [LISTING.md](LISTING.md) | Listing details and submission status |

## Skills

| Skill | Use it for |
| --- | --- |
| `adspirer-agent` | Paid-media advertising agent behavior for Adspirer — create, analyze, and optimize ad campaigns across Google Ads, Meta, TikTok, LinkedIn, Amazon, and ChatGPT Ads. Use for any request about ads, campaigns, budgets, keywords, creative, spend, ROAS, CPA, or ad performance. Sets the safety rules (campaigns are created paused, confirm before spending) and routes to the right Adspirer skill. |
| `adspirer-amazon-ads` | Create and manage Amazon Ads through Adspirer — Sponsored Products, Sponsored Brands, and Sponsored Display, with ASIN targeting, search-term reports, ACoS, and bid optimization. Use for anything on Amazon Advertising or Seller/Vendor Central ads. |
| `adspirer-chatgpt-ads` | Create and manage ChatGPT Ads (OpenAI Ads) through Adspirer — ads that appear inside ChatGPT responses. Use for OpenAI Ads, ChatGPT advertising, chat card ads, or placing ads in ChatGPT. Covers the one-shot launch tool and irreversible archiving. |
| `adspirer-creative` | Write and refresh ad creative with Adspirer — headlines, descriptions, primary text, and ad copy for Google, Meta, TikTok, LinkedIn, and Amazon, plus diagnosing and fixing creative fatigue when CTR falls and frequency rises. Respects each platform's character limits. |
| `adspirer-docs` | Answer questions about Adspirer itself — pricing, plans, quota and tool-call limits, what Adspirer can do, connecting an ad account, supported platforms and AI clients, security, and troubleshooting. Uses the official documentation at adspirer.com/docs rather than guessing. |
| `adspirer-google-ads` | Create and manage Google Ads campaigns through Adspirer — Search, Performance Max, Demand Gen, YouTube, and Display. Use for Google Ads keywords, search terms, quality score, bid strategies, sitelinks and extensions, PMax asset groups, or anything on Google/AdWords. Covers the asset-bundle expiry and ad-group-id traps. |
| `adspirer-launch` | Plan and launch a new ad campaign with Adspirer — start, create, set up, or launch campaigns on one or several platforms, choose which channel fits the goal, and split a budget across channels. Campaigns are created paused and never spend without explicit approval. |
| `adspirer-linkedin-ads` | Create and manage LinkedIn Ads through Adspirer — sponsored content, single image, video, carousel, text ads, and lead-gen forms with B2B job-title, company, and industry targeting. Use for anything on LinkedIn. Every LinkedIn campaign requires a campaign group. |
| `adspirer-mcp` | How to call the Adspirer MCP hub correctly — the router two-step (action "list_tools" then action "execute" with tool_name), the direct tools search_tools and get_tool_schema, per-platform account IDs, quota rules, and the budget unit (every platform takes the account's own currency as a decimal — never cents). Load this before making any Adspirer tool call. |
| `adspirer-meta-ads` | Create and manage Meta Ads (Facebook and Instagram) through Adspirer — image, video, carousel, and lead-gen campaigns, ad sets, audiences, pixels, and creative fatigue. Use for anything on Facebook, Instagram, Meta, or FB ads. Covers the account-currency budget unit (never cents) and the required Facebook page id. |
| `adspirer-optimize` | Find and fix wasted ad spend with Adspirer — cut spend that isn't converting, add negative keywords, exclude audiences and placements, reallocate budget to what works, and check whether campaigns are pacing over or under budget. Proposes changes and asks before spending or moving money. |
| `adspirer-performance-review` | Review ad performance across platforms with Adspirer — how are my ads doing, weekly or monthly reports, a cross-channel scorecard, CPA, ROAS, CTR, spend trends, and auditing whether conversion tracking is set up correctly. Read-only; changes nothing. |
| `adspirer-setup` | Set up your brand workspace — connect to Adspirer, scan brand docs, pull campaign data, and create BRAND.md. Use on first time in a new brand folder, or when the user wants to refresh brand context. |
| `adspirer-tiktok-ads` | Create and manage TikTok Ads through Adspirer — in-feed video, Spark Ads, carousel, app promotion, and conversions campaigns. Use for anything on TikTok. Covers the pixel-placement rule that causes most TikTok failures, the unsupported single-image ad, and per-currency budget floors. |

## Safety

- It can change ad accounts, and only with your approval: campaigns are built paused, every
  change is shown first and read back afterwards.
- **Auto-approve and YOLO mode.** We recommend leaving auto-approve off for the Adspirer tools.
  The skills tell Cline to ask before every change even when auto-approve would allow it.
- **No purchases.** The agent never buys, upgrades, renews or starts a trial of a subscription or
  paid feature for you. At a quota or plan limit it stops, explains and waits.
- **No unattended changes.** Headless and scheduled runs are read-only.
- Sign-in is browser OAuth. Never paste tokens into chat.

An Adspirer account and an applicable plan are required; ad-platform permissions and usage limits
apply.

## Status

Built from https://github.com/Adspirer/adspirer-cursor-plugin v1.0.3 on 2026-11-16. Client
registration with Cline's sign-in redirect was checked against the live server on that date; the
full install has not yet been run in Cline. Not yet listed in the Cline Marketplace. Run
`node scripts/validate.mjs` after editing.

## Support

- Support: support@adspirer.com
- Documentation: https://www.adspirer.com/docs
- Privacy: https://www.adspirer.com/privacy
- Terms: https://www.adspirer.com/terms
- Security: see [SECURITY.md](SECURITY.md)
