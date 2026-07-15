import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

describe("contactSchema", () => {
  it("accepts a complete human message", () => {
    const result = contactSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I would like to discuss a thoughtful product collaboration.",
      company: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email and short messages", () => {
    const result = contactSchema.safeParse({
      name: "A",
      email: "not-an-email",
      message: "Too short",
      company: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    const result = contactSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "This otherwise looks like a valid message for the form.",
      company: "bot-value",
    });

    expect(result.success).toBe(false);
  });
});
