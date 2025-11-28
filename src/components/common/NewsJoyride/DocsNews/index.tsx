import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import useNewsJoyride from '../../../../hooks/useNewsJoyride/useNewsJoyride';
import { useFeatureGuideContext } from '../../../../context/FeatureGuideContext';
import { createDocsSteps } from './docs.steps';

interface ContactUsNewsrops {
  isMobile: boolean;
}

function DocsNews({ isMobile }: ContactUsNewsrops) {
  const { showNews, seeNews } = useNewsJoyride();
  const { state, setState } = useFeatureGuideContext();

  function handleGuideCloseClick() {
    setState({ ...state, run: false, stepIndex: 0 });
    seeNews();
  }

  return (
    <Joyride
      {...state}
      steps={createDocsSteps(isMobile)}
      run={showNews}
      continuous={true}
      showSkipButton={true}
      hideBackButton={false}
      disableScrolling={true}
      showProgress={true}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Último',
        next: 'Próximo',
        nextLabelWithProgress: 'Próximo (Passo {step} / {steps})',
        open: 'Abrir diálogo',
        skip: 'Pular',
      }}
      styles={{
        options: {
          arrowColor: 'uspolis.blue',
          primaryColor: 'uspolis.blue',
          textColor: 'uspolis.text',
          backgroundColor: 'uspolis.blue',
          beaconSize: 36,
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
          width: undefined,
          zIndex: 1000000,
        },
      }}
      callback={(data: CallBackProps) => {
        const { action, status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        if (
          finishedStatuses.includes(status) ||
          action === 'close' ||
          action === 'next'
        ) {
          handleGuideCloseClick();
          return;
        }

        return;
      }}
    />
  );
}

export default DocsNews;
