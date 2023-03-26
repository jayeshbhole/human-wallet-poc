import { Box, Flex, Icon, Input } from '@chakra-ui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import Keypad from '../../components/Keypad';
import { OnboardingActionButton } from '../../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../components/Onboarding/headings';
import useDigitInputs from '../../hooks/useDigitInputs';

const SelectDevicePin = () => {
  const [pinValue, setPinValue] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');

  const [confirmPin, setConfirmPin] = useState(false);

  const errorMessage = useMemo(() => {
    if (confirmPin) {
      if (confirmPinValue && pinValue !== confirmPinValue) {
        return 'PINs do not match';
      }
    } else {
      if (pinValue && pinValue.length < 6) {
        return 'PIN must be 6 digits';
      }
    }
    return '';
  }, [pinValue, confirmPinValue, confirmPin]);

  const handleAction = () => {
    if (confirmPin) {
      if (pinValue === confirmPinValue) {
        //
      }
    } else {
      if (pinValue.length === 6) {
        setConfirmPin(true);
      }
    }
  };

  return (
    <>
      <HeadingBox>
        <StepTitle>
          {confirmPin ? (
            <>
              Confirm <br />
              <HeadingEmphasis>Device PIN</HeadingEmphasis>
            </>
          ) : (
            <>
              Create a <br />
              <HeadingEmphasis>Device PIN</HeadingEmphasis>
            </>
          )}
        </StepTitle>
        {confirmPin ? (
          <StepDescription>Confirm the device PIN.</StepDescription>
        ) : (
          <StepDescription>Create a PIN to secure your wallet on this device.</StepDescription>
        )}
      </HeadingBox>

      {/* PIN Input */}
      <PinInput
        pinValue={confirmPin ? confirmPinValue : pinValue}
        setPinValue={confirmPin ? setConfirmPinValue : setPinValue}
        error={errorMessage}
      />

      {/* Action Button */}
      <OnboardingActionButton onClick={handleAction}>{confirmPin ? 'Confirm' : 'Continue'}</OnboardingActionButton>
    </>
  );
};

const PinInput = ({
  pinValue,
  setPinValue,
  error,
}: {
  pinValue: string;
  setPinValue: Dispatch<SetStateAction<string>>;
  error: string;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { valueItems, targetRefs, inputOnChange, inputOnKeyDown, inputOnFocus, handleKeyPadClick } = useDigitInputs({
    value: pinValue,
    setValue: setPinValue,
  });

  return (
    <>
      <Flex direction="column">
        {/* see password toggle */}

        <Box
          display="grid"
          gridTemplateColumns="repeat(6, 1fr)"
          gridGap={4}>
          {valueItems.map((digit, idx) => (
            <Input
              key={idx}
              type={passwordVisible ? 'text' : 'password'}
              inputMode="numeric"
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

        <Flex
          mt="2"
          w="full"
          justify="space-between">
          {/* error */}
          {error && (
            <Box
              color="red.500"
              fontSize="sm">
              {error}
            </Box>
          )}
          <Icon
            aria-label="toggle password visibility"
            h={6}
            w={6}
            mr="2"
            ml="auto"
            color="blackAlpha.400"
            fontSize="md"
            cursor="pointer"
            onClick={() => setPasswordVisible((prev) => !prev)}
            as={passwordVisible ? EyeIcon : EyeSlashIcon}
          />
        </Flex>
      </Flex>

      {/* keypad */}
      <Keypad onKeypadClick={handleKeyPadClick} />
    </>
  );
};

export default SelectDevicePin;
