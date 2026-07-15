import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "@/components/ui/section-heading";

describe("SectionHeading", () => {
  it("renders a semantic heading and optional description", () => {
    render(
      <SectionHeading
        index="01"
        eyebrow="About"
        title="A deliberate practice"
        description="Useful supporting context."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "A deliberate practice" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Useful supporting context.")).toBeInTheDocument();
  });
});
