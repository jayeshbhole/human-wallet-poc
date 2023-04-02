import { Box, Button, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

const QuickActionButton = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick?: () => void }) => {
  return (
    <Button
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      h="auto"
      gap="2"
      p="0"
      _hover={{
        bg: 'transparent',
      }}
      bg="transparent"
      onClick={onClick}>
      <Box
        p="4"
        rounded="2xl"
        boxShadow="0px 2px 11px rgba(0, 0, 0, 0.10);"
        _hover={{
          boxShadow: '0px 2px 11px rgba(0, 0, 0, 0.15);',
        }}>
        {icon}
      </Box>
      <Text
        as="span"
        fontSize="sm"
        color="#0E24319f"
        fontWeight="600">
        {label}
      </Text>
    </Button>
  );
};
export default QuickActionButton;
