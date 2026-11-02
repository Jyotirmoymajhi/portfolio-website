import { test, expect } from '@playwright/test';

test('single shell, sequential transitions, navigation and natural scroll boundaries', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('[data-ready=true]')).toBeAttached();
  const section = page.getByRole('region', { name: 'Selected project showcase' });
  await section.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + 20, behavior: 'instant' }));
  await expect(page.locator('[data-project-content="ventry"]')).toBeVisible();
  const shell = page.locator('[aria-roledescription="carousel"]');
  const before = await shell.boundingBox();
  await page.getByRole('button', { name: 'Next project', exact: true }).click();
  await expect(page.locator('[data-project-content="tavvro"]')).toBeVisible();
  await expect(page.locator('[data-project-content]')).toHaveCount(1);
  const after = await shell.boundingBox();
  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
  await page.getByRole('button', { name: 'Show SITSTICK' }).click();
  await expect(page.locator('[data-project-content="sitstick"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next project', exact: true })).toBeDisabled();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('[data-project-content="tavvro"]')).toBeVisible();
  await page.waitForTimeout(1100);
  await page.mouse.wheel(0, -900);
  await expect(page.locator('[data-project-content="ventry"]')).toBeVisible();
  await page.mouse.wheel(0, 1000);
  await expect(page.locator('[data-project-content="tavvro"]')).toBeVisible();
  await page.mouse.wheel(0, 900);
  await expect(page.locator('[data-project-content="sitstick"]')).toBeVisible();
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
  expect(errors).toEqual([]);
});

test('touch controls retain a single active project', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/');
  await expect(page.locator('[data-ready=true]')).toBeAttached();
  await page.getByRole('button', { name: 'Show TAVVRO' }).tap();
  await expect(page.locator('[data-project-content="tavvro"]')).toBeVisible();
  await page.getByRole('button', { name: 'Next project', exact: true }).tap();
  await expect(page.locator('[data-project-content="sitstick"]')).toBeVisible();
  await expect(page.locator('[data-project-content]')).toHaveCount(1);
  await context.close();
});

for (const [width, height] of [[1920,1080], [1600,900], [1440,900], [1280,800], [1024,768], [768,1024], [430,932], [390,844], [375,812], [1280,720]]) {
  test(`showcase fits at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
  await expect(page.locator('[data-ready=true]')).toBeAttached();
    const section = page.getByRole('region', { name: 'Selected project showcase' });
    await section.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' }));
    for (const name of ['VENTRY', 'TAVVRO', 'SITSTICK']) {
      await page.getByRole('button', { name: `Show ${name}` }).click();
      await expect(page.locator(`[data-project-content="${name.toLowerCase()}"]`)).toBeVisible();
      await page.waitForTimeout(900);
      expect(await page.locator('[data-project-content]').evaluate(el => {
        const shell = el.closest('[aria-roledescription="carousel"]')!.getBoundingClientRect();
        return [...el.querySelectorAll('h2,h3,p,a')].every(child => { const r = child.getBoundingClientRect(); return r.left >= shell.left && r.right <= shell.right + 1 && r.bottom <= shell.bottom; });
      })).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const geometry = await page.locator('[data-project-content]').evaluate(el => {
        const heading = el.querySelector('h2')!.getBoundingClientRect();
        const image = el.querySelector('img')!.getBoundingClientRect();
        const body = el.querySelector('a')!.getBoundingClientRect();
        const thumbs = document.querySelector('[aria-label="Choose a project"]')!.getBoundingClientRect();
        const nav = document.querySelector('[aria-label="Project navigation"]')!.getBoundingClientRect();
        const card = el.closest('[aria-roledescription="carousel"]')!.getBoundingClientRect();
        return { horizontal: image.left > heading.right, bodyAboveThumbs: body.bottom <= thumbs.top, navInside: nav.bottom <= card.bottom && nav.right <= card.right, cardHeight: card.height };
      });
      expect(geometry.horizontal).toBe(width >= 768);
      expect(geometry.bodyAboveThumbs).toBe(true);
      expect(geometry.navInside).toBe(true);
      if (width >= 768) expect(geometry.cardHeight).toBeLessThanOrEqual(height - 90);
    }
    await page.getByRole('button', { name: 'Show VENTRY' }).click();
    await page.waitForTimeout(1000);
    await page.locator('[aria-roledescription="carousel"]').screenshot({ path: `work/showcase-${width}.png`, style: 'header, .site-cursor { visibility: hidden !important; }' });
  });
}

test('reduced motion and touch-sized navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('[data-ready=true]')).toBeAttached();
  await page.getByRole('button', { name: 'Show TAVVRO' }).click();
  await expect(page.locator('[data-project-content="tavvro"]')).toBeVisible();
  await expect(page.locator('[data-project-content]')).toHaveCount(1);
  const height = await page.getByRole('region', { name: 'Selected project showcase' }).evaluate(el => el.getBoundingClientRect().height);
  expect(height).toBeLessThan(1500);
});
