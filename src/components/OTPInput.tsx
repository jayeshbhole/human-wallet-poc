import { Dispatch, SetStateAction, createRef, useContext, useMemo, useRef, useState } from 'react';
import Keypad from './Keypad';
import { OnboardingContext } from '../contexts/OnboardingContext';
import { Box, Button, Input } from '@chakra-ui/react';

const RE_DIGIT = new RegExp(/^\d+$/);

const OTPInput = ({ value, setOTP }: { value: string; setOTP: Dispatch<SetStateAction<string>> }) => {
  const onChange = (value: string) => setOTP(value);
  const { handleResendOTP, canResendOTP } = useContext(OnboardingContext);

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

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
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

      onChange(newValue);

      if (!isTargetValueDigit) {
        return;
      }

      focusToNextInput(target);
    } else if (targetValueLength === 6) {
      onChange(targetValue);

      target.blur();
    }
  };
  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling = target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };
  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling = target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };
  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };
  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;
    const prevInputEl = target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === '') {
      return prevInputEl.focus();
    }

    target.setSelectionRange(0, target.value.length);
  };

  const handleKeyPadClick = (value: string) => {
    const lastInputIdx = valueItems.findIndex((item) => item === '') - 1;

    if (value === 'backspace') {
      setOTP((prev) => prev.slice(0, -1).slice(0, 6));
      const target = targetRefs?.[lastInputIdx]?.current;
      target?.focus();
    } else {
      const target = targetRefs?.[lastInputIdx + 1]?.current;
      if (!target) return;

      target.value = value;
      inputOnChange({ target, currentTarget: target } as any, lastInputIdx + 1);
    }
  };

  return (
    <>
      <Box
        w="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        mt="auto">
        {/* OTP input */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(6, 1fr)"
          gridGap={4}>
          {valueItems.map((digit, idx) => (
            <Input
              key={idx}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{1}"
              maxLength={6}
              value={digit}
              onChange={(e) => inputOnChange(e, idx)}
              onKeyDown={inputOnKeyDown}
              onFocus={inputOnFocus}
              ref={targetRefs[idx]}
              // chakra ui
              variant="unstyled"
              fontSize={'2xl'}
              fontWeight={500}
              color="blackAlpha.700"
              textAlign="center"
              borderBottomWidth={2}
              borderBottomColor="blackAlpha.400"
              rounded="none"
              _focus={{
                borderBottomColor: 'blackAlpha.800',
                outline: 'none',
              }}
              _focusVisible={{
                outline: 'none',
              }}
              _placeholder={{
                fontWeight: 500,
              }}
              _hover={{
                cursor: 'text',
              }}
              _disabled={{
                cursor: 'not-allowed',
                opacity: 0.5,
              }}
            />
          ))}
        </Box>

        {/* resend */}
        <Box>
          <Button
            variant="link"
            onClick={handleResendOTP}
            disabled={!canResendOTP}
            mt="4"
            fontSize="sm"
            color="gray.500"
            fontWeight="normal"
            _hover={{
              cursor: 'pointer',
            }}
            _disabled={{
              cursor: 'not-allowed',
              opacity: 0.5,
            }}
            textDecoration="underline"
            textUnderlineOffset={2}>
            Resend OTP
          </Button>
        </Box>
      </Box>

      {/* keypad */}
      <Keypad onKeypadClick={handleKeyPadClick} />
    </>
  );
};

export default OTPInput;
