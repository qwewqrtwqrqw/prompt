import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema, templateSchema } from "@/lib/validators";

describe("validators", () => {
  it("пропускает корректный login", () => {
    const result = loginSchema.safeParse({
      email: "user@test.ru",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("отклоняет короткий пароль", () => {
    const result = loginSchema.safeParse({
      email: "user@test.ru",
      password: "123",
    });
    expect(result.success).toBe(false);
  });

  it("проверяет совпадение паролей при регистрации", () => {
    const result = registerSchema.safeParse({
      name: "Иван",
      email: "ivan@test.ru",
      password: "123456",
      confirmPassword: "654321",
    });
    expect(result.success).toBe(false);
  });

  it("валидирует шаблон промпта", () => {
    const result = templateSchema.safeParse({
      title: "Test",
      description: "Описание достаточной длины для проверки",
      content: "Длинный текст промпта для проверки валидации формы",
      category: "reasoning",
      isPublic: true,
    });
    expect(result.success).toBe(true);
  });

  it("требует минимальную длину content", () => {
    const result = templateSchema.safeParse({
      title: "Test template",
      description: "Описание достаточной длины для проверки",
      content: "короткий",
      category: "reasoning",
      isPublic: false,
    });
    expect(result.success).toBe(false);
  });
});
