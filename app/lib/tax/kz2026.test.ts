import { describe, expect, it } from "vitest";
import { deadlines, estimate, KZ } from "./kz2026";

const opts = { bornAfter1975: true, activeMonths: 12 };
const flat = (m: number) => Array(12).fill(0).map((_, i) => (i === 0 ? m : 0));

describe("self-employed", () => {
  it("pays 4% of income, nothing else", () => {
    const e = estimate("self_employed", flat(500_000), opts);
    expect(e.total).toBe(20_000);
  });
  it("warns above 300 MRP in a month", () => {
    const e = estimate("self_employed", flat(KZ.mrp * 300 + 1), opts);
    expect(e.warnings).toContain("se_monthly_limit");
  });
});

describe("ip simplified", () => {
  it("minimum monthly contributions for a 1 MZP base are 21 675", () => {
    const e = estimate("ip_simplified", flat(KZ.mzp), { ...opts, activeMonths: 1 });
    const c = e.contributions;
    expect(c.opv + c.opvr + c.so + c.vosms).toBe(21_675);
  });
  it("adds 4% income tax", () => {
    const e = estimate("ip_simplified", flat(1_000_000), { ...opts, activeMonths: 1 });
    expect(e.tax).toBe(40_000);
  });
  it("skips ОПВР for people born before 1975", () => {
    const e = estimate("ip_simplified", flat(KZ.mzp), { bornAfter1975: false, activeMonths: 1 });
    expect(e.contributions.opvr).toBe(0);
  });
  it("caps СО base at 7 МЗП", () => {
    const e = estimate("ip_simplified", flat(KZ.mzp * 20), { ...opts, activeMonths: 1, declaredBase: KZ.mzp * 20 });
    expect(e.contributions.so).toBe(KZ.mzp * 7 * 0.05);
  });
  it("uses the minimum declared base (1 МЗП) by default, whatever the income", () => {
    const e = estimate("ip_simplified", flat(KZ.mzp * 20), { ...opts, activeMonths: 1 });
    expect(e.contributions.opv).toBe(KZ.mzp * 0.1);
  });
  it("ВОСМС is due for active months even with no income", () => {
    const e = estimate("ip_simplified", Array(12).fill(0), { ...opts, activeMonths: 3 });
    expect(e.contributions.vosms).toBe(5950 * 3);
  });
});

describe("deadlines", () => {
  it("returns only future dates, sorted", () => {
    const d = deadlines("ip_simplified", new Date(2026, 7, 20));
    expect(d[0].date).toBe("2026-08-25");
    expect(d.every((x) => x.date >= "2026-08-20")).toBe(true);
  });
});
