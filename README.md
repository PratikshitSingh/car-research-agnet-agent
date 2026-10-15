# car-research-agnet

This is an [eve](https://eve.dev) agent bootstrapped with [`eve init`](https://eve.dev/docs/reference/cli#eve-init).

## Getting started

First, run the development server:

```bash
eve dev
```

The development TUI opens an interactive session where you can send messages to your agent.

Start by editing `agent/instructions.md` to define the agent's identity, purpose, tone, and response guidelines. Configure its model and runtime behavior in `agent/agent.ts`.

Add capabilities under `agent/`, including tools, connections, channels, skills, subagents, and schedules. eve reloads your changes as you work.

## Learn more

To learn more about eve, explore these resources:

- [eve documentation](https://eve.dev/docs) — learn about eve's features and authoring APIs.
- [Build an Agent tutorial](https://eve.dev/docs/tutorial/first-agent) — build and deploy an agent step by step.
- [eve on GitHub](https://github.com/vercel/eve) — view the source and contribute.

## Deploy on Vercel

Deploy your agent to [Vercel](https://vercel.com) from the project root:

```bash
eve deploy
```

`eve deploy` links a Vercel project if needed and deploys the agent to production. See the [eve deployment documentation](https://eve.dev/docs/guides/deployment/vercel) for authentication, environment variables, and deployment options.

## CarScout workspace

The authenticated home and session pages open a responsive car-shopping workspace.
Use the location, USD asking-price budget, radius, body style, and requirements form
for research. Results stream from the existing agent; follow-up requests use the
same durable session. The stop control cancels active research, and **New search**
opens a fresh workspace. Existing session URLs continue to resume research.

**Save report** stores the latest assistant report in this browser's local storage.
Saved reports can be read or removed in **Saved research**. They do not sync across
devices, are not an account-scoped database, and can be visible to other people
using this browser profile. Clearing site storage removes them. Do not save
sensitive information on a shared device. Saved prices/availability are not refreshed.

The UI does not invent vehicle cards or infer structured inventory from model text.
Reports retain the agent's citations, tool details, clarification questions, and
source-access limitations. No new marketplace integration is included.

Validation: `pnpm typecheck`. For preview acceptance, sign in, submit a location and
budget, check that the report streams, send a follow-up, save the completed report,
verify it remains after refresh, remove it, and open an existing session URL.
Check the layout at desktop and mobile widths and use keyboard navigation.
