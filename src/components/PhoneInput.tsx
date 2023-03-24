import { Box, Flex, Icon, Input, Menu, MenuButton, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react';
import Flags from 'country-flag-icons/react/3x2';
import { CountryCode, getCountries, getCountryCallingCode, isPossiblePhoneNumber } from 'libphonenumber-js/min';
import { Dispatch, memo, SetStateAction, useCallback, useRef, useState } from 'react';
import PhoneInput from 'react-phone-number-input/input';
import formatAsYouType from '../utils/formatAsYouType';
import Keypad from './Keypad';

const countries = getCountries();

const CountryMenuItem = ({
  country,
  handleCountrySelect,
}: {
  country: CountryCode;
  handleCountrySelect: (country: CountryCode) => void;
}) => {
  return (
    <MenuItem
      key={country}
      display="flex"
      alignItems="center"
      gap={2}
      onClick={() => handleCountrySelect(country)}
      fontSize="lg"
      fontWeight={500}
      color="blackAlpha.700">
      <Icon
        as={Flags[country]}
        h={6}
        w={8}
        rounded="0.25rem"
      />

      <span>{country}</span>
      <Spacer />
      <span>+ {getCountryCallingCode(country as CountryCode)}</span>
    </MenuItem>
  );
};

const CountryMenu = ({ handleCountrySelect }: { handleCountrySelect: (country: CountryCode) => void }) => {
  return (
    <MenuList
      maxH="20rem"
      overflow="scroll"
      w="35ch"
      left={0}
      mt={2}>
      {countries.map((country) => (
        <CountryMenuItem
          key={country}
          country={country}
          handleCountrySelect={handleCountrySelect}
        />
      ))}
      {/* </Menu.Items> */}
    </MenuList>
  );
};

const PhoneInputComponent = ({
  phoneNumber,
  setPhoneNumber,
}: {
  phoneNumber: string;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
}) => {
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [dialCode, setDialCode] = useState('1');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCountrySelect = useCallback(
    (country: CountryCode) => {
      setCountryCode(country);
      setDialCode(getCountryCallingCode(country));
      setPhoneNumber((num) => formatAsYouType(countryCode, num));
    },
    [countryCode, setCountryCode, setDialCode, setPhoneNumber]
  );

  const isInputValid = isPossiblePhoneNumber(phoneNumber, countryCode);

  return (
    <>
      <Flex
        w="full"
        alignItems="center"
        outline="none"
        bg="transparent"
        borderBottom="2px"
        borderColor={phoneNumber ? (isInputValid ? 'green.300' : 'red.500') : 'blackAlpha.400'}
        py={1}
        mb="auto"
        _focusWithin={{
          borderColor: phoneNumber ? (isInputValid ? 'green.300' : 'orange.500') : 'blackAlpha.800',
        }}
        transition="all 0.2s ease-in-out">
        {/* country select */}
        <Menu isLazy>
          <MenuButton>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              p="1"
              rounded="md"
              _hover={{
                background: 'blackAlpha.100',
              }}
              _active={{
                background: 'blackAlpha.100',
              }}>
              {/* country flag */}
              <Icon
                w="9"
                h="6"
                rounded="0.25rem"
                as={Flags[countryCode]}
              />

              {/* country dial code */}
              <Text
                as="span"
                whiteSpace="nowrap"
                fontSize="2xl"
                color="blackAlpha.800"
                fontWeight={500}>
                + {dialCode}
              </Text>
            </Box>
          </MenuButton>

          <CountryMenu handleCountrySelect={handleCountrySelect} />
        </Menu>

        {/* phone number input */}
        <Input
          as={PhoneInput}
          // chakra input props
          w="full"
          pl={6}
          letterSpacing="0.125em"
          ml="auto"
          color="blackAlpha.800"
          fontWeight={500}
          fontSize="2xl"
          _placeholder={{
            fontWeight: 500,
          }}
          variant="unstyled"
          // phone input props
          country={countryCode}
          value={phoneNumber}
          withCountryCallingCode={false}
          useNationalFormatForDefaultCountryValue={false}
          international={false}
          // @ts-ignore
          onChange={(v) => setPhoneNumber(v ?? '')}
          ref={inputRef}
        />
      </Flex>

      {/* keypad */}
      <Keypad
        onKeypadClick={() => {}}
        disabled
      />
    </>
  );
};

export default PhoneInputComponent;
