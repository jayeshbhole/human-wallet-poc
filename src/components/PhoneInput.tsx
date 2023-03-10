import { Menu, Transition } from '@headlessui/react';
import { Fragment, ReactNode, useCallback, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js/max';
import Flags from 'country-flag-icons/react/3x2';

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

const PhoneInput = () => {
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [typedDialCode, setTypedDialCode] = useState('1');

  const handleCountryCodeBlur = useCallback(() => {
    if (typedDialCode === getCountryCallingCode(countryCode)) return;
    const countryDialCode = typedDialCode;

    const country = countries.find((country) => {
      const countryCallingCode = getCountryCallingCode(country);
      return countryCallingCode === countryDialCode;
    });
    if (country) {
      setCountryCode(country);
      setTypedDialCode(getCountryCallingCode(country as CountryCode));
    } else {
      setTypedDialCode('1');
      setCountryCode('US');
    }
  }, [countries, setCountryCode, setTypedDialCode, typedDialCode]);

  const handleCountrySelect = (country: CountryCode) => {
    setCountryCode(country);
    setTypedDialCode(getCountryCallingCode(country));
  };

  return (
    <div className="w-full flex items-center">
      {/* country select */}
      <Menu
        as="div"
        className="relative">
        <Menu.Button className="flex items-center gap-1">
          <ChevronDownIcon
            className="h-5 w-5"
            aria-hidden="true"
          />
          {/* country flag */}
          <div className="h-6 w-8">
            <FlagIcon
              className="h-6 w-8 "
              code={countryCode}
            />
          </div>
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

      {/* inputs */}
      <div className="flex w-full">
        {/* Country code. editable element */}
        <input
          className="w-[5ch]"
          name="countryDialCode"
          type="number"
          onChange={(e) => {
            setTypedDialCode(e.target.value);
          }}
          onBlur={handleCountryCodeBlur}
          value={typedDialCode}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
