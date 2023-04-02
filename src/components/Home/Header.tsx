import { Flex, Icon, IconButton, Spacer, Text } from '@chakra-ui/react';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';
import { BellRinging } from '../../assets/Icon/BellRinging';
import HumanAccountClientAPI from '../../utils/account-api';

const Header = ({ seed, activeAccount }: { seed: number; activeAccount: HumanAccountClientAPI | undefined }) => {
  return (
    <Flex
      justifyItems="space-between"
      alignItems="center"
      gap="3"
      px={6}>
      {/* react jazzicon */}
      <Icon
        as={() => (
          <Jazzicon
            diameter={48}
            seed={seed}
          />
        )}
      />

      {/* Account name */}
      <Flex
        py="2"
        direction="column"
        justifyItems="space-evenly">
        <Text
          as="span"
          fontSize="sm"
          fontWeight="500"
          color="gray.500">
          Account
        </Text>
        <Text
          as="span"
          fontSize="lg"
          fontWeight="500">
          {activeAccount?.username ?? 'alicepays'}
          <Text
            as="span"
            fontSize="lg"
            fontWeight="500"
            textColor="gray.400">
            .one
          </Text>
        </Text>
      </Flex>

      <Spacer />
      {/* Notification bell */}
      <IconButton
        aria-label="notification bell"
        icon={
          <BellRinging
            w="8"
            h="8"
          />
        }
        rounded="full"
        bg="transparent"
        _hover={{
          bg: 'gray.100',
        }}
        w="12"
        h="12"
      />
    </Flex>
  );
};

export default Header;
