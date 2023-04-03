import { Button, Grid, Icon } from '@chakra-ui/react';
import { BackspaceIcon } from '@heroicons/react/24/outline';

const KeypadButton = ({
  value,
  onKeypadClick,
  disabled,
}: {
  value: string;
  onKeypadClick: (value: string) => void;
  disabled?: boolean;
}) => {
  return (
    <Button
      variant="ghost"
      isDisabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        onKeypadClick(value);
      }}
      fontSize="xl"
      rounded="1.25rem"
      w="5ch"
      h="5ch"
      color="blackAlpha.600"
      fontWeight={600}
      bg="blackAlpha.50"
      _hover={{
        color: 'blackAlpha.900',
        bg: 'blackAlpha.100',
      }}
      _disabled={{
        opacity: 0.5,
        cursor: 'not-allowed',
      }}
      justifySelf="center">
      {value === 'backspace' ? (
        <Icon
          as={BackspaceIcon}
          h={6}
          w={6}
        />
      ) : (
        value
      )}
    </Button>
  );
};

const Keypad = ({ onKeypadClick, disabled }: { onKeypadClick: (value: string) => void; disabled?: boolean }) => {
  return (
    <Grid
      className="__keypad"
      templateColumns="repeat(3, 1fr)"
      gap={4}
      alignItems="center"
      mt="auto">
      {Array.from({ length: 9 }).map((_, idx) => {
        return (
          <KeypadButton
            key={idx + 1}
            value={(idx + 1).toString()}
            onKeypadClick={onKeypadClick}
            disabled={disabled}
          />
        );
      })}
      <div></div>
      <KeypadButton
        value="0"
        onKeypadClick={onKeypadClick}
        disabled={disabled}
      />
      <KeypadButton
        value="backspace"
        onKeypadClick={onKeypadClick}
        disabled={disabled}
      />
    </Grid>
  );
};

export default Keypad;
