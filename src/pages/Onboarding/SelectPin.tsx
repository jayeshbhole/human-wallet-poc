import { Box, Flex, Icon, Input } from '@chakra-ui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import Keypad from '../../components/Keypad';
import { OnboardingActionButton } from '../../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../components/Onboarding/headings';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import useDigitInputs from '../../hooks/useDigitInputs';

const RE_DIGIT = new RegExp(/^\d+$/);

const SelectDevicePin = () => {
  const [pinValue, setPinValue] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { selectUsernameAndDeploy } = useContext(OnboardingContext);

  const handleAction = () => {
    selectUsernameAndDeploy(pinValue);
  };

  const { valueItems, targetRefs, inputOnChange, inputOnKeyDown, inputOnFocus, handleKeyPadClick } = useDigitInputs({
    value: pinValue,
    setValue: setPinValue,
  });

  return (
    <>
      <HeadingBox>
        <StepTitle>
          <>
            Create a <br />
            <HeadingEmphasis>Device PIN</HeadingEmphasis>
          </>
        </StepTitle>
        <StepDescription>Create a PIN to secure your wallet on this device.</StepDescription>
      </HeadingBox>

      <Flex direction="column">
        <Box
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
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

          {/* see password toggle */}
          <Icon
            alignSelf="center"
            aria-label="toggle password visibility"
            h={6}
            w={6}
            color="blackAlpha.400"
            fontSize="md"
            cursor="pointer"
            onClick={() => setPasswordVisible((prev) => !prev)}
            as={!passwordVisible ? EyeIcon : EyeSlashIcon}
          />
        </Box>
      </Flex>

      {/* keypad */}
      <Keypad onKeypadClick={handleKeyPadClick} />

      {/* Action Button */}
      <OnboardingActionButton onClick={handleAction}>Select Username</OnboardingActionButton>
    </>
  );
};

export default SelectDevicePin;
