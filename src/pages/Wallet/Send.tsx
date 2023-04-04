import { Button, Flex, Grid, Heading, Icon, Spacer, Text } from '@chakra-ui/react';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { BigNumberish, ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import AmountInput from '../../components/Send/AmountInput';
import RecipientInput from '../../components/Send/RecipientInput';
import { useKeyringContext } from '../../contexts/KeyringContext';
import { SUBGRAPH_URL } from '../../utils/constants';

const HUMANACCOUNT_QUERY = `
query HumanAccounts($where: HumanAccount_filter) {
  humanAccounts(where: $where) {
    address
    username
  }
}`;

const Send = () => {
  const [recipient, setRecipient] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientSuggestions, setRecipientSuggestions] = useState<any>(null);
  const [recipientError, setRecipientError] = useState('');

  const [token, setToken] = useState('ETH');
  const [balance, setBalance] = useState<BigNumberish>('0.00');

  const [feeEstimate, setFeeEstimate] = useState<string>('0 ETH');

  // amount of currency to send
  const [amount, setAmount] = useState('');

  const { activeAccount, provider, bundler } = useKeyringContext();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // amount should always have the token suffix
    const { value } = e.target;
    setAmount(value);
  };

  // use debouncing to get recipient related data
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRecipient(value);
  };

  useEffect(() => {
    // get balance of account
    if (activeAccount?.accountAddress) {
      provider
        .getBalance(activeAccount.accountAddress)
        .then((balance) => setBalance(ethers.utils.formatEther(balance)));
    }
  }, [activeAccount, provider]);

  useEffect(() => {
    // get recipient data
    setRecipientError('');
    const getData = setTimeout(async () => {
      if (recipient.length > 3)
        if (recipient.endsWith('@uno')) {
          const graphql = JSON.stringify({
            query: HUMANACCOUNT_QUERY,
            variables: { where: { username: recipient.split('@')[0] } },
          });
          const requestOptions = {
            method: 'POST',
            body: graphql,
          };
          const res = await fetch(SUBGRAPH_URL, requestOptions)
            .then((response) => response.json())
            .catch((error) => console.log('error', error));

          if (res?.data?.humanAccounts?.length) {
            setRecipientSuggestions(res.data.humanAccounts);
            setRecipientAddress(res.data.humanAccounts[0].address);
          }
        } else {
          const ensAddress = await provider.resolveName(recipient);
          if (ensAddress) {
            // if recipient is ENS
            setRecipientSuggestions([
              {
                address: ensAddress,
                username: '',
              },
            ]);
            setRecipientAddress(ensAddress);
          } else if (isAddress(recipient)) {
            // if recipient is address
            setRecipientSuggestions([
              {
                address: recipient,
                username: '',
              },
            ]);
            setRecipientAddress(recipient);
          } else {
            const graphql = JSON.stringify({
              query: HUMANACCOUNT_QUERY,
              variables: { where: { username: recipient } },
            });
            const requestOptions = {
              method: 'POST',
              body: graphql,
            };
            const res = await fetch(SUBGRAPH_URL, requestOptions)
              .then((response) => response.json())
              .catch((error) => console.log('error', error));

            if (res?.data?.humanAccounts?.length) {
              setRecipientSuggestions(res.data.humanAccounts);
              setRecipientAddress(res.data.humanAccounts[0].address);
            } else {
              setRecipientSuggestions(null);
              setRecipientAddress('');
              setRecipientError('Invalid input');
            }
          }
        }
    }, 1000);

    return () => clearTimeout(getData);
  }, [recipient]);

  useEffect(() => {
    const _getGasEst = setTimeout(async () => {
      // get fee estimate
      if (activeAccount && amount && isAddress(recipientAddress)) {
        const unsignedUserOp = await activeAccount.createUnsignedUserOp({
          target: recipientAddress,
          value: ethers.utils.parseEther(amount),
          data: '0x',
        });
        bundler.estimateUserOpGas(unsignedUserOp).then((gas) => {
          console.log('gas', gas);
          setFeeEstimate(`${ethers.utils.formatUnits(gas)} ETH`);
        });
      }
    }, 1000);

    return () => clearTimeout(_getGasEst);
  }, [provider, bundler, activeAccount, amount, recipientAddress]);

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

        {/* Recipient Input */}
        <RecipientInput
          recipient={recipient}
          recipientSuggestions={recipientSuggestions}
          handleRecipientChange={handleRecipientChange}
          recipientError={recipientError}
        />

        {/* Amount Input */}
        <AmountInput
          token={token}
          amount={amount}
          handleAmountChange={handleAmountChange}
          balance={balance}
        />
      </Flex>

      <Spacer />

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
            Fees {feeEstimate}
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

export default Send;
