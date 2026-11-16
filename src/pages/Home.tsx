import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { ExperienceItem } from "@/components/experience/ExperienceItem";
import { ProjectItem } from "@/components/projects/ProjectItem";
import { ProjectRow } from "@/components/projects/ProjectRow";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { TechTag } from "@/components/ui/TechTag";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { skills } from "@/data/skills";
import { getHomeProjects, hasExperience } from "@/lib/content";
import { sortExperience } from "@/lib/dates";
import type { Experience, Project, Site } from "@/types/content";

// Read through the declared types so optional/nullable fields keep their full type whatever the data holds
const info: Site = site;
const work: readonly Project[] = projects;
const allJobs: readonly Experience[] = experience;

// "View all …" links below a list
const ACTION =
  "mt-5 inline-block text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg focus-visible:transition-none";
// Same divider rhythm as the Experience page; last:pb-0 so the gap below a list is set by what follows it
const ROW = "py-6 first:pt-0 last:pb-0";
// Hero meta line (role · location · email). Every item leads with a 16px "·" box; the line is pulled 16px left and
// clipped 4px outside the content edge, so the separator of whichever item starts a line is hidden (no dangling
// dots when it wraps) while the email's 4px focus ring stays visible
const META_LINE =
  "-ml-4 mt-3 flex flex-wrap gap-y-1 text-sm text-muted tabular-nums [clip-path:inset(-0.5rem_-0.5rem_-0.5rem_0.75rem)]";
const META_ITEM = "flex min-w-0";
const SEP = "w-4 shrink-0 text-center";

export default function Home() {
  const jobs = sortExperience(allJobs).slice(0, info.home.experienceLimit);
  const featured = work.filter((p) => p.featured);
  const shownProjects = featured.slice(0, info.home.projectLimit);
  // Zero-experience mode (§6.7): a projects-first list replaces both the Experience and Featured projects sections
  const firstProjects = hasExperience ? [] : getHomeProjects();
  const meta = [info.role, info.location].filter((text): text is string => Boolean(text));

  return (
    <Container>
      <title>{`${info.name} — ${info.role}`}</title>
      <meta name="description" content={info.tagline ?? `${info.name}, ${info.role}.`} />

      <Reveal step={0} className="flex items-center gap-4 sm:gap-5">
        {info.avatar && (
          <img
            src={info.avatar}
            alt=""
            width={80}
            height={80}
            fetchPriority="high"
            className="size-16 shrink-0 rounded-full bg-subtle object-cover sm:size-20"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-semibold tracking-tight break-words sm:text-4xl">{info.name}</h1>
          <div className={META_LINE}>
            {meta.map((text) => (
              <p key={text} className={META_ITEM}>
                <span aria-hidden className={SEP}>
                  ·
                </span>
                <span className="min-w-0 break-words">{text}</span>
              </p>
            ))}
            <div className={META_ITEM}>
              <span aria-hidden className={SEP}>
                ·
              </span>
              <CopyEmail />
            </div>
          </div>
        </div>
      </Reveal>

      {info.bio.length > 0 && (
        <Reveal step={1} className="mt-6 max-w-prose space-y-3 text-[15px] leading-relaxed text-muted">
          {info.bio.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </Reveal>
      )}

      <Reveal step={2} className="mt-5">
        <SocialLinks className="-ml-2" />
      </Reveal>

      {jobs.length > 0 && (
        <Reveal step={3}>
          <Section title="Experience">
            {/* Same list layout as the Experience page */}
            <div className="divide-y divide-border">
              {jobs.map((item) => (
                <div key={`${item.company}-${item.start}`} className={ROW}>
                  <ExperienceItem item={item} preview />
                </div>
              ))}
            </div>
            {/* Always shown: tech, links and the remaining highlights only live on /experience */}
            <Link to="/experience" className={ACTION}>
              View all experience →
            </Link>
          </Section>
        </Reveal>
      )}

      {firstProjects.length > 0 && (
        <Reveal step={3}>
          <Section title="Projects">
            {/* Mirrors the Experience preview above: same rhythm, first N highlights, no chips */}
            <div className="divide-y divide-border">
              {firstProjects.map((project) => (
                <div key={project.title} className={ROW}>
                  <ProjectItem project={project} preview />
                </div>
              ))}
            </div>
            {work.length > firstProjects.length && (
              <Link to="/projects" className={ACTION}>
                View all projects →
              </Link>
            )}
          </Section>
        </Reveal>
      )}

      {hasExperience && shownProjects.length > 0 && (
        <Reveal step={4}>
          <Section title="Featured projects">
            <div className="divide-y divide-border">
              {shownProjects.map((project) => (
                <div key={project.title} className={ROW}>
                  <ProjectRow project={project} />
                </div>
              ))}
            </div>
            {work.length > shownProjects.length && (
              <Link to="/projects" className={ACTION}>
                View all projects →
              </Link>
            )}
          </Section>
        </Reveal>
      )}

      {skills.length > 0 && (
        <Reveal step={5}>
          <Section title="Skills">
            {/* Below sm: label above its tags (gap-1.5), groups gap-y-5. From sm: sm:contents makes label + tags grid
                items, rows gap-y-3; the label's sm:pt-1 puts its text on the text line of the first tag row
                (tag border + py-0.5 + taller line box) */}
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-[10rem_1fr] sm:gap-y-3">
              {skills.map(({ group, items }) => (
                <div key={group} className="flex flex-col gap-1.5 sm:contents">
                  <p className="text-sm font-semibold text-fg sm:pt-1">{group}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {items.map((name) => (
                      <TechTag key={name} name={name} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        </Reveal>
      )}
    </Container>
  );
}
