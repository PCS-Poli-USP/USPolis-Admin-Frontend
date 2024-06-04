import { extendTheme } from '@chakra-ui/react';
import { createTheme } from '@mui/material';

const chakraTheme = extendTheme({
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

const muiTheme = createTheme({})

export { chakraTheme, muiTheme };
