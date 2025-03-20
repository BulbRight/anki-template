import './cloze-input.css';
import {
  ClozeUnitData,
  domToCloze,
  getClozeData,
  getClozeNodes,
} from './dom-to-cloze';
import type { FieldProps } from '@/components/native-field';
import { useBack } from '@/hooks/use-back';
import { crossStorage } from '@/utils/cross-storage';
import { getEditOps, Op } from '@/utils/edit-ops';
import { AnkiField } from 'at/virtual/field';
import { FC, useEffect, useLayoutEffect, useRef } from 'react';

const CLOZED_ATTR = 'data-at-input-clozed';

function createInput(node: HTMLElement) {
  const input = document.createElement('input');
  input.classList.add('at-cloze-input');
  node.parentElement?.insertBefore(input, node);
}

const inputKey = (k: number) => `cloze-input-value-${k}`;

export type Report = {
  datas: ClozeUnitData[];
  nodes: Element[];
  answer: string;
  value: string;
  ops?: Op[];
};

export const ClozeInputField: FC<
  FieldProps & {
    setReports: (reports: Report[]) => void;
  }
> = ({ setReports, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [back] = useBack();

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.style.visibility = 'hidden';
  }, []);

  useEffect(() => {
    const { current: el } = ref;
    if (!el) {
      return;
    }
    const clozeCount = domToCloze(el);
    if (!back) {
      if (el.getAttribute(CLOZED_ATTR) === 'true') {
        return;
      }
      el.setAttribute(CLOZED_ATTR, 'true');
      for (let clozeIndex = 0; clozeIndex < clozeCount; clozeIndex++) {
        crossStorage.removeItem(inputKey(clozeIndex));
        const nodes = getClozeNodes(el, clozeIndex);
        if (!nodes.length) {
          continue;
        }
        nodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            node.style.display = 'none';
          }
        });
        const firstNode = nodes[0];
        if (firstNode instanceof HTMLElement) {
          createInput(firstNode);
        }
      }

      const onInput = (event: Event) => {
        const { target } = event;
        if (
          !(target instanceof HTMLInputElement) ||
          !target.nextSibling ||
          !(target.nextSibling instanceof Element)
        ) {
          return;
        }
        const data = getClozeData(target.nextSibling);
        if (!data) {
          return;
        }
        crossStorage.setItem(inputKey(data.index), target.value);
      };
      el.addEventListener('input', onInput, true);

      el.style.visibility = 'visible';
      return () => {
        for (let clozeIndex = 0; clozeIndex < clozeCount; clozeIndex++) {
          const nodes = getClozeNodes(el, clozeIndex);
          if (!nodes.length) {
            continue;
          }
          nodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              node.style.display = 'unset';
            }
          });
          const firstNode = nodes[0];
          if (
            firstNode instanceof HTMLElement &&
            firstNode.previousSibling instanceof HTMLInputElement
          ) {
            firstNode.previousSibling.remove();
          }
        }
        el.removeEventListener('input', onInput, true);
      };
    } else {
      const reports: Report[] = Array.from({
        length: process.env.NODE_ENV === 'development' ? 3 : clozeCount,
      }).map((_, idx) => {
        const nodes = getClozeNodes(el, idx);
        const datas = nodes.map(getClozeData) as ClozeUnitData[];
        const isWhole = datas.some((data) => data?.type === 'whole');
        const value = crossStorage.getItem(inputKey(idx), '') as string;
        const answer = datas.map((data) => data?.answer || '').join('');
        return {
          datas,
          nodes,
          value,
          answer,
          ops: isWhole ? undefined : getEditOps(value, answer),
        };
      });
      setReports(reports);
      el.style.visibility = 'visible';
    }
  }, [back]);
  return <AnkiField domRef={ref} {...props} />;
};
