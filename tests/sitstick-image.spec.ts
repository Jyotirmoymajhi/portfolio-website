import { test, expect } from '@playwright/test';

for (const [width,height] of [[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[390,844]]) {
  test(`source-only breeze fits ${width}x${height}`, async ({page}) => {
    await page.setViewportSize({width,height});
    await page.goto('/',{waitUntil:'domcontentloaded'});
    await expect(page.locator('[data-ready=true]')).toBeAttached({timeout:15000});
    await page.getByRole('button',{name:'Show SITSTICK'}).click();
    const frame=page.locator('[data-sitstick-image]');
    await expect(frame).toHaveAttribute('data-running','true',{timeout:15000});
    await page.waitForTimeout(900);
    await expect(frame.locator('[data-travel], [data-petal], [data-story]')).toHaveCount(0);
    await expect(frame.locator('[data-kind=flower]:visible')).toHaveCount(4);
    await expect(frame.locator('[data-kind=tree]:visible')).toHaveCount(4);
    expect(await frame.locator('img').evaluateAll(images=>images.every(img=>img.getAttribute('src')==='/images/showcase/sitstick-watercolor.png' && getComputedStyle(img).objectFit==='contain'))).toBe(true);
    // At rest every full-size duplicate must align exactly with the base image.
    await frame.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=0;}));
    expect(await frame.evaluate(el=>{
      const base=el.querySelector('[data-base-image]')!.getBoundingClientRect();
      return [...el.querySelectorAll('[data-region]')].filter(e=>getComputedStyle(e).display!=='none').every(e=>{
        const r=e.querySelector('img')!.getBoundingClientRect();
        return Math.abs(r.x-base.x)<.1 && Math.abs(r.y-base.y)<.1 && Math.abs(r.width-base.width)<.1 && Math.abs(r.height-base.height)<.1;
      });
    })).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await frame.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>{a.currentTime=1700;}));
    await frame.screenshot({path:`work/sitstick-source-breeze-${width}.png`});
  });
}

test('local plants move without scrolling; static base, pause, resume, hover and reduced motion work',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-ready=true]')).toBeAttached({timeout:15000});
  await page.getByRole('button',{name:'Show SITSTICK'}).click();
  const frame=page.locator('[data-sitstick-image]');
  await expect(frame).toHaveAttribute('data-running','true',{timeout:15000});
  await page.waitForTimeout(900);
  const base=await frame.locator('[data-base-image]').boundingBox();
  const region=frame.locator('[data-motion=flowers-coral]');
  const before=await region.evaluate(el=>getComputedStyle(el).transform);
  const scroll=await page.evaluate(()=>scrollY);
  await page.waitForTimeout(2100);
  expect(await region.evaluate(el=>getComputedStyle(el).transform)).not.toBe(before);
  expect(await frame.locator('[data-base-image]').boundingBox()).toEqual(base);
  expect(await page.evaluate(()=>scrollY)).toBe(scroll);
  await frame.hover();
  await expect(frame).toHaveAttribute('data-hover','true');
  expect(await region.evaluate(el=>el.getAnimations()[0].playbackRate)).toBe(1.1);
  await page.mouse.move(0,0);
  await expect(frame).toHaveAttribute('data-hover','false');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await expect(frame).toHaveAttribute('data-running','false');
  expect(await frame.evaluate(el=>el.getAnimations({subtree:true}).some(a=>a.playState==='running'))).toBe(false);
  await page.evaluate(()=>{Reflect.deleteProperty(document,'hidden');document.dispatchEvent(new Event('visibilitychange'));});
  await expect(frame).toHaveAttribute('data-running','true');
  const outgoing=await frame.elementHandle();
  await page.getByRole('button',{name:'Show TAVVRO'}).click();
  expect(await outgoing!.evaluate(el=>el.dataset.present)).toBe('false');
  await expect(frame).toHaveCount(0);
  await page.getByRole('button',{name:'Show SITSTICK'}).click();
  await expect(frame).toHaveAttribute('data-running','true');
  expect(await region.evaluate(el=>Number(el.getAnimations()[0].currentTime))).toBeGreaterThan(2100);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(frame.locator('[data-garden]')).toHaveCSS('display','none');
  expect(await frame.evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length)).toBe(0);
});

test('starts at 40 percent visibility and pauses offscreen',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-ready=true]')).toBeAttached({timeout:15000});
  await page.getByRole('button',{name:'Show SITSTICK'}).evaluate(el=>(el as HTMLButtonElement).click());
  const frame=page.locator('[data-sitstick-image]');
  await expect(frame).toHaveAttribute('data-started','false');
  await frame.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-innerHeight+el.getBoundingClientRect().height*.35,behavior:'instant'}));
  await page.waitForTimeout(200);
  await expect(frame).toHaveAttribute('data-started','false');
  await frame.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-innerHeight+el.getBoundingClientRect().height*.45,behavior:'instant'}));
  await expect(frame).toHaveAttribute('data-running','true',{timeout:15000});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await expect(frame).toHaveAttribute('data-running','false');
});
