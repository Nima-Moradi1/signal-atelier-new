import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MobileExperienceReader } from "@/components/experience/mobile-experience-reader";
import { portfolio } from "@/content/portfolio";

describe("MobileExperienceReader", () => {
  it("uses native buttons to move across every résumé chapter", () => {
    render(<MobileExperienceReader experiences={portfolio.experience} />);

    const previous = screen.getByRole("button", {
      name: "Previous experience",
    });
    const next = screen.getByRole("button", { name: "Next experience" });

    expect(previous).toBeDisabled();
    expect(
      screen.getByRole("heading", { name: "Senior Frontend Developer" }),
    ).toBeInTheDocument();

    fireEvent.click(next);
    expect(
      screen.getByRole("heading", { name: "Senior Frontend Engineer" }),
    ).toBeInTheDocument();

    fireEvent.click(next);
    expect(
      screen.getByRole("heading", { name: "Frontend Developer" }),
    ).toBeInTheDocument();

    fireEvent.click(next);
    expect(
      screen.getByRole("heading", { name: "React Developer" }),
    ).toBeInTheDocument();
    expect(next).toBeDisabled();
  });

  it("keeps every highlight available in the active chapter", () => {
    render(<MobileExperienceReader experiences={portfolio.experience} />);

    for (const highlight of portfolio.experience[0].highlights) {
      expect(screen.getByText(highlight)).toBeInTheDocument();
    }
  });
});
