import { Box, Heading, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const HeadingEmphasis = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      as="span"
      color="text.primary">
      {children}
    </Text>
  );
};

export const StepTitle = ({ children }: { children: ReactNode }) => {
  return (
    <Heading
      className="__step-heading"
      fontWeight="600"
      fontSize="2xl"
      color="blackAlpha.500">
      {children}
    </Heading>
  );
};

export const StepDescription = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      color="blackAlpha.600"
      maxW="80%">
      {children}
    </Text>
  );
};

export const HeadingBox = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={3}>
      {children}
    </Box>
  );
};
