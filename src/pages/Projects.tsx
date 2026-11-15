import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function Projects() {
  return (
    <Container>
      <title>{`Projects — ${site.name}`}</title>
      <meta name="description" content={`Projects by ${site.name}.`} />
      <PageHeader title="Projects" subtitle="Things I've built, with links to the live sites and source code." />
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} headingAs="h2" />
        ))}
      </div>
    </Container>
  );
}
