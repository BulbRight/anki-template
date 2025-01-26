export const MCQ_SETTINGS = [
  'randomOptions',
  'hideQuestionType',
  'blurOptions',
  'hideMcqAnswer',
];

export const SETTINGS = [
  'selectionMenu',
  'biggerText',
  'noScroll',
  'hideTimer',
  'hideAbout',
  ...MCQ_SETTINGS,
];

export const DEFAULT_SETTINGS = ['selectionMenu', 'randomOptions', 'noScroll'];

export const settingSelector = (key: string) =>
  `[data-testid="setting:${key}"] input`;
