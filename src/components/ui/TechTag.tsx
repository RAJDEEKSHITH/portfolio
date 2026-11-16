type TechTagProps = { name: string };

// Static tag (not interactive: no hover). Parent: <ul className="flex flex-wrap gap-1.5">
export function TechTag({ name }: TechTagProps) {
  return (
    <li className="rounded-md border border-border bg-subtle px-2 py-0.5 text-[13px] leading-6 font-medium whitespace-nowrap text-fg/85">
      {name}
    </li>
  );
}
