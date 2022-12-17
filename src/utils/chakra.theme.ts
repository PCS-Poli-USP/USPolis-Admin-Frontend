import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    uspolis: {
      blue: '#408080',
      grey: '#CCCCCC',
    },
    blue: {
      500: '#408080', // colorScheme
      600: '#CCCCCC', // onHover
      700: '#CCCCCC', // onClick
    },
  },
  styles: {
    global: {
      body: {
        color: 'uspolis.blue',
        fontFamily: 'Ubuntu, sans-serif',
      },
    },
  },
});

export default theme;
