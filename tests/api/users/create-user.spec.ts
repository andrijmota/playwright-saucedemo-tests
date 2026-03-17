import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  test('should create a new user', async ({ request }) => {
    const newUser = {
      firstName: 'Andrii',
      lastName: 'Mota',
      age: 25,
      email: 'andrii.mota@test.com'
    };

    const response = await request.post('https://dummyjson.com/users/add', {
      data: newUser,
    });

    // 1. сервер відповів
    expect(response.status()).toBe(201);

    const body = await response.json();

    // 2. перевіряємо, що дані повернулись такі ж
    expect(body.firstName).toBe(newUser.firstName);
    expect(body.lastName).toBe(newUser.lastName);
    expect(body.email).toBe(newUser.email);

    // 3. перевіряємо що створився id
    expect(body).toHaveProperty('id');
  });
});