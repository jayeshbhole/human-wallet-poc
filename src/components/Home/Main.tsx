import { Box, ChakraComponent, Flex, Icon, Text } from '@chakra-ui/react';
import { ArrowDownTrayIcon } from '../../assets/Icon/ArrowDownTray';
import { ArrowUpTrayIcon } from '../../assets/Icon/ArrowUpTray';
import { CurrencyETH } from '../../assets/Icon/CurrencyETH';
import ActionsPreview from './ActionsPreview';
import QuickActionButton from './QuickActionButton';

const MainSection = () => {
  return (
    <Flex
      direction="column"
      w="100%"
      gap="8">
      <Section mt="-6">
        {/* total worth */}
        <Text
          as="span"
          fontSize="2.5rem"
          fontWeight="700">
          $ {'0.0'}
        </Text>

        <QuickActionButtons />
      </Section>

      {/* Divider */}
      <Box border="1px solid #04100F16" />

      {/* take actions section */}
      <Section>
        <ActionsPreview />
      </Section>

      <Box border="1px solid #04100F16" />

      {/* balances section */}
    </Flex>
  );
};

const Section: ChakraComponent<'section', {}> = ({ children, ...props }) => {
  return (
    <Flex
      as="section"
      direction="column"
      gap="8"
      px={8}
      {...props}>
      {children}
    </Flex>
  );
};

/* quick access buttons */
const QuickActionButtons = () => {
  return (
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
  );
};

export default MainSection;
