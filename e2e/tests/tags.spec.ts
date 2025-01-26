import { test } from '../test';
import { expect } from '@playwright/test';

test('should not display tags', async ({ flip, page }) => {
  await expect(page.getByTestId('tags')).not.toBeAttached();
  await flip();
  await expect(page.getByTestId('tags')).not.toBeAttached();
});

test('should display tags', async ({ anki, page, build }) => {
  const flip = await anki.renderCard(build, {
    Tags: 'hello 世界',
  });
  await expect(page.getByTestId('tags')).toHaveText('hello / 世界');
  await flip();
  await expect(page.getByTestId('tags')).toHaveText('hello / 世界');
});
