import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import BackButton from '../../components/BackButton';
import Keypad from '../../components/Keypad';
import useDigitInputs from '../../hooks/useDigitInputs';

const Send = () => {
  const [currency, setCurrency] = useState('USD');
  const [token, setToken] = useState('ETH');
  const [balance, setBalance] = useState('0.00');
  const [inputMode, setInputMode] = useState<'amount' | 'value'>('value');
  // amount of currency to send
  const [amount, setAmount] = useState('');
  // currency value in USD
  const [value, setValue] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // amount should always have the token suffix
    const { value } = e.target;
    setAmount(Number(value).toString());
  };
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // value should always have a $ prefix
    const { value } = e.target;
    if (value.startsWith('$ ')) {
      if (!Number.isNaN(Number(value.slice(2)))) {
        setValue(value);
      }
    } else {
      if (!Number.isNaN(Number(value))) {
        setValue('$ ' + value);
      } else {
        setValue('');
      }
    }
  };

  return (
    <Flex
      direction="column"
      h="full">
      <Flex
        direction="column"
        w="100%"
        gap="8"
        py="8"
        px="8"
        pb="4">
        <Grid
          templateColumns="3rem 1fr 3rem"
          justifyItems="center"
          alignItems="center">
          <BackButton />

          <Heading
            as="h3"
            color="blackAlpha.700"
            fontWeight="500"
            fontSize="2xl"
            textAlign="center">
            Send
          </Heading>
        </Grid>

        {/* Amount Input */}
        <Flex
          position="relative"
          alignSelf="center"
          direction="column"
          w="28ch"
          alignItems="center">
          {/* nation currency input */}
          <Input
            value={inputMode === 'amount' ? amount : value}
            onChange={inputMode === 'amount' ? handleAmountChange : handleValueChange}
            placeholder="$ 0"
            variant="outline"
            h="auto"
            p="4"
            w="full"
            fontSize="4xl"
            fontWeight="400"
            textAlign="center"
            background="gray.50"
            border="2px solid"
            borderRadius="1rem 1rem 0px 0px"
            borderColor="gray.200"
            lineHeight="0"
            _placeholder={{
              color: 'blackAlpha.600',
            }}
            _hover={{
              borderColor: 'gray.400',
            }}
            _focusVisible={{
              borderColor: '#05B200',
            }}
          />

          {/* switch mode button */}
          <IconButton
            onClick={() => setInputMode(inputMode === 'amount' ? 'value' : 'amount')}
            position="absolute"
            top="4.8rem"
            right="-4"
            transform="translateY(-50%)"
            aria-label="Switch Mode"
            icon={<ArrowsUpDownIcon />}
            w="9"
            minW="9"
            h="9"
            variant="ghost"
            color="gray.500"
            background="gray.200"
            p="0.5rem"
            border="1px solid"
            borderRadius="xl"
            borderColor="gray.500"
          />

          <Flex
            direction="column"
            textAlign="center"
            w="full"
            fontWeight="400"
            border="2px solid"
            borderRadius="0px 0px 1rem 1rem"
            borderColor="gray.100"
            mt="-2px"
            background="gray.50"
            alignItems="center"
            justifyItems="center"
            fontSize="2xl"
            color="blackAlpha.600"
            p="4">
            <Text as="span">
              {(inputMode === 'amount' ? value : amount) || 0} {inputMode === 'amount' ? 'USD' : token}
            </Text>
            <Text
              as="span"
              fontSize="xs"
              color="blackAlpha.500">
              Balance {balance || '0.00'} {token}
            </Text>
          </Flex>

          {/* crypto currency input */}
          {/* <Flex
          w="full"
          fontWeight="400"
          border="2px solid"
          borderRadius="0px 0px 1rem 1rem"
          borderColor="gray.100"
          mt="-2px"
          background="gray.50"
          alignItems="center"
          justifyItems="center"
          fontSize="2xl"
          color="blackAlpha.600"
          px="4">
          <Input
            value={amount}
            onChange={handleAmountChange}
            py="4"
            variant="unstyled"
            fontSize="2xl"
            w="fit-content"
            textAlign="center"
            lineHeight="0"
            rounded="xl"
            _placeholder={{
              color: 'blackAlpha.500',
            }}
            _hover={{
              borderColor: 'gray.300',
            }}
            _focusVisible={{
              borderColor: '#05B200',
            }}
          />
          <Text
            fontSize="2xl"
            as="span"
            pointerEvents="none"
            userSelect="none"
            children={token}
          />
        </Flex> */}
        </Flex>
      </Flex>

      <Spacer />
      {/* Divider */}
      <Box border="1px solid #04100F16" />

      <Flex
        direction="column"
        w="full"
        p="8"
        gap="8">
        {/*  */}
        {/* <Keypad onKeypadClick={handleKeyPadClick} /> */}

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
          onClick={() => {}}>
          Choose Recipient
        </Button>
      </Flex>
    </Flex>
  );
};

export default Send;
