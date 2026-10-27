import { describe, expect, it } from "vitest";
import { parseDemoArgs, truncateBytes } from "./demo";

const bytes = (s: string) => new TextEncoder().encode(s).length;

describe("truncateBytes", () => {
  it("never exceeds the byte limit, even with Cyrillic", () => {
    const out = truncateBytes("Разработка смарт-контракта и аудит безопасности системы", 64);
    expect(bytes(out)).toBeLessThanOrEqual(64);
    expect(out.length).toBeGreaterThan(20);
  });
  it("keeps short ASCII intact", () => {
    expect(truncateBytes("Landing page", 64)).toBe("Landing page");
  });
});

describe("parseDemoArgs", () => {
  it("uses defaults for empty input", () => {
    expect(parseDemoArgs("", "Fallback")).toEqual({ title: "Fallback", amountSol: "0.01" });
  });
  it("splits a trailing amount from the title", () => {
    expect(parseDemoArgs("Logo design 0.05", "x")).toEqual({ title: "Logo design", amountSol: "0.05" });
  });
  it("accepts a comma decimal", () => {
    expect(parseDemoArgs("Logo 0,02", "x").amountSol).toBe("0.02");
  });
  it("caps the amount to protect the shared demo wallets", () => {
    expect(parseDemoArgs("Big job 5", "x").amountSol).toBe("0.01");
  });
});
