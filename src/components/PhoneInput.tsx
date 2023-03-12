import { Menu, Transition } from '@headlessui/react';
import Flags from 'country-flag-icons/react/3x2';
import { CountryCode, getCountries, getCountryCallingCode, isPossiblePhoneNumber } from 'libphonenumber-js/min';
import { Fragment, useCallback, useState } from 'react';
import PhoneInput from 'react-phone-number-input/input';
import formatAsYouType from '../utils/formatAsYouType';

const countries = getCountries();

const FlagIcon = ({ code, className }: { code: string; className: string }) => {
  // @ts-ignore
  const TempFlag = Flags[code];
  return (
    <TempFlag
      style={{ borderRadius: '0.25rem' }}
      className={className}
    />
  );
};

const PhoneInputComponent = () => {
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [dialCode, setDialCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');

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
      <div
        className={`__input-phone w-full flex items-center ${phoneNumber ? (isInputValid ? 'valid' : 'error') : ''}`}>
        {/* country select */}
        <Menu
          as="div"
          className="relative">
          <Menu.Button className="flex items-center gap-1">
            {/* country flag */}
            <div className="h-5">
              <FlagIcon
                className="h-5"
                code={countryCode}
              />
            </div>

            {/* country dial code */}
            <span className="whitespace-nowrap text-2xl text-black/70 font-[500] ml-2">+ {dialCode}</span>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="max-h-[20rem] overflow-scroll w-[30ch] absolute left-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {countries.map((country) => (
                <Menu.Item key={country}>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-left gap-8"
                    onClick={() => handleCountrySelect(country)}>
                    <div className="h-6 w-8">
                      <FlagIcon
                        className="h-6 w-8 "
                        code={country}
                      />
                    </div>
                    <span className="flex justify-between w-full">
                      <span>{country}</span>
                      <span>+ {getCountryCallingCode(country as CountryCode)}</span>
                    </span>
                  </button>
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>

        {/* phone number input */}
        <PhoneInput
          className={`__number-input`}
          country={countryCode}
          value={phoneNumber}
          onChange={(v) => setPhoneNumber(v ?? '')}
          withCountryCallingCode={false}
          useNationalFormatForDefaultCountryValue={false}
          international={false}
        />
      </div>

      {/* keypad */}
      {/* <div className="grid grid-cols-3 justify-center items-center">
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">1</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">2</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">3</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">4</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">5</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">6</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">7</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">8</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">9</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">*</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">0</button>
        <button className="w-12 h-12 rounded-lg bg-primaryText/10 text-black/70 font-[500] text-lg">#</button>
      </div> */}
    </>
  );
};

export default PhoneInputComponent;
