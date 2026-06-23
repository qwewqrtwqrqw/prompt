import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LikeButton } from "@/components/catalog/LikeButton";

vi.mock("@/lib/api", () => ({
  likeTemplate: vi.fn(async () => ({ id: 1, likes: 4 })),
}));

import { likeTemplate } from "@/lib/api";

describe("LikeButton", () => {
  it("увеличивает счётчик лайков", async () => {
    const user = userEvent.setup();
    render(<LikeButton templateId={1} initialLikes={3} />);

    await user.click(screen.getByRole("button", { name: /Поставить лайк/i }));

    expect(likeTemplate).toHaveBeenCalledWith(1);
    expect(screen.getByRole("button")).toHaveTextContent("♥ 4");
  });
});
