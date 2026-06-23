import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "@/components/forms/RegisterForm";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/lib/api", () => ({
  register: vi.fn(async () => ({
    user: { id: 2, name: "New", email: "new@test.ru" },
    token: "token-2",
  })),
}));

vi.mock("@/lib/auth-storage", () => ({
  saveSession: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ setSession: vi.fn() }),
}));

describe("RegisterForm", () => {
  it("валидирует обязательные поля", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.click(screen.getByRole("button", { name: "Создать аккаунт" }));
    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
  });

  it("регистрирует нового пользователя", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Имя"), "New User");
    await user.type(screen.getByLabelText("Email"), "new@test.ru");
    await user.type(screen.getByLabelText("Пароль"), "123456");
    await user.type(screen.getByLabelText("Подтверждение пароля"), "123456");
    await user.click(screen.getByRole("button", { name: "Создать аккаунт" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });
});
