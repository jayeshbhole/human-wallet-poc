import { ChevronLeftIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ ...props }) => {
  const navigate = useNavigate();

  return (
    <IconButton
      icon={<ChevronLeftIcon />}
      aria-label="back to the previous page"
      width="8"
      minW="8"
      height="8"
      minH="8"
      p="1"
      variant="outline"
      borderWidth="1.5px"
      color="blackAlpha.400"
      borderColor="blackAlpha.400"
      _hover={{
        color: 'blackAlpha.700',
        borderColor: 'blackAlpha.700',
      }}
      rounded="xl"
      onClick={() => navigate(-1)}
      {...props}
    />
  );
};

export default BackButton;
