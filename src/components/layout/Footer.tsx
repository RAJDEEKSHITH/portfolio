import { Container } from "@/components/layout/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer>
      {/* The hairline sits inside the Container so it spans exactly the text width */}
      <Container>
        <div className="flex flex-col-reverse items-center gap-4 border-t border-border py-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
          <SocialLinks size="sm" />
        </div>
      </Container>
    </footer>
  );
}
