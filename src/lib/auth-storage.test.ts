import { describe, expect, it, beforeEach } from "vitest";
import {
  clearSession,
  getStoredUser,
  getToken,
  saveSession,
} from "@/lib/auth-storage";

describe("auth-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("сохраняет и читает сессию", () => {
    saveSession("token-1", { id: 1, name: "Test", email: "t@t.ru" });
    expect(getToken()).toBe("token-1");
    expect(getStoredUser()?.email).toBe("t@t.ru");
  });

  it("очищает сессию", () => {
    saveSession("token-1", { id: 1, name: "Test", email: "t@t.ru" });
    clearSession();
    expect(getToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });
});
