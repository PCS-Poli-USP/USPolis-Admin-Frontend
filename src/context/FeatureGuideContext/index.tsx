import { createContext, useContext, useMemo, useState } from 'react';
import { FeatureTourGuideStep } from './steps';
import { createSteps } from './utils';

export interface FeatureGuideState {
  run: boolean;
  stepIndex: number;
  steps: FeatureTourGuideStep[];
}

const DEFAULT_STATE: FeatureGuideState = {
  run: false,
  stepIndex: 0,
  steps: createSteps(),
};

interface FeatureGuideContextType {
  state: FeatureGuideState;
  setState: (value: FeatureGuideState) => void;
  registerControlFn: (fn: (value: any) => void) => void;
  triggerControl: (value: any) => void;
  pathBeforeGuide: string;
  setPathBeforeGuide: (path: string) => void;
}

export const FeatureGuideContext = createContext<FeatureGuideContextType>({
  state: DEFAULT_STATE,
  setState: () => {},
  registerControlFn: () => {},
  triggerControl: () => {},
  pathBeforeGuide: '/allocation',
  setPathBeforeGuide: () => {},
});

export default function FeatureGuideProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [state, setState] = useState<FeatureGuideState>(DEFAULT_STATE);
  const [controlFn, setControlFn] = useState<null | ((value: any) => void)>(
    null,
  );
  const [pathBeforeGuide, setPathBeforeGuide] = useState<string>('/allocation');

  const registerControlFn = (fn: (value: any) => void) => {
    setControlFn(() => fn);
  };

  const triggerControl = (value: any) => {
    if (controlFn) {
      controlFn(value);
    }
  };

  const value = useMemo(
    () => ({
      state,
      setState,
      registerControlFn,
      triggerControl,
      pathBeforeGuide,
      setPathBeforeGuide,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );

  return (
    <FeatureGuideContext.Provider value={value}>
      {children}
    </FeatureGuideContext.Provider>
  );
}

export function useFeatureGuideContext() {
  const context = useContext(FeatureGuideContext);
  if (!context) {
    throw new Error(
      'useFeatureGuideContext must be used within a FeatureGuideContextProvider',
    );
  }
  return context;
}
