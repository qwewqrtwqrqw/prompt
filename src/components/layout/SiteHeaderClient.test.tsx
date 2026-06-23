import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeaderClient } from "@/components/layout/SiteHeaderClient";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/context/AuthContext";

describe("SiteHeaderClient", () => {
  it("показывает кнопку входа для гостя", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      token: null,
      isReady: true,
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(<SiteHeaderClient />);
    expect(screen.getByRole("link", { name: "Войти" })).toBeInTheDocument();
  });

  it("показывает имя и выход для авторизованного", async () => {
    const logout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 1, name: "Анна", email: "a@a.ru" },
      token: "token-1",
      isReady: true,
      setSession: vi.fn(),
      logout,
    });

    render(<SiteHeaderClient />);
    expect(screen.getByText("Анна")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Выйти" }));
    expect(logout).toHaveBeenCalled();
  });
});
