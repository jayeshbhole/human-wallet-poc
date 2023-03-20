import { Input } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { OnboardingActionButton } from '../../../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../../components/Onboarding/headings';
import { OnboardingContext } from '../../../contexts/OnboardingContext';

const SelectUsername = () => {
  const [username, setUsername] = useState('');
  const { selectUsernameAndDeploy } = useContext(OnboardingContext);

  const handleAction = () => {
    selectUsernameAndDeploy(username);
  };

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

      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        size="lg"
        placeholder="alicepays"
      />

      {/* Action Button */}
      <OnboardingActionButton onClick={handleAction}>Continue</OnboardingActionButton>
    </>
  );
};

export default SelectUsername;
