import { Container } from "@/components/layout/Container";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechChip } from "@/components/ui/TechChip";
import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { skills } from "@/data/skills";

// Stub — built out in Step 12. The blocks below are a temporary Step 9 preview of the UI primitives (+ RichText).
export default function Home() {
  return (
    <Container>
      <title>{`${site.name} — ${site.role}`}</title>
      <Reveal step={0}>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{site.name}</h1>
      </Reveal>
      <Reveal step={1} className="mt-6 flex flex-wrap items-center gap-3">
        <StatusBadge />
        <ExternalLink href={site.url}>Website</ExternalLink>
      </Reveal>
      <Reveal step={2} className="mt-6">
        <CopyEmail />
      </Reveal>
      <Reveal step={3}>
        <Section title="Rich text">
          <ul className="space-y-2 text-[15px] leading-relaxed text-muted">
            {[...experience[0].highlights, "Internal [link to projects](/projects) and [email](mailto:you@example.com)."].map((h) => (
              <li key={h}>
                <RichText text={h} />
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>
      <Reveal step={4}>
        <Section title="Skills" action={<ExternalLink href="/projects">View all</ExternalLink>}>
          <ul className="flex flex-wrap gap-2">
            {skills.flatMap((g) => g.items).map((name) => (
              <TechChip key={name} name={name} />
            ))}
          </ul>
        </Section>
      </Reveal>
    </Container>
  );
}
