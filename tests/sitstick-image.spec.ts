import { test, expect } from '@playwright/test';

for (const [width, height] of [[1920,1080], [1440,900], [1366,768], [1024,768], [768,1024], [390,844]]) {
  test(`complete SitStick watercolor fits at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-ready=true]')).toBeAttached({ timeout: 15000 });
    await page.getByRole('button', { name: 'Show SITSTICK' }).click();
    const frame = page.locator('[data-sitstick-image]');
    await expect(frame).toHaveAttribute('data-started', 'true', { timeout: 15000 });
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const image = frame.locator('img');
    await expect(image).toHaveAttribute('src', '/images/showcase/sitstick-watercolor.png');
    await expect(image).toHaveCSS('object-fit', 'contain');
    expect(await image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBe(1672);
    expect(await frame.evaluate(el => {
      const f = el.getBoundingClientRect(); const i = el.querySelector('img')!.getBoundingClientRect();
      const svg = el.querySelector('svg[data-story]')!.getBoundingClientRect();
      return i.left >= f.left && i.top >= f.top && i.right <= f.right && i.bottom <= f.bottom && Math.abs(i.width / i.height - 1672 / 941) < .001 && Math.abs(svg.width - i.width) < 1 && Math.abs(svg.left - i.left) < 1;
    })).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await frame.screenshot({ path: `work/sitstick-watercolor-${width}.png` });
  });
}

test('story replays on intentional hover, pauses offscreen and respects reduced motion', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-ready=true]')).toBeAttached({ timeout: 15000 });
  await page.getByRole('button', { name: 'Show SITSTICK' }).click();
  const frame = page.locator('[data-sitstick-image]');
  await expect(frame).toHaveAttribute('data-started', 'true', { timeout: 15000 });
  await page.waitForTimeout(1200);
  await page.mouse.move(0, 0);
  await frame.hover();
  await expect(frame.locator('[data-story]')).toHaveAttribute('data-story', '1');
  await page.mouse.move(0, 0); await frame.hover();
  await expect(frame.locator('[data-story]')).toHaveAttribute('data-story', '2');
  // Keep the active carousel selection locked during the offscreen observation.
  await page.getByRole('button', { name: 'Show SITSTICK' }).click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(frame).toHaveAttribute('data-running', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Show SITSTICK' }).click();
  await expect(frame.locator('[data-story]')).toHaveCSS('display', 'none');
  await expect(frame.locator('img').locator('..')).toHaveCSS('opacity', '1');
  expect(await frame.evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length)).toBe(0);
});
