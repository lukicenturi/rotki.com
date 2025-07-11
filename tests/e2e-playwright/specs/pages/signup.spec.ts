import { expect, test } from '@playwright/test';

test.describe('signup test', () => {
  test('complete signup flow', async ({ page }) => {
    await page.route('/webapi/countries/', async (route) => {
      await route.fulfill({
        body: JSON.stringify({
          result: [{ code: 'CT', name: 'Country' }],
        }),
        contentType: 'application/json',
        status: 200,
      });
    });

    await test.step('show introduction page', async () => {
      await page.goto('/signup');
      await expect(page.locator('text=Important Note')).toBeVisible();
      await expect(page.locator('[data-testid=next-button]')).toBeVisible();
      await expect(page.locator('[data-testid=next-button]')).toBeEnabled();
      // Click the next button
      await page.locator('[data-testid=next-button]').click();

      const usernameInput = page.locator('input#username').first();
      const emailInput = page.locator('input#email').first();
      const passwordInput = page.locator('input#password').first();
      const confirmPasswordInput = page.locator('input#password-confirmation').first();
      const nextButton = page.locator('button[data-testid=next-button]').first();

      await expect(usernameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(confirmPasswordInput).toBeVisible();
      await expect(nextButton).toBeDisabled();

      await usernameInput.fill('username');
      await emailInput.fill('email@gmail.com');
      await passwordInput.fill('p455w0rD');
      await confirmPasswordInput.fill('p455w0rD');
      await expect(nextButton).toBeEnabled();
      await nextButton.click();
      // Wait for customer information form to appear
      await page.waitForSelector('input#first-name', { state: 'visible' });
    });

    await test.step('show customer information form', async () => {
      const firstNameInput = page.locator('input#first-name').first();
      const lastNameInput = page.locator('input#last-name').first();
      const companyNameInput = page.locator('input#company-name').first();
      const vatIdInput = page.locator('input#vat-id').first();
      const nextButton = page.locator('button[data-testid=next-button]').first();

      await expect(firstNameInput).toBeVisible();
      await expect(lastNameInput).toBeVisible();
      await expect(companyNameInput).toBeVisible();
      await expect(vatIdInput).toBeVisible();
      await expect(nextButton).toBeDisabled();

      await firstNameInput.fill('First');
      await lastNameInput.fill('Last');
      await nextButton.click();
      // Wait for address form to appear
      await page.waitForSelector('input#address-1', { state: 'visible' });
    });

    await test.step('show address form', async () => {
      const address1Input = page.locator('input#address-1').first();
      const address2Input = page.locator('input#address-2').first();
      const cityInput = page.locator('input#city').first();
      const postalInput = page.locator('input#postal').first();
      const countryInput = page.locator('#country input').first();
      const captcha = page.locator('div#signup-captcha').first();
      const tosInput = page.locator('input#tos').first();
      const submitButton = page.locator('button[data-cy=submit-button]').first();

      await expect(address1Input).toBeVisible();
      await expect(address2Input).toBeVisible();
      await expect(cityInput).toBeVisible();
      await expect(postalInput).toBeVisible();
      await expect(countryInput).toBeVisible();
      await expect(captcha).toBeVisible();
      await expect(tosInput).toBeVisible();
      await expect(submitButton).toBeDisabled();

      await address1Input.fill('Address first line');
      await address2Input.fill('Address second line');
      await cityInput.fill('City');
      await postalInput.fill('11703');
      await tosInput.click();
    });

    await test.step('checks signup postal input field for valid inputs!', async () => {
      // Now test postal input validation
      const postalInput = page.locator('input#postal').first();

      // Valid inputs
      await postalInput.fill('12345');
      await expect(page.locator('[data-cy=postal] .details .text-rui-error')).not.toBeVisible();

      await postalInput.clear();
      await postalInput.fill('ABC-40');
      await expect(page.locator('[data-cy=postal] .details .text-rui-error')).not.toBeVisible();

      await postalInput.clear();
      await postalInput.fill('ABC-40 224');
      await expect(page.locator('[data-cy=postal] .details .text-rui-error')).not.toBeVisible();

      // Invalid inputs
      await postalInput.clear();
      await postalInput.fill('12@345');
      const postalError = page.locator('[data-cy=postal] .details .text-rui-error').first();
      await expect(postalError).toBeVisible();

      await postalInput.clear();
      await postalInput.fill('12#345');
      await expect(postalError).toBeVisible();

      await postalInput.clear();
      await postalInput.fill('.');
      await expect(postalError).toBeVisible();

      await postalInput.clear();
      await postalInput.fill('105102');
      await expect(page.locator('#postal .details .text-rui-error')).not.toBeVisible();
    });
  });
});
