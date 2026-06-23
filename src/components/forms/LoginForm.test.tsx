import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/forms/LoginForm";

const pushMock = vi.fn();
const setSessionMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/lib/api", () => ({
  login: vi.fn(async () => ({
    user: { id: 1, name: "Demo", email: "demo@example.com" },
    token: "token-1",
  })),
}));

vi.mock("@/lib/auth-storage", () => ({
  saveSession: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ setSession: setSessionMock }),
}));

describe("LoginForm", () => {
  it("показывает ошибки валидации", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
  });

  it("успешно логинит пользователя", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "demo@example.com");
    await user.type(screen.getByLabelText("Пароль"), "demo123");
    await user.click(screen.getByRole("button", { name: "Войти" }));

    await waitFor(() => {
      expect(setSessionMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });
});
