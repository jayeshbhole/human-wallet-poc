import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { ArrowDownTrayIcon } from '../../assets/Icon/ArrowDownTray';
import { ArrowUpTrayIcon } from '../../assets/Icon/ArrowUpTray';
import { CurrencyETH } from '../../assets/Icon/CurrencyETH';
import QuickActionButton from './QuickActionButton';

const MainSection = () => {
  return (
    <Flex
      direction="column"
      w="100%"
      gap="8">
      <Flex
        as="section"
        direction="column"
        gap="8"
        px={8}>
        {/* total worth */}
        <Text
          as="span"
          fontSize="2.5rem"
          fontWeight="700">
          $ {'0.0'}
        </Text>

        {/* quick access buttons */}
        <Flex gap="4">
          <QuickActionButton
            icon={
              <Icon
                w="7"
                h="7"
                as={ArrowUpTrayIcon}
              />
            }
            label="Send"
          />
          <QuickActionButton
            icon={
              <Icon
                w="7"
                h="7"
                as={ArrowDownTrayIcon}
              />
            }
            label="Receive"
          />
          <QuickActionButton
            icon={
              <Icon
                w="7"
                h="7"
                as={CurrencyETH}
              />
            }
            label="Fees"
          />
        </Flex>
      </Flex>

      <Box border="1px solid #04100F16" />
      {/* take actions section */}

      {/* balances section */}
    </Flex>
  );
};

export default MainSection;
