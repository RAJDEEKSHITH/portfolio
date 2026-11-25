import type { Project } from "@/types/content";

/**
 * Projects. Array order = display order.
 * Required: title, description. Optional: highlights[], tech[], links{github, youtube, live}, featured.
 * links: every key optional → icon links (GitHub · YouTube · Live, always in that order). Omit a key rather than
 *   leaving it "". The title is plain text; only the icons link.
 * highlights: bullets on the Projects page; with no experience, Home also shows the first site.home.highlightLimit,
 *   so order them by importance. 2–4 recommended. Lead with the result; at most ONE
 *   **bold** metric/outcome per bullet; not every bullet needs one; real numbers only.
 * featured: true → shown on Home (the first site.home.projectLimit). With experience: a compact row (title, link
 *   icons, description clamped to 2 lines). With no experience: a preview row (title, icons, description, first
 *   highlights). If none is featured and there is no experience, Home shows the first projects instead.
 * description and highlights support rich text: **bold** and [label](url).
 */
// TODO: replace the placeholder links (yourhandle / your-demo-id / example.com) with the real URLs
export const projects = [
  {
    title: "Hookrelay",
    description:
      "Multi-tenant webhook delivery service that ingests each event once via an API-key endpoint and fans it out as HMAC-SHA256-signed deliveries to every subscriber in one PostgreSQL transaction, deduplicated by Idempotency-Key.",
    highlights: [
      "Sustained **250 events/s** for 60 s at p95 85 ms with 0 errors in a Grafana k6 benchmark.",
      "Lost **0 of 5,000 events** in a chaos test that force-killed the worker mid-ingest and restarted Redis during delivery.",
      "Guarantees at-least-once delivery (attempts recorded in PostgreSQL, deterministic BullMQ job IDs, a sweeper for overdue jobs) and handles failing endpoints with jittered backoff, Retry-After, a Redis circuit breaker, dead-lettering and replay.",
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
      youtube: "https://www.youtube.com/watch?v=5nefHop_rzM",
    },
    featured: true,
  },
  {
    title: "QueryCraft",
    description:
      "Text-to-SQL agent built with LangGraph.js that answers plain-English questions over a 67-table PostgreSQL database, using pgvector retrieval of schema, verified examples and business definitions, plus pg_trgm fuzzy value matching.",
    highlights: [
      "Reached **88% execution accuracy** (21/24) on a 30-question benchmark; an ablation showed examples, glossary and value lookup lifted accuracy from 54% to 88%, running entirely on free-tier Groq and Gemini APIs.",
      "Rejected **213/213 malicious SQL cases** with 0 unsafe executions on 20 adversarial prompts, through a five-layer safety pipeline: Postgres parser allowlists, EXPLAIN cost limits, read-only transactions, a column-restricted read-only role and PII masking.",
      "Pauses for human-in-the-loop clarification and expensive-query approval via LangGraph interrupts persisted in Postgres, so paused runs survive restarts.",
      "Exposes the same audited pipeline to AI assistants through an MCP server, backed by 1,020 automated tests.",
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
      live: "https://querycraft-one.vercel.app/",
    },
    featured: true,
  },
  {
    title: "DeployBench",
    description:
      "Self-hosted CI/CD platform that verifies GitHub webhooks (HMAC-SHA256), reads the YAML pipeline from the pushed commit and runs jobs in dependency order from a cycle-checked graph, in parallel where possible.",
    highlights: [
      "Processes webhooks asynchronously with the transactional outbox pattern and three BullMQ queues, so **no webhook is lost** between PostgreSQL and Redis.",
      "Runs each job in an isolated Docker container with resource limits, timeouts and retries, storing logs and artifacts in S3 and images in ECR, and streams live logs via Redis Pub/Sub and SSE.",
      "Deploys builds to S3 static hosting or to EC2 over SSH (images pulled from ECR), with a latest-commit gate and health checks to verify each deployment.",
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
  {
    title: "Storiffy",
    description: "Cloud file storage platform with direct-to-S3 uploads, CloudFront delivery and role-based sharing.",
    highlights: [
      "Uploads straight to S3 with presigned URLs: single-part up to **100 MB**, multipart for larger files.",
      "Serves files through CloudFront edge caching, with time-limited signed URLs for private assets.",
      "Shares files with viewer/editor roles, custom expiry and public or restricted modes, with inputs validated by Zod.",
      "Handles authentication with Redis-backed sessions.",
    ],
    tech: ["TypeScript", "Node.js", "Express.js", "MongoDB", "Redis", "AWS", "React", "Redux Toolkit", "Zod"],
    links: {
      github: "https://github.com/RAJDEEKSHITH/storiffy",
      live: "https://d2leaxmoy978mi.cloudfront.net/login",
    },
    featured: true,
  },
] satisfies Project[];
