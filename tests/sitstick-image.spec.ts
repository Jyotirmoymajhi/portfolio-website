import { test, expect } from '@playwright/test';

for (const [width, height] of [[1920,1080], [1440,900], [1366,768], [1024,768], [768,1024], [390,844]]) {
  test(`SitStick garden fits at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-ready=true]')).toBeAttached({ timeout: 15000 });
    await page.getByRole('button', { name: 'Show SITSTICK' }).click();
    const frame = page.locator('[data-sitstick-image]');
    await expect(frame).toHaveAttribute('data-started', 'true', { timeout: 15000 });
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    const image = frame.locator('img');
    await expect(image).toHaveAttribute('src', '/images/showcase/sitstick-watercolor.png');
    await expect(image).toHaveCSS('object-fit', 'contain');
    expect(await image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBe(1672);
    expect(await frame.evaluate(el => {
      const f = el.getBoundingClientRect(); const i = el.querySelector('img')!.getBoundingClientRect();
      const garden = el.querySelector('[data-garden]')!.getBoundingClientRect();
      return i.left >= f.left && i.top >= f.top && i.right <= f.right && i.bottom <= f.bottom && Math.abs(i.width / i.height - 1672 / 941) < .001 && Math.abs(garden.width - i.width) < 1 && Math.abs(garden.left - i.left) < 1;
    })).toBe(true);
    await expect(frame.locator('[data-flower]:visible')).toHaveCount(width < 768 ? 4 : width <= 1050 ? 6 : 9);
    await expect(frame.locator('[data-petal]:visible')).toHaveCount(width < 768 ? 1 : width <= 1050 ? 2 : 3);
    await expect(frame.locator('svg, [data-story]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await frame.screenshot({ path: `work/sitstick-garden-${width}.png` });
  });
}

test('blooms once, restrains petals, pauses offscreen and in hidden tabs, and respects reduced motion', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-ready=true]')).toBeAttached({ timeout: 15000 });
  await page.getByRole('button', { name: 'Show SITSTICK' }).click();
  const frame = page.locator('[data-sitstick-image]');
  await expect(frame).toHaveAttribute('data-started', 'true', { timeout: 15000 });
  await page.waitForTimeout(2100);
  const bloomsFinished = () => frame.evaluate(el => el.getAnimations({ subtree: true }).filter(a => a instanceof CSSAnimation && a.animationName.includes('bloom')).every(a => a.playState === 'finished' && a.effect?.getTiming().iterations === 1));
  expect(await bloomsFinished()).toBe(true);
  await page.mouse.move(0, 0); await frame.hover();
  await expect(frame).toHaveAttribute('data-hover', 'true');
  expect(await bloomsFinished()).toBe(true);
  await page.mouse.move(0, 0);
  await expect(frame).toHaveAttribute('data-hover', 'false');
  // Sample a full petal cycle, including a hover restart of the first petal.
  expect(await frame.evaluate(el => {
    const petals = [...el.querySelectorAll('[data-petal]')];
    const animations = petals.map(p => p.getAnimations()[0]);
    let max = 0;
    for (let t = 0; t < 54000; t += 500) {
      animations.forEach((a, i) => { a.pause(); a.currentTime = i === 0 ? Math.max(0, t - 11000) : t; });
      max = Math.max(max, petals.filter(p => Number(getComputedStyle(p).opacity) > .01).length);
    }
    animations.forEach(a => a.play());
    return max;
  })).toBeLessThanOrEqual(2);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(frame).toHaveAttribute('data-running', 'false');
  expect(await frame.evaluate(el => el.getAnimations({ subtree: true }).some(a => a.playState === 'running'))).toBe(false);
  await page.evaluate(() => { Reflect.deleteProperty(document, 'hidden'); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(frame).toHaveAttribute('data-running', 'true');
  await page.getByRole('button', { name: 'Show SITSTICK' }).click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(frame).toHaveAttribute('data-running', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Show SITSTICK' }).click();
  await expect(frame.locator('[data-garden]')).toHaveCSS('display', 'none');
  expect(await frame.evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length)).toBe(0);
});
