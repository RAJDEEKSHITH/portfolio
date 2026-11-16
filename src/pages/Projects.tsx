import { Navigate } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { ProjectItem } from "@/components/projects/ProjectItem";
import { PageHeader } from "@/components/ui/PageHeader";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { showProjectsPage } from "@/lib/content";
import type { Project } from "@/types/content";

// Read through the declared type so `projects = []` (typed never[]) still type-checks
const work: readonly Project[] = projects;

export default function Projects() {
  // Hidden only when there are no jobs and no projects (§6.7)
  if (!showProjectsPage) return <Navigate to="/" replace />;

  return (
    <Container>
      <title>{`Projects — ${site.name}`}</title>
      <meta name="description" content={`Projects by ${site.name}.`} />
      <PageHeader title="Projects" subtitle="Things I've built, with links to the live sites and source code." />
      {/* Same list rhythm as the Experience page */}
      <div className="divide-y divide-border">
        {work.map((project) => (
          <div key={project.title} className="py-8 first:pt-0">
            <ProjectItem project={project} headingAs="h2" />
          </div>
        ))}
      </div>
    </Container>
  );
}
