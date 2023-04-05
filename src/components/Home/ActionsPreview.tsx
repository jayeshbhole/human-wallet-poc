import { Box, Flex, Text } from '@chakra-ui/react';
import { Actions } from './Main';

const ActionsPreview = ({ actions, number }: { actions: Actions; number?: number }) => {
  return (
    <Box>
      <Flex>
        <Text
          as="span"
          color="blackAlpha.700"
          fontWeight="600">
          Take Actions {number ? `(${number})` : ''}
        </Text>

        {/* {number > 2 && (
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
