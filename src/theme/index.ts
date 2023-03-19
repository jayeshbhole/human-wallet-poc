import { StyleFunctionProps, extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  bg: {
    primary: '#FFFFFF',
  },

  text: {
    primary: '#0A0A0A',
  },
};

export const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      background: '#424242',
      fontFamily: 'Public Sans',
      fontSize: '16px',
      fontWeight: '400',
      colorScheme: 'light',
      color: 'text.primary',
      fontSynthesis: 'none',
      textRendering: 'optimizeLegibility',
      webkitFontSmoothing: 'antialiased',
      mozOsxFontSmoothing: 'grayscale',
      webkitTextSizeAdjust: '100%',
      boxSizing: 'border-box',
    },

    '#root': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      padding: '3rem 1rem',
    },
    '.app': {
      maxWidth: '430px',
      maxHeight: '850px',
      width: '100%',
      height: '100%',
      borderRadius: '1rem',
      padding: '1rem',
      backgroundColor: colors.bg.primary,
    },
  }),
};

export const theme = extendTheme({
  config,
  colors,
  styles,
});
