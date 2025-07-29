import { expect, Locator } from '@playwright/test';

export class GenericSteps {
  static async fillInput(input: Locator, value: string | number, label: string): Promise<void> {
    await input.waitFor({ state: 'visible' });
    await expect(input, `${label} input should be enabled`).toBeEnabled();
    await input.clear();
    await input.fill(value.toString());
  }

  static async getErrorText(errorLocator: Locator): Promise<string | null> {
    return await errorLocator.textContent();
  }
}
