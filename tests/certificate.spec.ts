import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('E2E: upload certificate and verify details', async ({ page }) => {
  await page.goto('https://js-qvfsmdwp.stackblitz.io/', {
    waitUntil: 'domcontentloaded',
  });

  // Проходимо StackBlitz gate
  for (let i = 0; i < 6; i++) {
    const runBtn = page.getByRole('button', { name: /run this project/i });

    if (await runBtn.isVisible().catch(() => false)) {
      await runBtn.click();
      await page.waitForTimeout(4000);
    }

    const uploadBtn = page.getByRole('button', { name: /завантажити/i });
    const backBtn = page.getByRole('button', { name: /^back$/i });
    const dropText = page.getByText(/перетягніть/i);

    if (
      await uploadBtn.isVisible().catch(() => false) ||
      await backBtn.isVisible().catch(() => false) ||
      await dropText.isVisible().catch(() => false)
    ) {
      break;
    }

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
  }

  // Якщо ми ще на головному екрані — відкриваємо drag&drop
  const uploadBtn = page.getByRole('button', { name: /завантажити/i });
  if (await uploadBtn.isVisible().catch(() => false)) {
    await uploadBtn.click();
  }

  const dropZone = page.getByText(/перетягніть/i);
  await expect(dropZone).toBeVisible({ timeout: 30000 });

  const filePath = path.resolve(__dirname, '../fixtures/cert.cer');
  const fileName = 'cert.cer';
  const buffer = fs.readFileSync(filePath);

  const dataTransfer = await page.evaluateHandle(
    async ({ fileName, mimeType, buffer }) => {
      const dt = new DataTransfer();
      const file = new File([new Uint8Array(buffer)], fileName, { type: mimeType });
      dt.items.add(file);
      return dt;
    },
    {
      fileName,
      mimeType: 'application/pkix-cert',
      buffer: Array.from(buffer),
    }
  );

  // Кидаємо файл у dropzone
  await dropZone.dispatchEvent('drop', { dataTransfer });

  const certName = 'Таксер Тест Тестерович';

// перевірка у списку сертифікатів
const certInList = page.getByRole('link', { name: certName });
await expect(certInList).toBeVisible({ timeout: 20000 });

// клік саме по елементу списку
await certInList.click();

// перевірка таблиці деталей
await expect(page.getByText(/SubjectCN|Common Name/i)).toBeVisible();
await expect(page.getByRole('cell', { name: certName })).toBeVisible();
await expect(page.getByText(/IssuerCN|Issuer Name/i)).toBeVisible();
await expect(page.getByText(/ValidFrom|Valid From/i)).toBeVisible();
await expect(page.getByText(/ValidTill|Valid To/i)).toBeVisible();
});