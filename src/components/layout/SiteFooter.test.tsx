import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/layout/SiteFooter";

describe("SiteFooter", () => {
  it("показывает демо-аккаунт", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/demo@example.com/)).toBeInTheDocument();
  });
});
