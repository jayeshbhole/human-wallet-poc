import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const ActionsPreview = () => {
  const actions = [
    {
      title: 'Add Funds',
      description: 'Add funds to your wallet',
    },
    {
      title: 'Connect Google',
      description: 'Add your Google account',
    },
    {
      title: 'Connect Google',
      description: 'Add your Google account',
    },
  ];
  return (
    <Box>
      <Flex>
        <Text
          as="span"
          color="blackAlpha.700"
          fontWeight="600">
          Take Actions {actions.length ? `(${actions.length})` : ''}
        </Text>
        {/* <Text
          as="span"
          ml="auto"
          color="blue.500"
          fontWeight="600">
          See all
        </Text> */}
        {actions.length > 2 && (
          <Button
            variant="link"
            ml="auto"
            color="blue.500"
            fontWeight="600">
            See all
          </Button>
        )}
      </Flex>

      <Box
        w="100%"
        mt="4"
        overflowX="auto">
        <Flex
          gap="4"
          justifyItems="space-between"
          w="fit-content">
          {actions.slice(0, 3).map((action, idx) => (
            <Flex
              key={idx}
              direction="column"
              gap="1"
              p="4"
              w="18ch"
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
