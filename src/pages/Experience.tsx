import { Container } from "@/components/layout/Container";
import { ExperienceItem } from "@/components/experience/ExperienceItem";
import { PageHeader } from "@/components/ui/PageHeader";
import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { sortExperience, totalExperience } from "@/lib/dates";

export default function Experience() {
  const items = sortExperience(experience);
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
