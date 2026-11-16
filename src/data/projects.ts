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
// TODO: replace the placeholder links (yourhandle / your-demo-id / example.com) with the real URLs
export const projects = [
  {
    title: "Hookrelay",
    description:
      "Multi-tenant webhook delivery service with at-least-once guarantees, retries and circuit breakers.",
    highlights: [
      "Sustained **250 events/s** at p95 85 ms with 0 errors in a Grafana k6 benchmark.",
      "Lost **0 of 5,000 events** in a chaos test that killed the worker mid-ingest and restarted Redis.",
      "Guarantees at-least-once delivery with deterministic BullMQ job IDs, a sweeper for overdue deliveries, jittered backoff, a per-endpoint circuit breaker and dead-lettering.",
      "Blocks SSRF by validating resolved IPs at connect time, and encrypts endpoint signing secrets with AES-256-GCM.",
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
      github: "https://github.com/yourhandle/hookrelay",
      youtube: "https://www.youtube.com/watch?v=your-demo-id",
    },
    featured: true,
  },
  {
    title: "DeployBench",
    description: "Self-hosted CI/CD platform: GitHub push → YAML pipeline → isolated Docker jobs → deploy to S3 or EC2.",
    highlights: [
      "Uses the transactional outbox pattern with BullMQ so **no webhook is lost** between PostgreSQL and Redis.",
      "Schedules jobs from a validated dependency graph with cycle detection, running independent jobs in parallel.",
      "Runs each job in an isolated Docker container with resource limits, timeouts and retries, streaming live logs via Redis Pub/Sub and SSE.",
      "Verifies GitHub webhooks with HMAC-SHA256 and deploys with a latest-commit gate and health checks.",
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
      github: "https://github.com/yourhandle/deploybench",
      youtube: "https://www.youtube.com/watch?v=your-demo-id",
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
      github: "https://github.com/yourhandle/storiffy",
      live: "https://storiffy.example.com",
    },
    featured: true,
  },
] satisfies Project[];
