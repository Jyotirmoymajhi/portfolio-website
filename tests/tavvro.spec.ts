import { test, expect } from '@playwright/test';

test('Tavvro opens internally at the top and project links resolve', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#tavvro');
  const link = page.locator('#tavvro a').filter({ hasText: 'View Project' });
  await expect(link).toHaveAttribute('href', '/works/tavvro');
  await expect(link).not.toHaveAttribute('target', '_blank');
  await link.click();
  await expect(page).toHaveURL(/\/works\/tavvro$/);
  await expect(page.locator('h1')).toHaveText('TAVVRO');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('audio')).toHaveCount(0);
  await expect(page.locator('.tc-section')).toHaveCount(14);
  const external = page.getByRole('link', { name: 'View Full Case Study' }).first();
  await expect(external).toHaveAttribute('target', '_blank');
  await expect(external).toHaveAttribute('rel', 'noopener noreferrer');
  await page.context().route('https://www.behance.net/**', route => route.fulfill({ body: 'External case study' }));
  const popupPromise = page.waitForEvent('popup');
  await external.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/behance.net\/gallery\/249204643/);
  await popup.close();
  await page.getByRole('link', { name: '← Back to Works', exact: true }).click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.locator('#projects')).toBeInViewport();
  for (const [name, anchor] of [['Previous Project', 'ventry'], ['Next Project', 'sitstick'], ['Back to Selected Work', 'projects']]) {
    await page.goto('/works/tavvro');
    await page.getByRole('link', { name, exact: name === 'Back to Selected Work' }).click();
    await expect(page).toHaveURL(new RegExp(`/#${anchor}$`));
    await expect(page.locator(`#${anchor}`)).toBeInViewport();
  }
});

test('artwork crossfades without geometry changes and is keyboard accessible', async ({ page }) => {
  await page.goto('/works/tavvro');
  const artwork = page.locator('.tc-hero-art [role=button]');
  const colour = artwork.locator('.ventry-colour');
  const before = await colour.boundingBox();
  await expect(colour).toHaveCSS('opacity', '0');
  await artwork.hover();
  await expect(colour).toHaveCSS('opacity', '1');
  expect(await colour.boundingBox()).toEqual(before);
  await page.mouse.move(0, 0);
  await expect(colour).toHaveCSS('opacity', '0');
  await page.keyboard.press('Tab');
  await expect(page.locator('.tc-skip')).toBeFocused();
  await artwork.focus();
  await expect(artwork).toHaveCSS('outline-style', 'solid');
  await artwork.press('Escape');
  await artwork.press('Enter');
  await expect(artwork).toHaveAttribute('aria-pressed', 'true');
});

test('responsive layouts stay inside viewport and reduced motion remains visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1440, 1280, 1024, 900, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/works/tavvro');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator('.tc-section').last()).toHaveCSS('opacity', '1');
    await page.locator('.tc-showcase').scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('img').evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
  }
  await page.screenshot({ path: 'work/tavvro-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'work/tavvro-desktop.png', fullPage: true });
});

test('touch toggles the colour artwork', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/works/tavvro');
  await expect(page.locator('.tavvro-case')).toHaveAttribute('data-ready', 'true');
  const artwork = page.locator('.tc-hero-art [role=button]');
  await artwork.tap();
  await expect(artwork).toHaveAttribute('data-colour', 'true');
  await artwork.tap();
  await expect(artwork).toHaveAttribute('data-colour', 'false');
  await context.close();
});
