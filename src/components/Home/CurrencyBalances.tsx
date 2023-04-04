import { Box, Flex, Grid, Image, Text } from '@chakra-ui/react';

const CurrencyBalances = () => {
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
        <Text color="blackAlpha.500">Token balances coming soon</Text>
        {/* <CurrencyRow />
        <CurrencyRow />
        <CurrencyRow />
        <CurrencyRow /> */}
      </Flex>
    </Box>
  );
};

const CurrencyRow = () => {
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
          boxSize="2.75rem"
          rounded="xl"
          background="gray.400"
        />
        <Image
          boxSize="1rem"
          rounded="lg"
          background="gray.300"
          position="absolute"
          bottom="-1"
          right="-1"
        />
      </Box>

      <Text
        as="span"
        color="blackAlpha.700"
        fontWeight="600">
        Ethereum
      </Text>

      <Text
        justifySelf="flex-end"
        as="span"
        color="blackAlpha.700"
        fontWeight="600">
        $ {'0.0'}
      </Text>

      <Text
        as="span"
        color="blackAlpha.700"
        fontWeight="600">
        {'0.0'}
      </Text>

      <Text
        justifySelf="flex-end"
        as="span"
        color="blackAlpha.700"
        fontWeight="600">
        {'0.0'}
      </Text>
    </Grid>
  );
};

export default CurrencyBalances;
