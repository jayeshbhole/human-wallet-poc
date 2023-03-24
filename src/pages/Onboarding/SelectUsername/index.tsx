import { Box, Input } from '@chakra-ui/react';
import { useContext, useMemo, useState } from 'react';
import { OnboardingActionButton } from '../../../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../../components/Onboarding/headings';
import { OnboardingContext } from '../../../contexts/OnboardingContext';

const SelectUsername = () => {
  const [username, setUsername] = useState('');
  const { selectUsernameAndDeploy } = useContext(OnboardingContext);
  const [inputBlur, setInputBlur] = useState(false);

  const handleAction = () => {
    selectUsernameAndDeploy(username);
  };

  const inputError = useMemo(() => {
    // const pattern = '^(?=.{3,20}$)[a-zA-Z0-9]+(?<!.uno)$';

    if (!username) return false;

    if (username.length < 3 || username.length > 20) return 'Username must be between 3 and 20 characters';

    const pattern = /[^a-zA-Z0-9]/;
    return pattern.test(username) ? 'Username must not contain any special characters or spaces' : false;
  }, [username]);

  return (
    <>
      <HeadingBox>
        <StepTitle>
          <>
            Select{' '}
            <HeadingEmphasis>
              Account <br />
              Username
            </HeadingEmphasis>
          </>
        </StepTitle>
        <StepDescription>
          Enter a username to identify your account. This username will be used publicly.
        </StepDescription>
      </HeadingBox>

      <Box>
        <Input
          variant="flushed"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="lg"
          borderBottom="2px"
          placeholder="eg. alicepays"
          fontSize={'2xl'}
          fontWeight={500}
          color="blackAlpha.700"
          _placeholder={{
            color: 'blackAlpha.400',
          }}
          borderColor={username ? (!inputError ? 'green.300' : 'red.500') : 'blackAlpha.400'}
          _focusWithin={{
            borderColor: username ? (!inputError ? 'green.300' : 'orange.500') : 'blackAlpha.800',
          }}
          _focusVisible={{
            borderColor: username ? (!inputError ? 'green.300' : 'orange.500') : 'blackAlpha.800',
          }}
          onBlur={() => setInputBlur(true)}
        />

        {inputError && inputBlur && (
          <Box
            color="red.500"
            fontSize="sm"
            mt={2}>
            {inputError}
          </Box>
        )}
      </Box>

      {/* Action Button */}
      <OnboardingActionButton onClick={handleAction}>Continue</OnboardingActionButton>
    </>
  );
};

export default SelectUsername;
