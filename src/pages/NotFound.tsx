import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/data/site";

export default function NotFound() {
  return (
    <Container>
      <title>{`Page not found — ${site.name}`}</title>
      <meta name="description" content="This page doesn't exist." />
      <PageHeader title="404" subtitle="This page doesn't exist." />
      <Link
        to="/"
        className="text-sm font-medium text-fg underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
      >
        Go home →
      </Link>
    </Container>
  );
}
