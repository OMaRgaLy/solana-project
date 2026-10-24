import { describe, expect, it } from "vitest";
import { computeSplit, validateSplit } from "./split";

describe("computeSplit", () => {
  it("splits 85/10/5", () => {
    const s = computeSplit(1_000_000_000n, 1000, 500);
    expect(s.vault).toBe(100_000_000n);
    expect(s.collaborator).toBe(50_000_000n);
    expect(s.creator).toBe(850_000_000n);
  });
  it("conserves total when shares round down", () => {
    const s = computeSplit(1n, 1000, 500);
    expect(s.vault + s.collaborator + s.creator).toBe(1n);
    expect(s.creator).toBe(1n);
  });
  it("conserves total for odd amounts", () => {
    const s = computeSplit(999_999_999n, 3333, 3333);
    expect(s.vault + s.collaborator + s.creator).toBe(999_999_999n);
  });
});

describe("validateSplit", () => {
  it("rejects total over 100%", () => {
    expect(validateSplit(6000, 5000, true)).toMatch(/100%/);
  });
  it("rejects collaborator share without collaborator", () => {
    expect(validateSplit(1000, 500, false)).toMatch(/collaborator/i);
  });
  it("accepts valid", () => {
    expect(validateSplit(1000, 500, true)).toBeNull();
  });
});
