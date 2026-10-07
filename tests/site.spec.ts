import { expect, test } from "@playwright/test";

test("piano navigation and interactive sections work", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("http://127.0.0.1:3002/");
  await expect(page.getByRole("heading", { name: "CHRISTIE KANSKA" })).toBeVisible();

  await page.getByRole("button", { name: "Menu" }).click();
  const menu = page.locator("#full-menu");
  await expect(menu).toHaveClass(/open/);
  await expect(menu.getByRole("link", { name: /Education/ })).toBeVisible();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "menu-preview.png" });

  await menu.getByRole("link", { name: /Music/ }).click();
  await expect(menu).not.toHaveClass(/open/);
  await expect(page.locator("#music")).toBeInViewport();

  const tracks = page.locator(".track-list li");
  await tracks.nth(1).getByRole("button").click();
  await expect(tracks.nth(1)).toHaveClass(/active/);

  await page.locator("#newsletter-email").fill("listener@example.com");
  await page.locator(".newsletter button[type='submit']").click();
  await expect(page.getByText(/you.re on the list/i)).toBeVisible();
});
