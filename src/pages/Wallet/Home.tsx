import { Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { jsNumberForAddress } from 'react-jazzicon';
import Header from '../../components/Home/Header';
import MainSection from '../../components/Home/Main';
import { useKeyringContext } from '../../contexts/KeyringContext';

const Home = () => {
  // active account from keyring context
  const { activeAccount } = useKeyringContext();

  const seed = useMemo(() => {
    return jsNumberForAddress(activeAccount?.accountAddress || '0x');
  }, [activeAccount]);

  // get balances from debank

  return (
    <Flex
      direction="column"
      w="100%"
      gap="8"
      py="4">
      {/* Header flex */}
      <Header
        seed={seed}
        activeAccount={activeAccount}
      />

      <MainSection />
    </Flex>
  );
};

export default Home;
