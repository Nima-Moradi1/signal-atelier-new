import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResumeDialog } from "@/components/ui/resume-dialog";

describe("ResumeDialog", () => {
  it("renders one optimized résumé page and the PDF actions", () => {
    render(
      <ResumeDialog
        open={false}
        resumeUrl="/nima-moradirad-resume.pdf"
        onClose={vi.fn()}
      />,
    );

    const preview = screen.getByAltText(/Nima Moradirad's résumé/i);
    expect(preview.getAttribute("src")).toContain(
      "nima-moradirad-resume-preview.webp",
    );
    expect(screen.getAllByAltText(/résumé/i)).toHaveLength(1);
    expect(screen.queryByText(/Page 02/i)).not.toBeInTheDocument();
    expect(screen.getByText(/one-page overview/i)).toBeInTheDocument();
    expect(screen.getByText("Open full size").closest("a")).toHaveAttribute(
      "href",
      "/nima-moradirad-resume.pdf",
    );
    expect(screen.getByText("Download PDF").closest("a")).toHaveAttribute(
      "download",
    );
  });
});
