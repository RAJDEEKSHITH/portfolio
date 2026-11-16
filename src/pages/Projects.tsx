import { Container } from "@/components/layout/Container";
import { ProjectItem } from "@/components/projects/ProjectItem";
import { PageHeader } from "@/components/ui/PageHeader";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function Projects() {
  return (
    <Container>
      <title>{`Projects — ${site.name}`}</title>
      <meta name="description" content={`Projects by ${site.name}.`} />
      <PageHeader title="Projects" subtitle="Things I've built, with links to the live sites and source code." />
      {/* Same list rhythm as the Experience page */}
      <div className="divide-y divide-border">
        {projects.map((project) => (
          <div key={project.title} className="py-8 first:pt-0">
            <ProjectItem project={project} headingAs="h2" />
          </div>
        ))}
      </div>
    </Container>
  );
}
