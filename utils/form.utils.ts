import { expect, Locator } from '@playwright/test';

export async function fillInput(
  input: Locator,
  value: string | number,
  label: string
): Promise<void> {
  await input.waitFor({ state: 'visible' });
  await expect(input, `${label} input should be enabled`).toBeEnabled();
  await input.clear();
  await input.fill(value.toString());
}

export async function getErrorText(errorLocator: Locator): Promise<string | null> {
  return await errorLocator.textContent();
}
