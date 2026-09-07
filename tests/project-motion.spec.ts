import { expect, test, type Page } from '@playwright/test';

async function openPortfolio(page: Page, hash = '') {
  await page.goto(`/${hash}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.project-loader')).toHaveAttribute(
    'data-complete',
    'true',
  );
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
}

async function scrollProject(page: Page, progress: number) {
  await page.evaluate((value) => {
    const spacer = document.querySelector('.pin-spacer')!;
    const header = document.querySelector('header')!;
    const start =
      spacer.getBoundingClientRect().top +
      scrollY -
      header.getBoundingClientRect().height;
    window.scrollTo({
      top: start + innerHeight * 1.8 * value,
      behavior: 'instant',
    });
  }, progress);
}

test('loader counts, releases scroll, refreshes, and desktop scrub reverses', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const samples: { text: string; active: boolean; at: number }[] = [];
    Object.assign(window, { loaderSamples: samples });
    new MutationObserver(() => {
      const loader = document.querySelector('.project-loader');
      if (!loader) return;
      const sample = {
        text: loader.querySelector('output')?.textContent || '',
        active: loader.hasAttribute('data-active'),
        at: performance.now(),
      };
      const last = samples[samples.length - 1];
      if (!last || last.text !== sample.text || last.active !== sample.active)
        samples.push(sample);
    }).observe(document, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['data-active'],
    });
  });
  await openPortfolio(page);
  // Warm Vinext's development module transforms, then verify a full refresh.
  // A cold dev-server hydration may legitimately take the CSS safety path.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.project-loader')).toHaveAttribute(
    'data-complete',
    'true',
  );
  const samples = await page.evaluate(
    () =>
      (
        window as unknown as {
          loaderSamples: { text: string; active: boolean; at: number }[];
        }
      ).loaderSamples,
  );
  expect(samples.some((sample) => sample.text === '00%')).toBeTruthy();
  expect(samples.some((sample) => sample.text === '100%')).toBeTruthy();
  const values = samples
    .filter((sample) => sample.active)
    .map((sample) => Number.parseInt(sample.text));
  expect(values.length).toBeGreaterThan(10);
  expect(values).toEqual([...values].sort((a, b) => a - b));
  const active = samples.find((sample) => sample.active)!;
  const finished = samples.find(
    (sample) => !sample.active && sample.at > active.at,
  )!;
  expect(finished.at - active.at).toBeGreaterThanOrEqual(1200);
  expect(finished.at - active.at).toBeLessThan(3200);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator('.pin-spacer')).toHaveCount(1);

  for (const progress of [0, 0.5, 0.9, 0.5, 0]) {
    await scrollProject(page, progress);
    if (progress === 0) {
      await expect(page.locator('#ventry .ventry-artwork')).toHaveCSS(
        'opacity',
        '1',
      );
      await expect(page.locator('#ventry .ventry-button')).toHaveCSS(
        'opacity',
        '1',
      );
      await expect(page.locator('#tavvro')).toHaveAttribute('inert', '');
    } else if (progress === 0.9) {
      await expect(page.locator('#tavvro .ventry-button')).toHaveCSS(
        'opacity',
        '1',
      );
      await expect(page.locator('#tavvro .ventry-artwork')).toHaveCSS(
        'filter',
        'blur(0px)',
      );
      await expect(page.locator('#ventry')).toHaveAttribute('inert', '');
    } else {
      await expect
        .poll(async () =>
          Number(
            await page
              .locator('#tavvro .ventry-artwork')
              .evaluate((el) => getComputedStyle(el).opacity),
          ),
        )
        .toBeGreaterThan(0.3);
      await expect.poll(() => page
        .locator('#ventry .ventry-artwork')
        .evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.1);
    }
  }
  await expect(page.locator('.project-loader')).toHaveAttribute(
    'data-complete',
    'true',
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.project-loader')).toHaveAttribute(
    'data-active',
    'true',
  );
  await expect(page.locator('.project-loader')).toHaveAttribute(
    'data-complete',
    'true',
  );
  expect(errors).toEqual([]);
});

test('desktop/tablet buttons fit and resize removes duplicate pins', async ({
  page,
}) => {
  await openPortfolio(page);
  for (const [width, height] of [
    [1440, 900],
    [1536, 864],
    [1920, 1080],
    [1280, 800],
    [1024, 768],
    [768, 1024],
  ]) {
    await page.setViewportSize({ width, height });
    await expect(page.locator('.pin-spacer')).toHaveCount(1);
    for (const [id, progress] of [
      ['ventry', 0],
      ['tavvro', 0.9],
      ['sitstick', 1.9],
    ] as const) {
      await scrollProject(page, progress);
      await expect(page.locator(`#${id} .ventry-button`)).toHaveCSS(
        'opacity',
        '1',
      );
      await expect
        .poll(
          async () =>
            (await page.locator(`#${id} .ventry-button`).boundingBox())!.y +
            (await page.locator(`#${id} .ventry-button`).boundingBox())!.height,
        )
        .toBeLessThanOrEqual(height + 1);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBeTruthy();
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
});

test('mobile is image-first, scrollable, and reveals all project buttons', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolio(page);
  for (const width of [390, 360, 767]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    for (const id of ['ventry', 'tavvro', 'sitstick']) {
      const project = page.locator(`#${id}`);
      await project.locator('.ventry-artwork').scrollIntoViewIfNeeded();
      await expect(project.locator('.project-image-entrance')).toHaveCSS(
        'opacity',
        '1',
      );
      const image = await project.locator('.ventry-artwork').boundingBox();
      const text = await project.locator('.ventry-label').boundingBox();
      expect(image!.y + image!.height).toBeLessThan(text!.y);
      await project.locator('.ventry-button').scrollIntoViewIfNeeded();
      await expect(project.locator('.ventry-button')).toHaveCSS('opacity', '1');
      expect(
        (await project.locator('.ventry-button').boundingBox())!.height,
      ).toBeGreaterThanOrEqual(44);
      const button = (await project.locator('.ventry-button').boundingBox())!;
      const label = (await project
        .locator('.ventry-button span')
        .boundingBox())!;
      expect(label.y).toBeGreaterThanOrEqual(button.y);
      expect(label.y + label.height).toBeLessThanOrEqual(
        button.y + button.height,
      );
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
});

test('reduced motion skips loading and pinning, including live preference changes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPortfolio(page);
  await expect(page.locator('.project-loader')).toBeHidden();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  for (const id of ['ventry', 'tavvro', 'sitstick']) {
    await expect(page.locator(`#${id} .ventry-artwork`)).toHaveCSS(
      'filter',
      'none',
    );
    await expect(page.locator(`#${id} .ventry-button`)).toHaveCSS(
      'opacity',
      '1',
    );
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.pin-spacer')).toHaveCount(1);
  await scrollProject(page, 0.9);
  await expect(page.locator('#tavvro .ventry-button')).toHaveCSS(
    'opacity',
    '1',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('#ventry')).not.toHaveAttribute('inert', '');
  await expect(page.locator('#tavvro')).not.toHaveAttribute('inert', '');
});

test('stalled image decoding cannot trap the loader', async ({ page }) => {
  await openPortfolio(page);
  await page.addInitScript(() => {
    HTMLImageElement.prototype.decode = () => new Promise<void>(() => {});
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.project-loader')).toHaveAttribute(
    'data-active',
    'true',
  );
  const start = Date.now();
  await expect(page.locator('.project-loader')).toHaveAttribute(
    'data-complete',
    'true',
    { timeout: 3300 },
  );
  expect(Date.now() - start).toBeLessThan(3300);
  await expect(page.locator('.project-loader output')).toHaveText('100%');
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');
});

test('no JavaScript still exposes the original project content', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.project-loader')).toBeHidden({ timeout: 4000 });
  await expect(page.locator('#ventry .ventry-button')).toHaveCSS(
    'opacity',
    '1',
  );
  await expect(page.locator('#tavvro .ventry-button')).toHaveCSS(
    'opacity',
    '1',
  );
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await context.close();
});

test('project anchors and original links retain their destinations', async ({
  page,
  context,
}) => {
  await openPortfolio(page, '#tavvro');
  await expect(page.locator('#tavvro .ventry-button')).toHaveCSS(
    'opacity',
    '1',
  );
  const tavvro = page.locator('#tavvro .ventry-button');
  await expect(tavvro).toHaveAttribute('href', '/tavvro-colour.png');
  const popupPromise = page.waitForEvent('popup');
  await tavvro.click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(popup.url()).toContain('/tavvro-colour.png');
  await popup.close();

  await scrollProject(page, 0);
  const ventry = page.locator('#ventry .ventry-button');
  await expect(ventry).toHaveCSS('opacity', '1');
  const originalUrl =
    'https://www.behance.net/gallery/243632661/Ventry-An-Omnichannel-UX-Case-Study';
  await expect(ventry).toHaveAttribute('href', originalUrl);
  // Verify the actual click/new-tab destination without relying on Behance uptime.
  await context.route(originalUrl, (route) =>
    route.fulfill({ body: 'Case study destination' }),
  );
  const externalPromise = page.waitForEvent('popup');
  await ventry.click();
  const external = await externalPromise;
  await external.waitForLoadState();
  expect(external.url()).toBe(originalUrl);
  await external.close();
});

test('SitStick uses aligned uncropped images and reverses back through Tavvro', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await openPortfolio(page, '#sitstick');
  expect(
    await page
      .locator('.ventry-project')
      .evaluateAll((elements) => elements.map((element) => element.id)),
  ).toEqual(['ventry', 'tavvro', 'sitstick']);
  const project = page.locator('#sitstick');
  await expect(project.locator('.ventry-button')).toHaveCSS('opacity', '1');
  await expect(project.locator('.sitstick-colour-reveal')).toHaveCSS(
    'opacity',
    '1',
  );
  const images = project.locator('img');
  await expect(images).toHaveCount(2);
  for (const image of await images.all()) {
    await expect(image).toHaveCSS('object-fit', 'contain');
    expect(
      await image.evaluate(
        (element) => (element as HTMLImageElement).naturalWidth,
      ),
    ).toBeGreaterThan(0);
  }
  await expect(images.nth(0)).toHaveAttribute(
    'src',
    '/images/projects/sitstick/sitstick-bw.png',
  );
  await expect(images.nth(1)).toHaveAttribute(
    'src',
    '/images/projects/sitstick/sitstick-color.png',
  );
  expect(await images.nth(0).boundingBox()).toEqual(
    await images.nth(1).boundingBox(),
  );
  const url =
    'https://www.behance.net/gallery/248914979/SitStick-Redefining-Elderly-Mobility-Product-Design';
  await expect(project.locator('.ventry-button')).toHaveAttribute('href', url);
  await context.route(url, (route) =>
    route.fulfill({ body: 'SitStick case study destination' }),
  );
  const popupPromise = page.waitForEvent('popup');
  await project.locator('.ventry-button').click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(popup.url()).toBe(url);
  await popup.close();
  for (const progress of [1.5, 0.9, 0, 0.9, 1.5, 1.9]) {
    await scrollProject(page, progress);
    if (progress === 1.5) {
      await expect
        .poll(() =>
          project
            .locator('.ventry-artwork')
            .evaluate((element) => Number(getComputedStyle(element).opacity)),
        )
        .toBeGreaterThan(0.3);
      await expect.poll(() => page
          .locator('#tavvro .ventry-artwork')
          .evaluate((element) => Number(getComputedStyle(element).opacity))
      ).toBeGreaterThan(0.1);
    } else {
      const id =
        progress === 0 ? 'ventry' : progress === 0.9 ? 'tavvro' : 'sitstick';
      await expect(page.locator(`#${id} .ventry-artwork`)).toHaveCSS(
        'opacity',
        '1',
      );
      await expect(page.locator(`#${id}`)).toHaveAttribute(
        'aria-hidden',
        'false',
      );
    }
  }
  await scrollProject(page, 2.2);
  await expect
    .poll(() =>
      page
        .locator('.project-stage')
        .evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(0);
  expect(errors).toEqual([]);
});
