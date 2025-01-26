import { test } from '../../test';
import {
  DEFAULT_SETTINGS,
  MCQ_SETTINGS,
  SETTINGS,
  settingSelector,
} from './utils.ts';
import { expect } from '@playwright/test';

SETTINGS.forEach((key) => {
  test(`${key} default status`, async ({ flip, page, build }) => {
    if (MCQ_SETTINGS.includes(key) && !build.config.entry.startsWith('mcq')) {
      test.skip();
    }
    const isDefault = DEFAULT_SETTINGS.includes(key);
    const selector = settingSelector(key);
    await page.getByTestId('index:setting').click();
    if (isDefault) {
      await expect(page.locator(selector)).toBeChecked();
    } else {
      await expect(page.locator(selector)).not.toBeChecked();
    }
    await flip();
    await page.getByTestId('index:setting').click();
    if (isDefault) {
      await expect(page.locator(selector)).toBeChecked();
    } else {
      await expect(page.locator(selector)).not.toBeChecked();
    }
  });
});
