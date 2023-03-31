import { Button } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const OnboardingActionButton = ({
  children,
  onClick,
  disabled,
  ...props
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
      mt="auto"
      rounded="2xl"
      py={4}
      fontWeight="600"
      fontSize="lg"
      color="#FFFBFE"
      bg="#04100F"
      _hover={{}}
      _active={{ opacity: 1 }}
      _disabled={{ opacity: 0.75, cursor: 'not-allowed' }}
      onClick={onClick}
      isDisabled={disabled}
      {...props}>
      {children}
    </Button>
  );
};
