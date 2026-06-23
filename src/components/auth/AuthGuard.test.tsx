import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGuard } from "@/components/auth/AuthGuard";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/context/AuthContext";

describe("AuthGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("показывает загрузку до готовности", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      token: null,
      isReady: false,
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <AuthGuard>
        <div>Secret</div>
      </AuthGuard>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Загрузка...");
  });

  it("редиректит неавторизованного пользователя", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      token: null,
      isReady: true,
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <AuthGuard>
        <div>Secret</div>
      </AuthGuard>,
    );

    expect(replaceMock).toHaveBeenCalledWith("/login");
  });

  it("рендерит children для авторизованного", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 1, name: "User", email: "u@u.ru" },
      token: "token-1",
      isReady: true,
      setSession: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <AuthGuard>
        <div>Secret</div>
      </AuthGuard>,
    );

    expect(screen.getByText("Secret")).toBeInTheDocument();
  });
});
