import { LuArrowUpRight, LuDownload } from "react-icons/lu";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { formatMonth } from "@/lib/dates";
import { getResumeLinks } from "@/lib/resume";

const BUTTON =
  "inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";
const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function Resume() {
  const links = getResumeLinks(site.resume.driveUrl);

  return (
    <Container>
      <title>{`Resume — ${site.name}`}</title>
      <meta name="description" content={`Resume of ${site.name}, ${site.role}.`} />
      <PageHeader title="Resume" subtitle={`Updated ${formatMonth(site.resume.updated)}`} />

      {links ? (
        <>
          <div className="flex flex-wrap gap-3">
            <a href={links.download} {...EXTERNAL} className={cn(BUTTON, "bg-fg text-bg transition-opacity hover:opacity-90")}>
              <LuDownload aria-hidden className="size-4 shrink-0" />
              Download
            </a>
            <a
              href={links.view}
              {...EXTERNAL}
              className={cn(BUTTON, "border border-border transition-colors hover:bg-subtle")}
            >
              Open in Google Drive
              <LuArrowUpRight aria-hidden className="size-4 shrink-0" />
            </a>
          </div>
          <div className="relative mt-8 overflow-hidden rounded-lg border border-border bg-subtle">
            <p aria-hidden className="absolute inset-0 grid place-items-center text-sm text-muted">
              Loading preview…
            </p>
            <iframe
              src={links.preview}
              title="Resume preview"
              loading="lazy"
              allow="autoplay"
              className="relative block aspect-[1/1.414] max-h-[85dvh] w-full"
            />
          </div>
        </>
      ) : (
        <p className="text-[15px] leading-relaxed text-muted">Resume coming soon.</p>
      )}
    </Container>
  );
}
