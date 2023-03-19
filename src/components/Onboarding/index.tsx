import { Button } from '@chakra-ui/react';
import { ReactNode } from 'react';

export { OnboardingStepHeading } from './headings';

export const OnboardingActionButton = ({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <Button
      variant="solid"
      w="full"
      h="auto"
      rounded="xl"
      py={4}
      fontWeight="600"
      fontSize="xl"
      color="blackAlpha.800"
      bg="gray.100"
      _hover={{ bg: 'gray.200' }}
      onClick={onClick}
      isDisabled={disabled}>
      {children}
    </Button>
  );
};
