import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  test('should return user by id', async ({ request }) => {
    const response = await request.get('https://dummyjson.com/users/1');

    // перевірка статусу
    expect(response.status()).toBe(200);

    const body = await response.json();

    // перевірка даних
    expect(body.id).toBe(1);
    expect(body.firstName).toBeTruthy();
    expect(body.lastName).toBeTruthy();
    expect(body.email).toContain('@');
  });
});