import { expect, test } from '@playwright/test';

test.describe('homepage', () => {
  test('successfully loads', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
  });

  test('checks our homepage hero buttons!', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('button:has-text("Download rotki for free")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Start now for free")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Get Premium")').first()).toBeVisible();
  });
});

test.describe('download page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('download page loads properly', async ({ page }) => {
    await page.locator('button:has-text("Start now for free")').first().click();

    await expect(page).toHaveURL(/.*\/download/);

    await expect(page.locator('div:has(h6:text("Download rotki"))').first()).toBeVisible();

    await expect(page.locator('div:has(h3:text("Download now and start using across all major Operating Systems"))').first()).toBeVisible();
  });

  test('show links for mac', async ({ context, page }) => {
    // Set user agent at context level
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        writable: false,
      });
    });

    await page.goto('/download');

    // Check that both MAC download buttons are visible
    const macButtons = page.locator('[data-cy="main-download-button"]:has-text("Download for MAC")');
    await expect(macButtons).toHaveCount(2);

    // Verify both Apple Silicon and Intel buttons
    await expect(page.locator('[data-cy="main-download-button"]:has-text("Download for MAC Apple Silicon")')).toBeVisible();
    await expect(page.locator('[data-cy="main-download-button"]:has-text("Download for MAC Intel")')).toBeVisible();
  });

  test('show links for linux', async ({ context, page }) => {
    // Set user agent at context level
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        writable: false,
      });
    });

    await page.goto('/download');

    await expect(page.locator('[data-cy="main-download-button"]:has-text("Download for LINUX")')).toBeVisible();
  });

  test('show links for windows', async ({ context, page }) => {
    // Set user agent at context level
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        writable: false,
      });
    });

    await page.goto('/download');

    await expect(page.locator('[data-cy="main-download-button"]:has-text("Download for WINDOWS")')).toBeVisible();
  });

  // test('checks all download links!', async ({ page }) => {
  //   await page.goto('/download');
  //   await page.locator('[data-cy="show-all-download"]').click();
  //
  //   const linuxLink = page.locator('h6:text("LINUX")').first();
  //   const appleLink = page.locator('h6:text("MAC")').first();
  //   const windowsLink = page.locator('h6:text("WINDOWS")').first();
  //
  //   await expect(linuxLink).toBeVisible();
  //   await expect(appleLink).toBeVisible();
  //   await expect(windowsLink).toBeVisible();
  //   await expect(page.locator('p:text("Latest Release: v")').first()).toBeVisible();
  //
  //   // Linux download button
  //   const linuxSection = linuxLink.locator('../..');
  //   const linuxButton = linuxSection.locator('div button:has-text("Download")').locator('..');
  //   await expect(linuxButton).toBeVisible();
  //   await expect(linuxButton).toBeEnabled();
  //
  //   const linuxButtonParent = linuxButton.locator('..');
  //   const linuxHref = await linuxButtonParent.getAttribute('href');
  //   expect(linuxHref).toContain('rotki-linux');
  //   expect(linuxHref).toContain('.AppImage');
  //
  //   // Windows download button
  //   const windowsSection = windowsLink.locator('../..');
  //   const windowsButton = windowsSection.locator('div button:has-text("Download")').locator('..');
  //   await expect(windowsButton).toBeVisible();
  //   await expect(windowsButton).toBeEnabled();
  //
  //   const windowsButtonParent = windowsButton.locator('..');
  //   const windowsHref = await windowsButtonParent.getAttribute('href');
  //   expect(windowsHref).toContain('rotki-win32');
  //   expect(windowsHref).toContain('.exe');
  //
  //   // Apple download button (with dropdown)
  //   const appleSection = appleLink.locator('../..');
  //   const appleButton = appleSection.locator('div button:has-text("Download")').locator('..');
  //   await expect(appleButton).toBeVisible();
  //   await appleButton.click();
  //
  //   const appleMenu = page.locator('[role="menu-content"]');
  //   await expect(appleMenu).toBeVisible();
  //
  //   const appleSiliconLink = page.locator('a:has-text("MAC Apple Silicon")');
  //   const appleIntelLink = page.locator('a:has-text("MAC Intel")');
  //
  //   const appleSiliconHref = await appleSiliconLink.getAttribute('href');
  //   expect(appleSiliconHref).toContain('rotki-darwin_arm');
  //   expect(appleSiliconHref).toContain('.dmg');
  //
  //   const appleIntelHref = await appleIntelLink.getAttribute('href');
  //   expect(appleIntelHref).toContain('rotki-darwin_x');
  //   expect(appleIntelHref).toContain('.dmg');
  //
  //   // Docker section
  //   const dockerLink = page.locator('h6:text("DOCKER")').first();
  //   await expect(dockerLink).toBeVisible();
  //
  //   const dockerSection = dockerLink.locator('..');
  //   const dockerInput = dockerSection.locator('input');
  //   await expect(dockerInput).toBeVisible();
  //   await expect(dockerInput).toHaveValue('docker pull rotki/rotki');
  // });
});
