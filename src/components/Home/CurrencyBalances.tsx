import { Box, Flex, Grid, Image, Text } from '@chakra-ui/react';
import { formatEther } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { useKeyringContext } from '../../contexts/KeyringContext';
import { NETWORK_IMAGES, SUPPORTED_NETWORKS } from '../../utils/constants';

const CurrencyBalances = () => {
  const [goerliBalance, setGBalance] = useState<string>('0.00');
  const { activeAccount, provider } = useKeyringContext();

  useEffect(() => {
    // get balance of account
    if (activeAccount?.accountAddress) {
      provider.getBalance(activeAccount.accountAddress).then((balance) => setGBalance(formatEther(balance)));
    }
  }, [activeAccount, provider]);

  return (
    <Box>
      <Text
        as="span"
        color="blackAlpha.700"
        fontWeight="600">
        Balances
      </Text>

      <Flex
        mt="4"
        direction="column"
        gap="2">
        <CurrencyRow
          name="Goerli - ETH"
          symbol="ETH"
          network={SUPPORTED_NETWORKS.GOERLI}
          balance={goerliBalance}
          price={''}
          icon="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
        />

        <Text
          textAlign="center"
          color="blackAlpha.500">
          Token balances coming soon
        </Text>
      </Flex>
    </Box>
  );
};

const CurrencyRow = ({
  name,
  symbol,
  balance,
  price,
  network,
  icon,
}: {
  name: string;
  symbol: string;
  balance: string;
  price: string;
  network: SUPPORTED_NETWORKS;
  icon: string;
}) => {
  return (
    <Grid
      p="2"
      px="4"
      bg="gray.50"
      rounded="2xl"
      w="100%"
      templateColumns="3rem 2fr 1fr"
      alignItems="flex-end"
      gap="3"
      rowGap="1">
      <Box
        position="relative"
        gridRowStart="1"
        gridRowEnd="3"
        alignSelf="center"
        justifySelf="center">
        <Image
          src={icon}
          boxSize="2.75rem"
          rounded="xl"
          background="transparent"
        />
        <Image
          src={NETWORK_IMAGES[network]}
          boxSize="1rem"
          rounded="lg"
          background="transparent"
          position="absolute"
          bottom="-1"
          right="-1"
        />
      </Box>

      <Text
        as="span"
        gridRowStart="1"
        gridRowEnd="3"
        alignSelf="center"
        color="blackAlpha.700"
        fontWeight="600">
        {name}
      </Text>

      <Text
        justifySelf="flex-end"
        as="span"
        color="blackAlpha.700"
        fontWeight="600">
        $ {'0'}
      </Text>

      <Text
        as="span"
        justifySelf="flex-end"
        color="blackAlpha.700"
        fontWeight="600">
        {balance} {symbol}
      </Text>

      {/* <Text
        justifySelf="flex-end"
        as="span"
        color="blackAlpha.700"
        fontWeight="600">
      </Text> */}
    </Grid>
  );
};

export default CurrencyBalances;
