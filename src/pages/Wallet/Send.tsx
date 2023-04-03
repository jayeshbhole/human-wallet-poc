import { Box, Button, Flex, Grid, Heading, Icon, Input, Spacer, Text } from '@chakra-ui/react';
import { BriefcaseIcon, ClipboardIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ScanQR } from '../../assets/Icon/ScanQR';
import BackButton from '../../components/BackButton';
import { useKeyringContext } from '../../contexts/KeyringContext';

const Send = () => {
  const [currency, setCurrency] = useState('USD');
  const [token, setToken] = useState('ETH');
  const [balance, setBalance] = useState('0.00');
  const [inputMode, setInputMode] = useState<'amount' | 'value'>('value');
  // amount of currency to send
  const [amount, setAmount] = useState('');
  // currency value in USD
  const [value, setValue] = useState('');

  const { activeAccount } = useKeyringContext();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // amount should always have the token suffix
    const { value } = e.target;
    if (!Number.isNaN(Number(value))) {
      setAmount(Number(value).toString());
    }
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
        {/* Page Header */}
        <Grid
          templateColumns="3rem 1fr 3rem"
          justifyItems="center"
          alignItems="center">
          <BackButton justifySelf="start" />

          <Heading
            as="h3"
            color="blackAlpha.700"
            fontWeight="500"
            fontSize="2xl"
            textAlign="center">
            Send ETH
          </Heading>
        </Grid>

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
              Send To
            </Text>

            <Input
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

        {/* Amount Input */}
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
              type="text"
              onClick={handleAmountChange}
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
      </Flex>

      <Spacer />
      {/* Divider */}
      {/* <Box border="1px solid #04100F16" /> */}

      <Flex
        direction="column"
        w="full"
        p="8"
        gap="3">
        <Flex
          justifyContent="space-between"
          px="2">
          <Text
            as="span"
            color="blackAlpha.600"
            fontSize="sm"
            fontWeight="600">
            Send on
            <Text
              as="span"
              ml="2"
              textDecor="underline">
              Goerli
            </Text>
          </Text>

          <Text
            as="span"
            color="blackAlpha.600"
            fontSize="sm"
            fontWeight="600">
            Fees $0.10
          </Text>
        </Flex>
        <Flex
          direction="row"
          justifyContent="space-between"
          align="center"
          p="4"
          rounded="2xl"
          bg="blackAlpha.50">
          <Text
            as="span"
            color="blackAlpha.700"
            fontWeight="600">
            {activeAccount?.username ?? 'username'}
            <Text
              as="span"
              textColor="gray.400">
              @one
            </Text>
          </Text>

          <Icon
            w="6"
            h="6"
            as={BriefcaseIcon}
            strokeWidth="1.5"
            color="blackAlpha.600"
          />
        </Flex>
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
          Send ETH
        </Button>
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

export default Send;
