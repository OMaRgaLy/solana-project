import { describe, expect, it } from "vitest";
import { draftUrl, langOf, parseWatchPayload } from "./core";

const KEY = "11111111111111111111111111111111";

describe("parseWatchPayload", () => {
  it("parses a valid deep-link payload", () => {
    expect(parseWatchPayload(`i_${KEY}_1730000000000`)).toEqual({ creator: KEY, id: "1730000000000" });
  });
  it("rejects garbage and non-numeric ids", () => {
    expect(parseWatchPayload("hello")).toBeNull();
    expect(parseWatchPayload(`i_${KEY}_abc`)).toBeNull();
  });
});

describe("langOf", () => {
  it("maps ru, kk and everything else", () => {
    expect(langOf("ru")).toBe("ru");
    expect(langOf("kk")).toBe("kk");
    expect(langOf("de")).toBe("en");
    expect(langOf(undefined)).toBe("en");
  });
});

describe("draftUrl", () => {
  it("encodes the draft into /create query", () => {
    const u = new URL(draftUrl({ title: "UI & UX", amount: "1.5", client: "Acme" }));
    expect(u.pathname).toBe("/create");
    expect(u.searchParams.get("title")).toBe("UI & UX");
    expect(u.searchParams.get("amount")).toBe("1.5");
  });
});
