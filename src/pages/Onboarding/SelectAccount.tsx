import { Box, Input } from '@chakra-ui/react';
import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingActionButton } from '../../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../components/Onboarding/headings';
import { OnboardingContext } from '../../contexts/OnboardingContext';

const SelectAccount = () => {
  const { deployedAccounts, phoneNumber, selectUsername } = useContext(OnboardingContext);

  const handleAction = () => {
    selectUsername(deployedAccounts?.[0].username);
  };

  return (
    <>
      <HeadingBox>
        <StepTitle>
          <>
            Found
            <br />
            <HeadingEmphasis>Your Account</HeadingEmphasis>
          </>
        </StepTitle>
        <StepDescription>
          Found accounts linked to <HeadingEmphasis>{phoneNumber}</HeadingEmphasis>
        </StepDescription>
      </HeadingBox>

      {deployedAccounts.map((account) => (
        <Box
          key={account.username}
          p={4}
          border="2px solid"
          borderColor="gray.600"
          borderRadius="2xl"
          mb={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'calc(100% - 8px)',
            height: 'calc(100% - 8px)',
            background: 'gray.100',
            borderRadius: 'xl',
            transform: 'translate(-50%, -50%)',
            zIndex: -1,
          }}>
          <Box
            zIndex="1"
            mb="2"
            fontSize="xl"
            fontWeight="600"
            color="text.primary">
            {account.username}
          </Box>
          <Box
            zIndex="1"
            fontSize="sm"
            fontWeight="500"
            color="gray.400"
            w="15ch"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis">
            {account.address}
          </Box>
        </Box>
      ))}

      {/* Action Button */}
      <OnboardingActionButton onClick={handleAction}>Continue</OnboardingActionButton>
    </>
  );
};

export default SelectAccount;
