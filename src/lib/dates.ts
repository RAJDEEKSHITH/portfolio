import type { Experience, YearMonth } from "@/types/content";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

type YM = { y: number; m: number };

export const YEAR_MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

const parse = (ym: YearMonth): YM => {
  const [y = 0, m = 1] = ym.split("-").map(Number);
  return { y, m };
};

const toIndex = ({ y, m }: YM): number => y * 12 + (m - 1);

const now = (): YM => {
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth() + 1 };
};

export const formatMonth = (ym: YearMonth | null): string => {
  if (!ym) return "Present";
  const { y, m } = parse(ym);
  return `${MONTHS[m - 1] ?? ""} ${y}`;
};

export const formatRange = (start: YearMonth, end: YearMonth | null): string =>
  `${formatMonth(start)} – ${formatMonth(end)}`;

/** Inclusive month count: Jan–Mar = "3 mos" */
export const formatDuration = (start: YearMonth, end: YearMonth | null): string => {
  const total = toIndex(end ? parse(end) : now()) - toIndex(parse(start)) + 1;
  if (total <= 0) return "";
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y > 0 && `${y} yr${y > 1 ? "s" : ""}`, m > 0 && `${m} mo${m > 1 ? "s" : ""}`]
    .filter(Boolean)
    .join(" ");
};

export const isCurrent = (item: Pick<Experience, "end">): boolean => item.end === null;

/** Current jobs first, then by start desc. Never mutates input. */
export const sortExperience = <T extends Experience>(list: readonly T[]): T[] =>
  [...list].sort((a, b) => {
    if (isCurrent(a) !== isCurrent(b)) return isCurrent(a) ? -1 : 1;
    return toIndex(parse(b.start)) - toIndex(parse(a.start));
  });
