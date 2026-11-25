import type { Project } from "@/types/content";

/**
 * Projects. Array order = display order.
 * Required: title, description. Optional: highlights[], tech[], links{github, youtube, live}, featured.
 * links: every key optional → icon links (GitHub · YouTube · Live, always in that order). Omit a key rather than
 *   leaving it "". The title links to live, else github, else youtube.
 * highlights: bullets on the Projects page; with no experience, Home also shows the first site.home.highlightLimit,
 *   so order them by importance. 2–4 recommended. Lead with the result; at most ONE
 *   **bold** metric/outcome per bullet; not every bullet needs one; real numbers only.
 * featured: true → shown on Home (the first site.home.projectLimit). With experience: a compact row (title, link
 *   icons, description clamped to 2 lines). With no experience: a preview row (title, icons, description, first
 *   highlights). If none is featured and there is no experience, Home shows the first projects instead.
 * description and highlights support rich text: **bold** and [label](url).
 */
// TODO: replace the placeholder links (yourhandle / your-demo-id) with the real URLs
export const projects = [
  {
    title: "Hookrelay",
    description:
      "Multi-tenant webhook delivery service that ingests each event once and fans it out as HMAC-SHA256-signed deliveries to every subscriber, with Idempotency-Key deduplication.",
    highlights: [
      "Sustained **250 events/s** for 60 s at p95 85 ms with 0 errors in a Grafana k6 benchmark.",
      "Lost **0 of 5,000 events** in a chaos test that force-killed the worker mid-ingest and restarted Redis during delivery.",
      "Guarantees at-least-once delivery (attempts recorded in PostgreSQL, deterministic BullMQ job IDs, an overdue-job sweeper) and handles failing endpoints with jittered backoff, Retry-After, a Redis circuit breaker, dead-lettering and replay.",
      "Blocks SSRF by validating resolved IPs in a custom DNS lookup at connect time (defeating DNS rebinding), and encrypts endpoint signing secrets at rest with AES-256-GCM.",
    ],
    tech: [
      "TypeScript",
      "Node.js",
      "Express.js",
      "React",
      "Zustand",
      "PostgreSQL",
      "Drizzle ORM",
      "BullMQ",
      "Redis",
      "Docker",
      "Grafana k6",
    ],
    links: {
      github: "https://github.com/RAJDEEKSHITH/hookrelay",
      youtube: "https://www.youtube.com/watch?v=5nefHop_rzM"
    },
    featured: true,
  },
  {
    title: "QueryCraft",
    description:
      "Text-to-SQL agent built with LangGraph.js that safely answers plain-English questions over a 67-table PostgreSQL database.",
    highlights: [
      "Reached **88% execution accuracy** (21/24) on a 30-question benchmark; an ablation study showed examples, a glossary and value lookup lifted accuracy from 54% to 88%.",
      "Five-layer SQL safety pipeline (Postgres parser allowlists, EXPLAIN cost limits, read-only transactions, a column-restricted read-only role, PII masking): **0 unsafe executions** on 20 adversarial prompts and 213/213 malicious SQL cases rejected.",
      "Retrieves schema, verified examples and business definitions with pgvector, plus pg_trgm fuzzy value matching, running entirely on free-tier Groq and Gemini APIs.",
      "Adds human-in-the-loop clarification and expensive-query approval via LangGraph interrupts persisted in Postgres (paused runs survive restarts), an MCP server exposing the same audited pipeline to AI assistants, and **1,020 automated tests**.",
    ],
    tech: [
      "TypeScript",
      "Node.js",
      "Express.js",
      "React",
      "Zustand",
      "LangGraph.js",
      "PostgreSQL",
      "pgvector",
      "Drizzle ORM",
      "MCP",
      "Docker",
    ],
    links: {
      github: "https://github.com/RAJDEEKSHITH/querycraft",
      live: "https://querycraft-one.vercel.app/"
    },
    featured: true,
  },
  {
    title: "DeployBench",
    description: "Self-hosted CI/CD platform: GitHub push → YAML pipeline → isolated Docker jobs → deploy to S3 or EC2.",
    highlights: [
      "Uses the transactional outbox pattern with three BullMQ queues so **no webhook is lost** between PostgreSQL and Redis.",
      "Verifies GitHub webhooks (HMAC-SHA256), reads the YAML pipeline from the pushed commit, and runs jobs in dependency order from a cycle-checked graph, in parallel where possible.",
      "Runs each job in an isolated Docker container with resource limits, timeouts and retries, storing logs and artifacts in S3 and images in ECR, and streaming live logs via Redis Pub/Sub and SSE.",
      "Deploys to S3 static hosting or to EC2 over SSH (images pulled from ECR), with a latest-commit gate and health checks.",
    ],
    tech: [
      "TypeScript",
      "Node.js",
      "Express.js",
      "React",
      "TanStack Query",
      "PostgreSQL",
      "Drizzle ORM",
      "BullMQ",
      "Redis",
      "Docker",
      "AWS",
    ],
    links: {
      github: "https://github.com/RAJDEEKSHITH/deploy-bench",
      youtube: "https://www.youtube.com/watch?v=Ps28MnUJizc",
    },
    featured: true,
  },
] satisfies Project[];