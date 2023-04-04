import { Button, Flex, Input, Text } from '@chakra-ui/react';

const AmountInput = ({
  amount,
  handleAmountChange,
  token,
  balance,
}: {
  amount: string;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  token: string;
  balance: string;
}) => {
  return (
    <Flex
      direction="column"
      w="full">
      <Flex
        bg="gray.50"
        direction="column"
        rounded="2xl"
        gap="1"
        border="1px solid"
        borderColor="blackAlpha.200"
        p="4"
        transition="all 0.2s ease"
        _focusWithin={{
          border: '1px solid',
          borderColor: 'blackAlpha.400',
        }}>
        <Text
          as="span"
          color="blackAlpha.600"
          fontSize="sm"
          fontWeight="600">
          Amount
        </Text>

        <Flex
          direction="row"
          align="center"
          justify="space-between">
          <Input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            variant="unstyled"
            fontSize="lg"
            fontWeight="600"
            color="blackAlpha.700"
            _placeholder={{ color: 'blackAlpha.500' }}
            placeholder="0.00"
            rounded="none"
          />

          <Button
            h="8"
            minH="8">
            {token}
          </Button>
        </Flex>
      </Flex>

      <Text
        as="span"
        color="blackAlpha.600"
        fontSize="sm"
        ml="3"
        mt="2">
        Balance: {balance} {token}
      </Text>
    </Flex>
  );
};

export default AmountInput;
