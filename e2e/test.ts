import type { BuildJson } from '../build/plugins/generate-template';
import { Anki } from './anki';
import { test as base } from '@playwright/test';

export type TestOptions = {
  build: BuildJson;
};

type TestFixtures = {
  anki: Anki;
  flip: () => Promise<void>;
};

export const test = base.extend<TestOptions & TestFixtures>({
  anki: async ({ page }, use) => {
    const anki = new Anki(page);
    await anki.init();
    await use(anki);
    await anki.clean();
  },
  flip: async ({ anki, build }, use) => {
    if (!build) {
      throw new Error('should have `build`');
    }
    const flip = await anki.renderCard(build);
    await use(flip);
  },
  build: [null as unknown as BuildJson, { option: true }],
});
