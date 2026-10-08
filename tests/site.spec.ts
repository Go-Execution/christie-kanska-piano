import { expect, test } from "@playwright/test";

test("piano navigation and interactive sections work", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("http://127.0.0.1:3002/");
  await expect(page.getByRole("heading", { name: "CHRISTIE KANSKA" })).toBeVisible();

  const firstKey = page.getByRole("button", { name: "Play C piano note" }).first();
  await firstKey.dispatchEvent("pointerdown");
  await expect(firstKey).toHaveClass(/pressed/);

  await page.getByRole("button", { name: "Menu" }).click();
  const menu = page.locator("#full-menu");
  await expect(menu).toHaveClass(/open/);
  await expect(menu.getByRole("link", { name: /Education/ })).toBeVisible();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "menu-preview.png" });

  await menu.getByRole("link", { name: /Music/ }).click();
  await expect(menu).not.toHaveClass(/open/);
  await expect(page.locator("#music")).toBeInViewport();
  const artwork = page.locator("#music .wave-art");
  await artwork.hover({ position: { x: 35, y: 35 } });
  await expect.poll(() => artwork.evaluate((node) => node.style.getPropertyValue("--tilt-y"))).not.toBe("0deg");

  const tracks = page.locator(".track-list li");
  await tracks.nth(1).getByRole("button").click();
  await expect(tracks.nth(1)).toHaveClass(/active/);

  await page.locator("#newsletter-email").fill("listener@example.com");
  await page.locator(".newsletter button[type='submit']").click();
  await expect(page.getByText(/you.re on the list/i)).toBeVisible();
});
