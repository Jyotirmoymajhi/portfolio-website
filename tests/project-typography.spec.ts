import { expect, test } from '@playwright/test';

const viewports = [
  [1920, 1080], [1440, 900], [1366, 768], [1024, 768],
  [768, 1024], [390, 844], [360, 800],
];

for (const [width, height] of viewports) {
  test(`project typography and visible buttons at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('.project-loader')).toHaveAttribute('data-complete', 'true', { timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    let reference: unknown;
    for (const [index, id] of ['ventry', 'tavvro', 'sitstick'].entries()) {
      await page.evaluate(({ index, id }) => {
        const spacer = document.querySelector('.pin-spacer');
        const navHeight = document.querySelector('header')!.getBoundingClientRect().height;
        const panel = document.querySelector(`#${id} .project-copy`)!;
        const top = spacer
          ? spacer.getBoundingClientRect().top + scrollY - navHeight + innerHeight * 1.8 * index
          : panel.getBoundingClientRect().top + scrollY - navHeight - 8;
        window.scrollTo({ top, behavior: 'instant' });
      }, { index, id });
      const panel = page.locator(`#${id} .project-copy`);
      const button = panel.locator('.portfolio-button');
      await expect(button).toHaveCSS('opacity', '1');
      await expect(panel).toHaveCSS('opacity', '1');
      // Wait for the existing scrub to settle before measuring viewport geometry.
      await expect.poll(async () => panel.evaluate(el => getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
      const measured = await panel.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const elements = [...el.children] as HTMLElement[];
        const styles = elements.map(child => {
          const css = getComputedStyle(child);
          return { size: css.fontSize, line: css.lineHeight, weight: css.fontWeight, spacing: css.letterSpacing, margin: css.marginBottom };
        });
        return {
          styles,
          top: elements[0].getBoundingClientRect().top,
          bottom: elements.at(-1)!.getBoundingClientRect().bottom,
          height: rect.height,
          nav: document.querySelector('header')!.getBoundingClientRect().bottom,
          // The button's preserved corner hover decoration extends 6px outside it.
          overflow: elements.some(child => {
            const text = child.matches('a') ? child.querySelector('.resume-label')! : child;
            return text.scrollWidth > text.clientWidth + 1;
          }),
          outsidePanel: elements.some(child => {
            const r = child.getBoundingClientRect();
            return r.left < rect.left - 1 || r.right > rect.right + 1 || r.bottom > rect.bottom + 1;
          }),
          button: { width: elements.at(-1)!.getBoundingClientRect().width, height: elements.at(-1)!.getBoundingClientRect().height },
          pageOverflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      expect(measured.overflow, id).toBe(false);
      expect(measured.outsidePanel, id).toBe(false);
      expect(measured.pageOverflow, id).toBe(false);
      expect(measured.top, id).toBeGreaterThanOrEqual(measured.nav);
      expect(measured.bottom, id).toBeLessThanOrEqual(height);
      if (width >= 1024) expect(measured.height, id).toBeLessThanOrEqual(height - measured.nav);
      expect(Number.parseFloat(measured.styles[4].size)).toBeGreaterThanOrEqual(16);
      expect(Number.parseFloat(measured.styles[5].size)).toBeGreaterThanOrEqual(16);
      expect(measured.button.height).toBeGreaterThanOrEqual(52);
      expect(measured.button.width).toBeLessThan(200);
      expect(measured.styles.map(s => s.margin)).toEqual(['24px', '24px', '28px', '24px', '22px', '26px', '0px']);
      const comparable = { styles: measured.styles, button: measured.button };
      if (reference) expect(comparable).toEqual(reference);
      else reference = comparable;
      await expect(button).toHaveText('View Project');
      await page.screenshot({ path: `work/typography-${width}-${id}.png` });
    }
  });
}
