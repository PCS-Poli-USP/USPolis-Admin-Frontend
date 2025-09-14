import {
  background,
  extendTheme,
  type ThemeConfig,
  ThemeOverride,
} from '@chakra-ui/react';
import { createTheme, Shadows } from '@mui/material/styles';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const override: ThemeOverride = {
  config,
  colors: {
    uspolis: {
      blue: '#408080',
      darkBlue: '#1a535c',
      lightBlue: '#B4F4F4',
      red: '#E53E3E',
      grey: '#CCCCCC',
      white: '#FFFFFF',
      black: '#1A202C',
      text: '#408080',
    },
  },
  semanticTokens: {
    colors: {
      'blue.500': { default: '#408080', _dark: '#1a535c' },
      'blue.600': { default: '#336666', _dark: '#264d4d' },
      'blue.700': { default: '#264d4d', _dark: '#193333' },
      'uspolis.blue': { default: '#408080', _dark: '#1a535c' },
      'uspolis.red': { default: '#E53E3E', _dark: '#E53E3E' },
      'uspolis.grey': { default: '#CCCCCC', _dark: '#CCCCCC' },
      'uspolis.white': { default: '#FFFFFF', _dark: '#1A202C' },
      'uspolis.black': { default: '#1A202C', _dark: '#FFFFFF' },
      'uspolis.text': { default: '#408080', _dark: '#FFFFFF' },
    },
  },
  components: {
    Button: {
      variants: {
        solid: () => ({
          bg: 'blue.500',
          color: 'white',
          _hover: {
            bg: 'blue.600',
          },
          _active: {
            bg: 'blue.600',
          },
        }),
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'uspolis.blue',
        backgroundColor: 'uspolis.white',
        borderColor: 'uspolis.black',
      },
    },
    Checkbox: {
      baseStyle: (props) => ({
        control: {
          _checked: {
            bg: 'uspolis.blue',
            borderColor: 'uspolis.blue',
            color: 'white',
            _hover: {
              bg: 'blue.700',
              borderColor: 'blue.700',
            },
            _active: {
              bg: 'blue.700',
              borderColor: 'blue.700',
            },
          },
          _hover: {
            borderColor: props.colorMode === 'dark' ? 'gray.400' : 'gray.300',
          },
          _active: {
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.400',
          },
        },
      }),
    },
    Modal: {
      baseStyle: () => ({
        dialog: {
          bg: 'uspolis.white',
        },
      }),
    },
    Popover: {
      baseStyle: () => ({
        content: {
          bg: 'uspolis.white',
        },
      }),
    },
  },
  styles: {
    global: (props) => ({
      html: {
        overflow: 'auto',
        height: '100%',
      },
      body: {
        margin: 0,
        padding: 0,
        height: '100%',
        fontFamily: 'Ubuntu, sans-serif',
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? '#FFFFFF' : 'uspolis.blue',
      },
    }),
  },
};

const chakraTheme = extendTheme(override);

const muiTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: 'elevation' },
          style: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === 'dark' ? '#1a535c' : '#408080',
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
