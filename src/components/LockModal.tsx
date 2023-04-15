import {
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  feeEstimate,
  opStatus,
  from,
  to,
  txHash,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  feeEstimate: string;
  opStatus: 'unconfirmed' | 'pending' | 'error' | 'completed';
  from: {
    address: string;
    username: string;
  };
  to: {
    address: string;
    username: string;
  };
  txHash: string;
}) => {
  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        maxW="400px"
        rounded="2xl">
        <ModalHeader textAlign="center">Lock your Account?</ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody
          display="flex"
          w="full"
          flexDirection="column"
          gap="4">
          {/* To */}
          <Flex
            px="4"
            w="full"
            fontWeight="600"
            justifyContent="space-between"
            wrap="wrap">
            <Text>Send To</Text>

            <Text
              textAlign="right"
              as="span"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
              w="15ch"
              color="blackAlpha.700"
              fontWeight="600">
              {to.username || 'username'}
            </Text>
          </Flex>

          {/* From Account */}
          <Flex
            px="4"
            w="full"
            fontWeight="600"
            justifyContent="space-between"
            wrap="wrap">
            <Text>Send From</Text>

            <Text
              textAlign="right"
              as="span"
              w="15ch"
              color="blackAlpha.700"
              fontWeight="600">
              {from.username || 'username'}
              {
                <Text
                  as="span"
                  textColor="gray.400">
                  @one
                </Text>
              }
            </Text>

            <Text
              textAlign="right"
              ml="auto"
              as="span"
              color="blackAlpha.700"
              fontWeight="600"
              w="15ch"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden">
              {from.address || '0x'}
            </Text>
          </Flex>

          {/* Fees */}
          <Flex
            px="4"
            w="full"
            fontWeight="600"
            justifyContent="space-between"
            wrap="wrap">
            <Text>Transaction Fees</Text>

            <Text
              textAlign="right"
              as="span"
              w="15ch"
              color="blackAlpha.700"
              fontWeight="600">
              {feeEstimate || '0'}
            </Text>
          </Flex>

          <Flex
            display={opStatus === 'unconfirmed' ? 'none' : 'block'}
            px="4"
            w="full"
            fontWeight="600"
            justifyContent="space-between"
            wrap="wrap">
            <Text>Status</Text>

            <Text
              textAlign="right"
              color={
                opStatus === 'completed'
                  ? 'green.500'
                  : opStatus === 'pending'
                  ? 'yellow.500'
                  : opStatus === 'error'
                  ? 'red.500'
                  : 'gray.500'
              }
              as="span"
              w="15ch"
              //   color="blackAlpha.700"
              fontWeight="600">
              {opStatus === 'completed'
                ? 'Completed'
                : opStatus === 'pending'
                ? 'Pending'
                : opStatus === 'error'
                ? 'Failed'
                : 'Unconfirmed'}
            </Text>
          </Flex>

          <Flex
            display={txHash ? 'block' : 'none'}
            px="4"
            w="full"
            fontWeight="600"
            justifyContent="space-between"
            wrap="wrap">
            <Text>Transaction Link</Text>

            <Text
              textAlign="right"
              as="span"
              w="15ch"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
              color="blackAlpha.700"
              fontWeight="600">
              <Link
                isExternal
                href={`https://goerli.etherscan.io/tx/${txHash}`}>
                {txHash}
              </Link>
            </Text>
          </Flex>
        </ModalBody>

        <ModalFooter mt="8">
          <Button
            onClick={onClose}
            variant="outline"
            rounded="xl"
            mr={3}
            colorScheme="red">
            Close
          </Button>

          <Button
            isLoading={opStatus === 'pending'}
            isDisabled={opStatus !== 'unconfirmed'}
            color="#FFFBFE"
            bg="#04100F"
            rounded="xl"
            onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
