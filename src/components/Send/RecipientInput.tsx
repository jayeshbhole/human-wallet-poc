import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react';
import { ClipboardIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { ScanQR } from '../../assets/Icon/ScanQR';

const RecipientInput = ({
  recipient,
  handleRecipientChange,
  recipientSuggestions,
  recipientError,
}: {
  recipient: string;
  handleRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  recipientSuggestions: any[];
  recipientError: string;
}) => {
  return (
    <Flex
      direction="column"
      gap="4">
      {/* recipient quick actions */}
      <Flex
        direction="row"
        justify="space-between"
        align="center"
        w="full">
        <RecipientQuickButton
          label="Scan QR"
          icon={ScanQR}
          onClick={() => {}}
          isDisabled
        />
        <RecipientQuickButton
          label="Contacts"
          icon={NewspaperIcon}
          onClick={() => {}}
          isDisabled
        />
        <RecipientQuickButton
          label="Paste"
          icon={ClipboardIcon}
          onClick={() => {}}
        />
      </Flex>

      {/* recipient */}
      <Flex
        bg="gray.50"
        direction="column"
        rounded="2xl"
        gap="1"
        border="1px solid"
        borderColor={recipientError ? 'red.500' : 'blackAlpha.200'}
        p="4"
        transition="all 0.2s ease"
        _focusWithin={{
          border: '1px solid',
          borderColor: recipientError ? 'red.500' : 'blackAlpha.400',
        }}>
        <Flex justifyContent="space-between">
          <Text
            as="span"
            color="blackAlpha.600"
            fontSize="sm"
            fontWeight="600">
            Send To
          </Text>

          <Text
            as="span"
            display={recipientError ? 'block' : 'none'}
            color="red.600"
            fontSize="sm"
            fontWeight="500">
            {recipientError}
          </Text>
        </Flex>

        <Input
          value={recipient}
          onChange={handleRecipientChange}
          variant="unstyled"
          fontSize="lg"
          fontWeight="600"
          color="blackAlpha.700"
          _placeholder={{ color: 'blackAlpha.500' }}
          placeholder="Address / Username / ENS"
          rounded="none"
        />
      </Flex>
    </Flex>
  );
};

const RecipientQuickButton = ({
  onClick,
  label,
  icon,
  isDisabled,
}: {
  onClick: () => void;
  label: string;
  icon: any;
  isDisabled?: boolean;
}) => {
  return (
    <Button
      variant="ghost"
      px="2"
      py="2"
      backgroundColor="gray.100"
      color="blackAlpha.700"
      fontWeight="700"
      fontSize="sm"
      rounded="xl"
      _hover={{ bg: 'gray.200' }}
      isDisabled={isDisabled}
      onClick={onClick}>
      <Icon
        color="blackAlpha.700"
        as={icon}
        w="1.5rem"
        h="1.5rem"
        mr="2"
      />
      {label}
    </Button>
  );
};

export default RecipientInput;
