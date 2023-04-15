import { Box, Flex, Icon, Text } from '@chakra-ui/react';
// import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownTrayIcon } from '../../assets/Icon/ArrowDownTray';
import { ArrowUpTrayIcon } from '../../assets/Icon/ArrowUpTray';
import { ShieldCheckIcon } from '../../assets/Icon/ShieldCheck';
import { useKeyringContext } from '../../contexts/KeyringContext';
import ActionsPreview from './ActionsPreview';
import CurrencyBalances from './CurrencyBalances';
import QuickActionButton from './QuickActionButton';
interface Action {
  title: string;
  description: string;
}

export interface Actions {
  [key: string]: Action;
}
const MainSection = () => {
  const [actions, setActions] = useState<Actions>({});
  // const [goerliBalance, setGBalance] = useState<string>('0.00');
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
    <Flex
      direction="column"
      w="100%"
      gap="8"
      mt="24">
      <Section>
        {/* total worth */}
        <Text
          as="span"
          fontSize="2.5rem"
          fontWeight="700">
          $ {'0.0'}
        </Text>

        <QuickActionButtons />
      </Section>

      {Object.keys(actions).length > 0 && (
        <>
          {/* Divider */}
          <Box border="1px solid #04100F16" />

          {/* take actions section */}
          <Section>
            <ActionsPreview
              actions={actions}
              number={Object.keys(actions).length}
            />
          </Section>

          <Box border="1px solid #04100F16" />
        </>
      )}

      {/* balances section */}
      <Section>
        <CurrencyBalances />
      </Section>
    </Flex>
  );
};

const Section: FC<HTMLAttributes<{}>> = ({ children, ...props }) => {
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
  const navigate = useNavigate();

  const handleSend = () => navigate('/wallet/send');
  const handleReceive = () => navigate('/wallet/receive');

  return (
    <Flex gap="4">
      <QuickActionButton
        onClick={handleSend}
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
        onClick={handleReceive}
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
            as={LockClosedIcon}
          />
        }
        label="Lock"
      />
      <QuickActionButton
        icon={
          <Icon
            w="7"
            h="7"
            as={ShieldCheckIcon}
          />
        }
        label="Security"
      />
      {/* <QuickActionButton
        icon={
          <Icon
            w="7"
            h="7"
            as={CurrencyETH}
          />
        }
        label="Fees"
      /> */}
    </Flex>
  );
};

export default MainSection;
