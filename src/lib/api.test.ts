import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createTemplate,
  deleteTemplate,
  getMyTemplates,
  getPublicTemplates,
  getTemplate,
  getTopic,
  getTopics,
  likeTemplate,
  login,
  register,
  updateTemplate,
} from "@/lib/api";

const mockFetch = vi.fn();

afterEach(() => {
  vi.restoreAllMocks();
  global.fetch = fetch;
});

function mockResponse(data: unknown, ok = true, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok,
    status,
    json: async () => data,
  });
  global.fetch = mockFetch;
}

describe("api client", () => {
  it("login отправляет credentials", async () => {
    mockResponse({ user: { id: 1, name: "A", email: "a@a.ru" }, token: "token-1" });
    const result = await login("a@a.ru", "123456");
    expect(result.token).toBe("token-1");
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3001/auth/login",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("register создаёт пользователя", async () => {
    mockResponse({ user: { id: 2, name: "B", email: "b@b.ru" }, token: "token-2" }, true, 201);
    const result = await register("B", "b@b.ru", "123456");
    expect(result.user.name).toBe("B");
  });

  it("getTopics возвращает список", async () => {
    mockResponse([{ id: 1, slug: "cot", title: "CoT" }]);
    const topics = await getTopics();
    expect(topics).toHaveLength(1);
  });

  it("getTopic загружает тему", async () => {
    mockResponse({ id: 1, slug: "cot", title: "CoT" });
    const topic = await getTopic("cot");
    expect(topic.slug).toBe("cot");
  });

  it("getPublicTemplates фильтрует публичные", async () => {
    mockResponse([{ id: 1, isPublic: true }]);
    const templates = await getPublicTemplates();
    expect(templates[0].isPublic).toBe(true);
  });

  it("getTemplate загружает по id", async () => {
    mockResponse({ id: 5, title: "T" });
    const template = await getTemplate(5);
    expect(template.id).toBe(5);
  });

  it("getMyTemplates передаёт токен", async () => {
    mockResponse([]);
    await getMyTemplates("token-1");
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3001/me/templates",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token-1" }),
      }),
    );
  });

  it("createTemplate создаёт шаблон", async () => {
    mockResponse({ id: 10 }, true, 201);
    const payload = {
      title: "Title",
      description: "Description long enough",
      content: "Content long enough for validation",
      category: "reasoning",
      isPublic: true,
    };
    const created = await createTemplate("token-1", payload);
    expect(created.id).toBe(10);
  });

  it("updateTemplate обновляет шаблон", async () => {
    mockResponse({ id: 10, title: "New" });
    const payload = {
      title: "New",
      description: "Description long enough",
      content: "Content long enough for validation",
      category: "reasoning",
      isPublic: false,
    };
    const updated = await updateTemplate("token-1", 10, payload);
    expect(updated.title).toBe("New");
  });

  it("deleteTemplate удаляет шаблон", async () => {
    mockResponse({ id: 10 });
    const removed = await deleteTemplate("token-1", 10);
    expect(removed.id).toBe(10);
  });

  it("likeTemplate ставит лайк", async () => {
    mockResponse({ id: 1, likes: 4 });
    const result = await likeTemplate(1);
    expect(result.likes).toBe(4);
  });

  it("бросает ошибку при неуспешном ответе", async () => {
    mockResponse({ message: "Ошибка" }, false, 400);
    await expect(login("a@a.ru", "bad")).rejects.toThrow("Ошибка");
  });
});
