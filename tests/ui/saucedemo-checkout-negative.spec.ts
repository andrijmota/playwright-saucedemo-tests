import { test, expect, Page, Locator } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';
const USER = 'standard_user';
const PASS = 'secret_sauce';

// ---------- helpers ----------
async function login(page: Page) {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('Username').fill(USER);
  await page.getByPlaceholder('Password').fill(PASS);
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/inventory\.html/);
}

async function addFirstItemToCart(page: Page) {
  await expect(page).toHaveURL(/inventory\.html/);

  await page.getByRole('button', { name: /^add to cart$/i }).first().click();
  await page.locator('.shopping_cart_link').click();

  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator('.cart_item')).toBeVisible();
}

async function ensureOnCart(page: Page) {
  if (!/cart\.html/.test(page.url())) {
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
  }
}

async function clickCheckout(page: Page) {
  await page.getByRole('button', { name: /^checkout$/i }).click();
}

async function goToCheckoutStepOne(page: Page) {
  await login(page);
  await addFirstItemToCart(page);

  await clickCheckout(page);

  // Якщо раптом опинилися на step-two, Cancel веде на inventory,
  // тому відновлюємо маршрут: inventory -> cart -> checkout -> step-one
  if (page.url().includes('checkout-step-two.html')) {
    await clickCancel(page);
    await expect(page).toHaveURL(/inventory\.html/);

    await ensureOnCart(page);
    await clickCheckout(page);
  }

  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await expect(page.getByRole('button', { name: /^continue$/i })).toBeVisible();
}

async function fillCheckout(page: Page, first: string, last: string, zip: string) {
  await page.getByPlaceholder('First Name').fill(first);
  await page.getByPlaceholder('Last Name').fill(last);
  await page.getByPlaceholder('Zip/Postal Code').fill(zip);
}

/**
 * SauceDemo: сама помилка найчастіше рендериться як div[data-test="error"] або h3[data-test="error"]
 * Контейнер може залишатись видимим навіть після закриття.
 */
function errorMessage(page: Page): Locator {
  return page.locator('[data-test="error"]');
}

async function expectError(page: Page, re: RegExp) {
  // Якщо пішли на step-two — значить сайт прийняв введені значення і помилки не буде
  if (page.url().includes('checkout-step-two.html')) {
    throw new Error(
      'Expected validation error on checkout-step-one, but navigated to checkout-step-two (site accepted provided values).'
    );
  }
  const err = errorMessage(page);
  await expect(err).toBeVisible();
  await expect(err).toContainText(re);
}

async function closeError(page: Page) {
  // кнопка "X" закриття помилки
  const closeBtn = page.locator('[data-test="error-button"], .error-button');
  await expect(closeBtn).toBeVisible();
  await closeBtn.click();

  // перевіряємо, що саме повідомлення зникло (а не контейнер)
  await expect(errorMessage(page)).toHaveCount(0);
}

async function clickCancel(page: Page) {
  const cancel = page.locator('#cancel');

  // гарантуємо що елемент реально є
  await expect(cancel, 'Cancel control (#cancel) not found on the page').toHaveCount(1);

  // і що він видимий/клікабельний
  await expect(cancel).toBeVisible();
  await cancel.click();
}

// ---------- tests ----------
test.describe('SauceDemo - Negative Checkout (Step One validations)', () => {
  test.beforeEach(async ({ page }) => {
    await goToCheckoutStepOne(page);
  });

  test('All fields empty -> First Name is required', async ({ page }) => {
    await page.getByRole('button', { name: /^continue$/i }).click();
    await expectError(page, /first name is required/i);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('First Name empty -> First Name is required', async ({ page }) => {
    await fillCheckout(page, '', 'User', '12345');
    await page.getByRole('button', { name: /^continue$/i }).click();
    await expectError(page, /first name is required/i);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Last Name empty -> Last Name is required', async ({ page }) => {
    await fillCheckout(page, 'Test', '', '12345');
    await page.getByRole('button', { name: /^continue$/i }).click();
    await expectError(page, /last name is required/i);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Postal Code empty -> Postal Code is required', async ({ page }) => {
    await fillCheckout(page, 'Test', 'User', '');
    await page.getByRole('button', { name: /^continue$/i }).click();
    await expectError(page, /postal code is required/i);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Fields with only spaces -> SauceDemo accepts them (goes to step-two)', async ({ page }) => {
    await fillCheckout(page, '   ', '   ', '   ');
    await page.getByRole('button', { name: /^continue$/i }).click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('Error can be closed and appears again after next attempt', async ({ page }) => {
    await page.getByRole('button', { name: /^continue$/i }).click();

    const err = errorMessage(page);
    await expect(err).toBeVisible();

    await closeError(page);

    // next attempt -> error appears again
    await page.getByRole('button', { name: /^continue$/i }).click();
    await expect(err).toBeVisible();
  });

  test('Cancel returns to cart', async ({ page }) => {
    await clickCancel(page);
    await expect(page).toHaveURL(/cart\.html/);
  });
});