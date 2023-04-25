import { createIcon } from '@chakra-ui/icons';

// using `path`
export const CurrencyETH = createIcon({
  displayName: 'CurrencyETH',
  viewBox: '0 0 26 26',
  // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 1.625V24.375"
        stroke="#4B515F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.9375 13L13 17.0625L4.0625 13"
        stroke="#4B515F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 1.625L21.9375 13L13 24.375L4.0625 13L13 1.625Z"
        stroke="#4B515F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
});
