import { Markdown } from './renderer';
import { FIELD_ID } from '@/utils/const';
import { domToText } from '@/utils/dom-to-text';
import useCreation from 'ahooks/es/useCreation';
import clsx from 'clsx';
import { FC, memo } from 'react';

export const MarkdownField: FC<{
  name: string;
  className?: string;
}> = memo(({ name, className }) => {
  const markdown = useCreation(() => {
    const node = document.getElementById(FIELD_ID(name));
    return node ? domToText(node) : '';
  }, [name]);

  return (
    <Markdown
      id={`anki-field-${name}`}
      className={clsx(
        'anki-field anki-markdown-field',
        'overflow-x-auto',
        'prose prose-neutral dark:prose-invert',
        className,
      )}
      value={markdown}
    />
  );
});

export default MarkdownField;
