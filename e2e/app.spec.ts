import { test, expect } from "@playwright/test";

test("главная страница и навигация", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Изучайте промпт-инженерию/i })).toBeVisible();

  await page.getByRole("link", { name: "Обучение" }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole("heading", { name: "Техники промпт-инженерии" })).toBeVisible();
});

test("каталог показывает публичные шаблоны", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByRole("heading", { name: "Каталог шаблонов" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Chain-of-Thought/i })).toBeVisible();
});

test("вход и переход в личный кабинет", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByLabel("Пароль").fill("demo123");
  await page.getByRole("button", { name: "Войти" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Личный кабинет" })).toBeVisible();
});

test("форма создания шаблона валидирует поля", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByLabel("Пароль").fill("demo123");
  await page.getByRole("button", { name: "Войти" }).click();

  await page.getByRole("link", { name: "Создать шаблон" }).click();
  await page.getByRole("button", { name: "Сохранить шаблон" }).click();

  await expect(page.getByRole("alert").first()).toBeVisible();
});
