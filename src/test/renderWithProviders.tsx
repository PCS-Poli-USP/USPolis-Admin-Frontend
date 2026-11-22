import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { ComponentProps, ReactElement, ReactNode } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { MemoryRouter } from 'react-router-dom';
import { appContext } from '../context/AppContext';
import { chakraTheme, muiTheme } from '../utils/theme';

type AppContextValue = ComponentProps<typeof appContext.Provider>['value'];

const defaultAppContext: AppContextValue = {
  loading: false,
  setLoading: () => {},
  loggedUser: null,
  access: null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: async () => {},
  getSelfFromBackend: async () => {},
  persist: false,
  setPersist: () => {},
  isMobile: false,
  backendUnavailable: false,
  setBackendUnavailable: () => {},
};

interface RenderOptions {
  // Initial URL (path + query string) for the MemoryRouter
  route?: string;
  // Wrap the UI in a react-hook-form FormProvider (the form-control kit
  // calls useFormContext), with these default values
  formDefaultValues?: FieldValues;
  appContextValue?: Partial<AppContextValue>;
}

function FormWrapper({
  defaultValues,
  children,
}: {
  defaultValues: FieldValues;
  children: ReactNode;
}) {
  const form = useForm({ defaultValues });
  return <FormProvider {...form}>{children}</FormProvider>;
}

/**
 * Render with the same providers the app has in src/main.tsx (Chakra, MUI,
 * router, AppContext), see TEST.md section 5.
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', formDefaultValues, appContextValue }: RenderOptions = {},
) {
  const wrapped = formDefaultValues ? (
    <FormWrapper defaultValues={formDefaultValues}>{ui}</FormWrapper>
  ) : (
    ui
  );

  return render(
    <MemoryRouter initialEntries={[route]}>
      <ChakraProvider theme={chakraTheme}>
        <ThemeProvider theme={muiTheme}>
          <appContext.Provider
            value={{ ...defaultAppContext, ...appContextValue }}
          >
            {wrapped}
          </appContext.Provider>
        </ThemeProvider>
      </ChakraProvider>
    </MemoryRouter>,
  );
}
