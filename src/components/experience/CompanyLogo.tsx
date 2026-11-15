import { cn } from "@/lib/cn";

type CompanyLogoProps = { company: string; logo?: string };

const TILE = "grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-border sm:size-12";

// alt="" / aria-hidden: the company name sits right next to the tile
export function CompanyLogo({ company, logo }: CompanyLogoProps) {
  if (logo) {
    return (
      <div className={cn(TILE, "bg-logo")}>
        <img
          src={logo}
          alt=""
          width={48}
          height={48}
          loading="lazy"
          decoding="async"
          className="size-full object-contain p-1.5"
        />
      </div>
    );
  }
  return (
    <div aria-hidden className={cn(TILE, "bg-subtle text-sm font-semibold text-muted")}>
      {company.trim().charAt(0).toUpperCase()}
    </div>
  );
}
