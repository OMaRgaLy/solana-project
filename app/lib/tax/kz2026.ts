// Kazakhstan 2026 tax estimates for freelancers. Figures collected from public sources (uchet.kz,
// mybuh.kz, finance.kz, itsheff.kz) in Oct 2026. This is an ESTIMATE, not tax advice: the Tax Code,
// maslikhat rates and the list of eligible activities change — verify at kgd.gov.kz / egov.kz.

export const KZ = {
  year: 2026,
  mrp: 4325,
  mzp: 85000,
  // Self-employed special regime
  seRate: 0.04, // 4% = ОПВ 1% + ОПВР 1% + СО 1% + ОСМС 1%, ИПН 0%
  seMonthlyLimitMrp: 300,
  // IP on simplified declaration
  ipnRate: 0.04, // may be set by maslikhat within 2–6%
  ipAnnualLimitMrp: 600_000,
  opvRate: 0.1, // base 1..50 МЗП
  opvrRate: 0.035, // base 1..50 МЗП, for people born after 01.01.1975
  soRate: 0.05, // base 1..7 МЗП
  vosmsRate: 0.05, // fixed base 1.4 МЗП
  vosmsBaseMzp: 1.4,
} as const;

export type Regime = "self_employed" | "ip_simplified";

export type Options = {
  /** Born after 01.01.1975 → ОПВР is due. */
  bornAfter1975: boolean;
  /** Months of the year the IP is active (ВОСМС is due even without income). */
  activeMonths: number;
  /**
   * Monthly income the IP declares as the base for ОПВ / ОПВР / СО (KZT). It is the IP's own choice,
   * not tied to actual income; the legal minimum is 1 МЗП, which is also the default.
   */
  declaredBase?: number;
};

export type Estimate = {
  regime: Regime;
  income: number;
  tax: number; // 4% income tax (IP) or the whole 4% bundle (self-employed)
  contributions: { opv: number; opvr: number; so: number; vosms: number };
  total: number;
  effectiveRate: number;
  warnings: ("se_monthly_limit" | "ip_annual_limit")[];
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const round = (n: number) => Math.round(n);

/** `monthly` holds 12 numbers: gross income in KZT per calendar month. */
export function estimate(regime: Regime, monthly: number[], o: Options): Estimate {
  const income = monthly.reduce((a, b) => a + b, 0);
  const warnings: Estimate["warnings"] = [];
  const zero = { opv: 0, opvr: 0, so: 0, vosms: 0 };

  if (regime === "self_employed") {
    if (monthly.some((m) => m > KZ.seMonthlyLimitMrp * KZ.mrp)) warnings.push("se_monthly_limit");
    const tax = round(income * KZ.seRate);
    return { regime, income, tax, contributions: zero, total: tax, effectiveRate: income ? tax / income : 0, warnings };
  }

  if (income > KZ.ipAnnualLimitMrp * KZ.mrp) warnings.push("ip_annual_limit");
  const tax = round(income * KZ.ipnRate);
  const c = { opv: 0, opvr: 0, so: 0, vosms: 0 };
  for (const m of monthly) {
    if (m <= 0) continue;
    // Due only for months that have income, on the declared base within the legal bounds.
    const declared = o.declaredBase ?? KZ.mzp;
    const baseOpv = clamp(declared, KZ.mzp, 50 * KZ.mzp);
    const baseSo = clamp(declared, KZ.mzp, 7 * KZ.mzp);
    c.opv += baseOpv * KZ.opvRate;
    if (o.bornAfter1975) c.opvr += baseOpv * KZ.opvrRate;
    c.so += baseSo * KZ.soRate;
  }
  c.vosms = KZ.mzp * KZ.vosmsBaseMzp * KZ.vosmsRate * clamp(o.activeMonths, 0, 12);
  const contributions = { opv: round(c.opv), opvr: round(c.opvr), so: round(c.so), vosms: round(c.vosms) };
  const total = tax + contributions.opv + contributions.opvr + contributions.so + contributions.vosms;
  return { regime, income, tax, contributions, total, effectiveRate: income ? total / income : 0, warnings };
}

export type Deadline = { date: string; kind: "contrib" | "form910" | "pay910" | "se_pay"; regime: Regime };

/** Upcoming deadlines from `from`, within the current calendar year (ISO dates). */
export function deadlines(regime: Regime, from: Date): Deadline[] {
  const y = from.getFullYear();
  const iso = (m: number, d: number) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const list: Deadline[] = [];
  if (regime === "self_employed") {
    for (let m = 1; m <= 12; m++) list.push({ date: iso(m, 25), kind: "se_pay", regime });
  } else {
    for (let m = 1; m <= 12; m++) list.push({ date: iso(m, 25), kind: "contrib", regime });
    list.push({ date: iso(2, 15), kind: "form910", regime }, { date: iso(2, 25), kind: "pay910", regime });
    list.push({ date: iso(8, 15), kind: "form910", regime }, { date: iso(8, 25), kind: "pay910", regime });
  }
  const today = iso(from.getMonth() + 1, from.getDate());
  return list.filter((d) => d.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}
