import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { ExperienceItem } from "@/components/experience/ExperienceItem";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { TechChip } from "@/components/ui/TechChip";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { skills } from "@/data/skills";
import { sortExperience } from "@/lib/dates";
import type { Project, Site } from "@/types/content";

// Read through the declared types so optional/nullable fields keep their full type whatever the data holds
const info: Site = site;
const work: readonly Project[] = projects;

const ACTION =
  "shrink-0 text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

export default function Home() {
  const jobs = sortExperience(experience).slice(0, info.home.experienceLimit);
  const featured = work.filter((p) => p.featured);
  const shownProjects = featured.slice(0, info.home.projectLimit);
  const meta = [info.role, info.location].filter(Boolean).join(" · ");

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
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted tabular-nums">
            {meta && <p className="mr-2">{meta}</p>}
            <CopyEmail />
          </div>
        </div>
      </Reveal>

      {info.bio.length > 0 && (
        <Reveal step={1} className="mt-8 max-w-prose space-y-3 text-[15px] leading-relaxed text-muted">
          {info.bio.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </Reveal>
      )}

      <Reveal step={2} className="mt-6">
        <SocialLinks className="-ml-2" />
      </Reveal>

      {jobs.length > 0 && (
        <Reveal step={3}>
          <Section
            title="Experience"
            action={
              experience.length > jobs.length && (
                <Link to="/experience" className={ACTION}>
                  View all →
                </Link>
              )
            }
          >
            <div className="space-y-8">
              {jobs.map((item) => (
                <ExperienceItem key={`${item.company}-${item.start}`} item={item} expandable />
              ))}
            </div>
          </Section>
        </Reveal>
      )}

      {shownProjects.length > 0 && (
        <Reveal step={4}>
          <Section
            title="Featured projects"
            action={
              work.length > shownProjects.length && (
                <Link to="/projects" className={ACTION}>
                  All projects →
                </Link>
              )
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {shownProjects.map((project) => (
                <ProjectCard key={project.title} project={project} compact />
              ))}
            </div>
          </Section>
        </Reveal>
      )}

      {skills.length > 0 && (
        <Reveal step={5}>
          <Section title="Skills">
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-[8rem_1fr]">
              {skills.map(({ group, items }) => (
                <Fragment key={group}>
                  <p className="text-sm text-muted sm:pt-1">{group}</p>
                  <ul className="-mt-2 flex flex-wrap gap-2 sm:mt-0">
                    {items.map((name) => (
                      <TechChip key={name} name={name} />
                    ))}
                  </ul>
                </Fragment>
              ))}
            </div>
          </Section>
        </Reveal>
      )}
    </Container>
  );
}
