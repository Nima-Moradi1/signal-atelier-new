import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider, useTheme } from "@/components/theme/theme-provider";

function ThemeControl() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "dark";
    window.localStorage.clear();
  });

  it("synchronizes the selected theme with the document and storage", () => {
    render(
      <ThemeProvider>
        <ThemeControl />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "dark" }));

    expect(screen.getByRole("button", { name: "light" })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("nima-portfolio-theme")).toBe("light");
  });
});
