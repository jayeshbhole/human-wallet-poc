import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Flex, Grid, Heading, IconButton, Text, useClipboard } from '@chakra-ui/react';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import BackButton from '../../components/BackButton';
import { useKeyringContext } from '../../contexts/KeyringContext';

const Receive = () => {
  const { activeAccount } = useKeyringContext();
  const { onCopy: onAddressCopy, hasCopied: hasAddressCopied } = useClipboard(activeAccount?.accountAddress ?? '');
  const { onCopy: onUsernameCopy, hasCopied: hasUsernameCopied } = useClipboard(`${activeAccount?.username}@one` ?? '');

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
            Receive crypto
          </Heading>
        </Grid>

        <Flex
          direction="column"
          w="full">
          <Text
            as="span"
            ml="4">
            Username
          </Text>
          <Flex
            justifyContent="space-between"
            align="center"
            p="4"
            rounded="2xl"
            bg="blackAlpha.50">
            <Text
              fontSize="lg"
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

            <IconButton
              onClick={onUsernameCopy}
              variant="outline"
              rounded="full"
              aria-label="Copy username"
              w="10"
              h="10"
              icon={!hasUsernameCopied ? <CopyIcon strokeWidth="1.5" /> : <CheckIcon />}
              color="blackAlpha.600"
              borderColor="blackAlpha.600"
            />
          </Flex>
        </Flex>

        <Flex
          direction="column"
          w="full">
          <Text
            as="span"
            ml="4">
            Address
          </Text>
          <Flex
            justifyContent="space-between"
            align="center"
            p="4"
            rounded="2xl"
            bg="blackAlpha.50">
            <Text
              as="span"
              fontSize="lg"
              maxW="25ch"
              w="25ch"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
              color="blackAlpha.700"
              fontWeight="600">
              {activeAccount?.accountAddress ?? '0x'}
            </Text>

            <IconButton
              onClick={onAddressCopy}
              variant="outline"
              rounded="full"
              aria-label="Copy address"
              w="10"
              h="10"
              icon={!hasAddressCopied ? <CopyIcon strokeWidth="1.5" /> : <CheckIcon />}
              color="blackAlpha.600"
              borderColor="blackAlpha.600"
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Receive;
