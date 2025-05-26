import { extendTheme } from '@chakra-ui/react';
import { createTheme, Shadows } from '@mui/material';

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
      html: {
        overflow: 'auto',
        height: '100%',
      },
      body: {
        margin: 0,
        padding: 0,
        height: '100%',
        color: 'uspolis.blue',
        fontFamily: 'Ubuntu, sans-serif',
      },
    },
  },
});

const muiTheme = createTheme({
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: 'elevation' },
          style: ({ theme }) => ({
            backgroundColor: '#408080',
            boxShadow: theme.shadows[4],
          }),
        },
      ],
    },
  },
  shadows: [
    'none',
    '0px 15px 60px rgba(0, 0, 0, 0.25)',
    '0px 35px 60px rgba(0, 0, 0, 0.25)',
    '20px 55px 60px rgba(0, 0, 0, 0.25)',
    '10px 15px 60px rgba(0, 0, 0, 0.25)',
    ...Array(20).fill('none'),
  ] as Shadows,
});

export { chakraTheme, muiTheme };
