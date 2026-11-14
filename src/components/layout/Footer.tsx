import { Container } from "@/components/layout/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col-reverse items-center gap-4 py-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
        <SocialLinks size="sm" />
      </Container>
    </footer>
  );
}
