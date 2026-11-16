import { Navigate } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { ExperienceItem } from "@/components/experience/ExperienceItem";
import { PageHeader } from "@/components/ui/PageHeader";
import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { hasExperience, showProjectsPage } from "@/lib/content";
import { sortExperience, totalExperience } from "@/lib/dates";
import type { Experience as Job } from "@/types/content";

// Read through the declared type so `experience = []` (typed never[]) still type-checks
const allJobs: readonly Job[] = experience;

export default function Experience() {
  // Zero-experience mode (§6.7). Redirect here, not in router.tsx, so the router imports no data
  if (!hasExperience) return <Navigate to={showProjectsPage ? "/projects" : "/"} replace />;

  const items = sortExperience(allJobs);
  const total = totalExperience(items);

  return (
    <Container>
      <title>{`Experience — ${site.name}`}</title>
      <meta name="description" content={`Work experience of ${site.name}, ${site.role}.`} />
      <PageHeader title="Experience" subtitle={total ? `${total} of experience.` : undefined} />
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div key={`${item.company}-${item.start}`} className="py-8 first:pt-0">
            <ExperienceItem item={item} headingAs="h2" />
          </div>
        ))}
      </div>
    </Container>
  );
}
