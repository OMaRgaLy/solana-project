import { actionJson, actionOptions } from "@/lib/actions";

export const OPTIONS = actionOptions;

// Dialect/Blink URL-routing rules: map shareable /pay links to the Actions API.
export function GET() {
  return actionJson({
    rules: [
      { pathPattern: "/pay/*/*", apiPath: "/api/actions/invoice/*/*" },
      { pathPattern: "/api/actions/invoice/**", apiPath: "/api/actions/invoice/**" },
    ],
  });
}
