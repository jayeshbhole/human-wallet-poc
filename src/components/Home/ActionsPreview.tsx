import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { formatEther } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { useKeyringContext } from '../../contexts/KeyringContext';

interface Action {
  title: string;
  description: string;
}

interface Actions {
  [key: string]: Action;
}

const ActionsPreview = () => {
  const [actions, setActions] = useState<Actions>({});
  const [goerliBalance, setGBalance] = useState<string>('0.00');
  const { activeAccount, provider } = useKeyringContext();

  useEffect(() => {
    // get balance of account
    if (activeAccount?.accountAddress) {
      provider.getBalance(activeAccount.accountAddress).then((balance) => {
        if (balance.isZero())
          setActions((a: Actions) => ({
            ...a,
            add_funds: { title: 'Add Funds', description: 'Add funds to your wallet' },
          }));
      });
    }
  }, [activeAccount, provider]);

  return (
    <Box>
      <Flex>
        <Text
          as="span"
          color="blackAlpha.700"
          fontWeight="600">
          Take Actions {actions.length ? `(${actions.length})` : ''}
        </Text>

        {/* {actions.length > 2 && (
          <Button
            variant="link"
            ml="auto"
            color="blue.500"
            fontWeight="600">
            See all
          </Button>
        )} */}
      </Flex>

      <Box
        w="100%"
        mt="4"
        overflowX="auto">
        <Flex
          gap="4"
          justifyItems="space-between"
          w="fit-content">
          {Object.values(actions)
            .slice(0, 3)
            .map((action, idx) => (
              <Flex
                key={idx}
                direction="column"
                gap="1"
                p="4"
                w="16ch"
                rounded="2xl"
                bg="blackAlpha.50">
                <Text
                  as="span"
                  color="blackAlpha.700"
                  fontWeight="600">
                  {action.title}
                </Text>
                <Text
                  as="span"
                  color="blackAlpha.600"
                  fontSize="sm"
                  fontWeight="400">
                  {action.description}
                </Text>
              </Flex>
            ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default ActionsPreview;
