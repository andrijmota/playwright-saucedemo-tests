import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  test('should return all users', async ({ request }) => {
    const response = await request.get('https://dummyjson.com/users');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('users');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('skip');
    expect(body).toHaveProperty('limit');

    expect(Array.isArray(body.users)).toBeTruthy();
    expect(body.users.length).toBeGreaterThan(0);
  });
});