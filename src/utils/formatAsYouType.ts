import { AsYouType, CountryCode } from 'libphonenumber-js/max';

const formatAsYouType = (countryCode: CountryCode, number: string) => {
  const formattedNumber = new AsYouType(countryCode).input(number);

  return formattedNumber;
};

export default formatAsYouType;
