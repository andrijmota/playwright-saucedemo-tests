import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';
const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';
const LOCKED_USER = 'locked_out_user';

// --- Helpers (читабельність) ---
async function openLogin(page: Page) {
  await page.goto(BASE_URL);
  await expect(page.getByText('Swag Labs', { exact: true })).toBeVisible();
}

async function login(page: Page, username: string, password: string) {
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

function errorBox(page: Page) {
  return page.locator('[data-test="error"]');
}

async function expectStillOnLogin(page: Page) {
  await expect(page).toHaveURL(BASE_URL);
  await expect(page).not.toHaveURL(/inventory\.html/);
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
}

async function expectErrorContains(page: Page, re: RegExp) {
  const err = errorBox(page);
  await expect(err).toBeVisible();
  await expect(err).toContainText(re);
}

// --- Test suite ---
test.describe('SauceDemo - Negative login cases (max set)', () => {
  test.beforeEach(async ({ page }) => {
    await openLogin(page);
  });

  // 1) Валідації "обовʼязкове поле"
  test('Username empty (click Login)', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
    await expectStillOnLogin(page);
    await expectErrorContains(page, /Username is required/i);
  });

  test('Password empty with valid username', async ({ page }) => {
    await login(page, VALID_USER, '');
    await expectStillOnLogin(page);
    await expectErrorContains(page, /Password is required/i);
  });

  // 2) Locked user (негативний бізнес-кейс) — окремо, бо інший меседж
  test('Locked out user cannot login', async ({ page }) => {
    await login(page, LOCKED_USER, VALID_PASS);
    await expectStillOnLogin(page);
    await expectErrorContains(page, /locked out/i);
  });

  // 3) УСІ кейси, де очікуємо один і той самий меседж "do not match any user"
  const invalidCredentialsCases: Array<{ name: string; u: string; p: string }> = [
    { name: 'Wrong password for valid user', u: VALID_USER, p: 'wrong_password' },
    { name: 'Wrong username with valid password', u: 'wrong_user', p: VALID_PASS },
    { name: 'Wrong username and wrong password', u: 'wrong_user', p: 'wrong_password' },

    // пробіли/таби/переноси
    { name: 'Password is only spaces', u: VALID_USER, p: '   ' },
    { name: 'Username has leading/trailing spaces', u: `  ${VALID_USER}  `, p: VALID_PASS },
    { name: 'Password has leading/trailing spaces', u: VALID_USER, p: `  ${VALID_PASS}  ` },
    { name: 'Username includes tab/newline characters', u: `standard\t_user`, p: VALID_PASS },

    // case sensitivity
    { name: 'Username in different case (STANDARD_USER)', u: 'STANDARD_USER', p: VALID_PASS },

    // довгі строки / спецсимволи
    { name: 'Very long username', u: 'a'.repeat(300), p: VALID_PASS },
    { name: 'Very long password', u: VALID_USER, p: 'a'.repeat(300) },
    { name: 'Username with special characters', u: '!@#$%^&*()_+{}:"<>?', p: VALID_PASS },

    // “security-like”
    { name: 'SQL-like string as username', u: `' OR 1=1 --`, p: VALID_PASS },
    { name: 'XSS-like string as username', u: `<script>alert(1)</script>`, p: VALID_PASS },
  ];

  for (const c of invalidCredentialsCases) {
    test(c.name, async ({ page }) => {
      await login(page, c.u, c.p);
      await expectStillOnLogin(page);
      await expectErrorContains(page, /do not match any user/i);
    });
  }

  // 4) Окремий кейс: "Username is only spaces" -> SauceDemo НЕ трімить пробіли, тому це invalid credentials
test('Username is only spaces', async ({ page }) => {
  await login(page, '   ', VALID_PASS);
  await expectStillOnLogin(page);
  await expectErrorContains(page, /do not match any user/i);
});

  // 5) UX перевірки для помилки
  test('Error can be dismissed and appears again after next attempt', async ({ page }) => {
    await login(page, VALID_USER, 'wrong_password');

    const err = errorBox(page);
    await expect(err).toBeVisible();

    const closeBtn = page.locator('[data-test="error-button"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(err).toBeHidden();

    // повторна спроба -> помилка повернулась
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(err).toBeVisible();
  });
});