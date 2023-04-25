import { createIcon } from '@chakra-ui/icons';

// using `path`
export const ScanQR = createIcon({
  displayName: 'ArrowDownTrayIcon',
  viewBox: '0 0 24 24',
  // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 12.5H20M7 3H5.5C4.11929 3 3 4.11929 3 5.5V7M7 22H5.5C4.11929 22 3 20.8807 3 19.5V18M17.5 3H19.5C20.8807 3 22 4.11929 22 5.5V7M17.5 22H19.5C20.8807 22 22 20.8807 22 19.5V17.5M10 6H7.5C6.67157 6 6 6.67157 6 7.5V10M10 19H7.5C6.67157 19 6 18.3284 6 17.5V15M15 19H17.5C18.3284 19 19 18.3284 19 17.5V15M15 6H17.5C18.3284 6 19 6.67157 19 7.5V10"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
});
