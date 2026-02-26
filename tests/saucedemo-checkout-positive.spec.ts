import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test('Successful checkout flow', async ({ page }) => {
  // 1. Open login page
  await page.goto(BASE_URL);

  // 2. Login
  await page.getByPlaceholder('Username').fill(USERNAME);
  await page.getByPlaceholder('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  // 3. Verify inventory page opened
  await expect(page).toHaveURL(/inventory\.html/);

  // 4. Add first product to cart
  await page.getByRole('button', { name: 'Add to cart' }).first().click();

  // 5. Open cart
  await page.locator('.shopping_cart_link').click();

  // 6. Verify product is in cart
  await expect(page.locator('.cart_item')).toBeVisible();

  // 7. Checkout
  await page.getByRole('button', { name: 'Checkout' }).click();

  // 8. Fill checkout form
  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('Zip/Postal Code').fill('12345');

  await page.getByRole('button', { name: 'Continue' }).click();

  // 9. Finish order
  await page.getByRole('button', { name: 'Finish' }).click();

  // 10. Verify success message
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});