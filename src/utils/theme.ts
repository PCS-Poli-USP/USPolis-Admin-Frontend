import { extendTheme, type ThemeConfig, ThemeOverride } from '@chakra-ui/react';
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
      gray: '#717075',
      lightGray: '#a5a4a8',
      white: '#FFFFFF',
      black: '#262626',
      text: '#408080',
      yellow: '#dcb709',
    },
  },
  semanticTokens: {
    colors: {
      'blue.500': { default: '#408080', _dark: '#1a535c' },
      'blue.600': { default: '#336666', _dark: '#264d4d' },
      'blue.700': { default: '#264d4d', _dark: '#193333' },
      'uspolis.blue': { default: '#408080', _dark: '#1a535c' },
      'uspolis.red': { default: '#E53E3E', _dark: '#E53E3E' },
      'uspolis.gray': { default: '#717075', _dark: '#58575b' },
      'uspolis.lightGray': { default: '#a5a4a8', _dark: '#d8d8da' },
      'uspolis.white': { default: '#FFFFFF', _dark: '#262626' },
      'uspolis.black': { default: '#262626', _dark: '#FFFFFF' },
      'uspolis.text': { default: '#408080', _dark: '#FFFFFF' },
      'uspolis.yellow': { default: '#dcb709', _dark: '#f6d123' },
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
    NumberInput: {
      defaultProps: {
        focusBorderColor: 'uspolis.blue',
        backgroundColor: 'uspolis.white',
        borderColor: 'uspolis.black',
      },
    },
    Select: {
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
        bg: 'uspolis.white',
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
  palette: {
    mode: 'dark',
    background: {
      default: '#262626', // cor do fundo da página
      paper: '#262626', // cor dos cards, containers etc.
    },
  },
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: 'elevation' },
          style: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === 'dark' ? '#262626' : '#408080',
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
