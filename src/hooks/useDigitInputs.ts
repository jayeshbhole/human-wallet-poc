import { createRef, Dispatch, SetStateAction, useCallback, useMemo } from 'react';

const RE_DIGIT = new RegExp(/^\d+$/);

const useDigitInputs = ({ value, setValue }: { value: string; setValue: Dispatch<SetStateAction<string>> }) => {
  const valueItems = useMemo(() => {
    const valueArray = value.split('');
    const items: Array<string> = [];

    for (let i = 0; i < 6; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push('');
      }
    }

    return items;
  }, [value]);

  const targetRefs = useMemo(() => {
    return Array.from({ length: 6 }).map(() => createRef<HTMLInputElement>());
  }, []);

  const inputOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== '') {
      return;
    }

    targetValue = isTargetValueDigit ? targetValue : ' ';

    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue = value.substring(0, idx) + targetValue + value.substring(idx + 1);

      setValue(newValue);

      if (!isTargetValueDigit) {
        return;
      }

      focusToNextInput(target);
    } else if (targetValueLength === 6) {
      setValue(targetValue);

      target.blur();
    }
  }, []);
  const focusToNextInput = useCallback((target: HTMLElement) => {
    const nextElementSibling = target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  }, []);
  const focusToPrevInput = useCallback((target: HTMLElement) => {
    const previousElementSibling = target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  }, []);
  const inputOnKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const key = e.key;
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    const targetValue = target.value;

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length);

    if (e.key !== 'Backspace' || target.value !== '') {
      return;
    }

    // is a backspace input
    if (targetValue === '') {
      focusToPrevInput(target);
    } else target.value = '';
  }, []);
  const inputOnFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;
    const prevInputEl = target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === '') {
      return prevInputEl.focus();
    }

    target.setSelectionRange(0, target.value.length);
  }, []);

  const handleKeyPadClick = useCallback((value: string) => {
    const lastInputIdx = valueItems.findIndex((item) => item === '') - 1;

    if (value === 'backspace') {
      setValue((prev) => prev.slice(0, -1).slice(0, 6));
      const target = targetRefs?.[lastInputIdx]?.current;
      target?.focus();
    } else {
      const target = targetRefs?.[lastInputIdx + 1]?.current;
      if (!target) return;

      target.value = value;
      inputOnChange({ target, currentTarget: target } as any, lastInputIdx + 1);
    }
  }, []);

  return {
    valueItems,
    targetRefs,
    inputOnChange,
    inputOnKeyDown,
    inputOnFocus,
    handleKeyPadClick,
  };
};

export default useDigitInputs;
