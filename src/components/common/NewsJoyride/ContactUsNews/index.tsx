import Joyride, { CallBackProps, EVENTS, Events, STATUS } from 'react-joyride';
import useNewsJoyride from '../../../../hooks/useNewsJoyride/useNewsJoyride';
import { useFeatureGuideContext } from '../../../../context/FeatureGuideContext';
import { createContactUsSteps } from './contact-us.steps';

const CONTACT_US_STEP_INDEX = {
  INTRODUCTION: 0,
  VIEW_RADIO_BUTTON: 1,
};

interface ContactUsNewsrops {
  isMobile: boolean;
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}

function ContactUsNews({
  isMobile,
  onOpen,
  onClose,
  isOpen,
}: ContactUsNewsrops) {
  const { showNews, seeNews } = useNewsJoyride();
  const { state, setState } = useFeatureGuideContext();

  function handleGuideCloseClick() {
    if (isOpen) onClose();
    setState({ ...state, run: false, stepIndex: 0 });
    seeNews();
  }

  function handleGuidePreviousClick(type: Events, index: number) {
    if (type == EVENTS.STEP_AFTER) {
      if (index == CONTACT_US_STEP_INDEX.VIEW_RADIO_BUTTON) {
        onClose();
        setTimeout(() => {
          setState({ ...state, stepIndex: index - 1 });
        }, 50);
      }
    }
  }

  function handleGuideNextClick(type: Events, index: number) {
    if (type == EVENTS.STEP_BEFORE) {
    }

    if (type == EVENTS.STEP_AFTER) {
      if (index === CONTACT_US_STEP_INDEX.INTRODUCTION) {
        onOpen();
        setTimeout(() => {
          setState({ ...state, stepIndex: index + 1 });
        }, 50);
      }
      if (index == CONTACT_US_STEP_INDEX.VIEW_RADIO_BUTTON) {
        onClose();
        handleGuideCloseClick();
      }
    }
  }

  return (
    <Joyride
      {...state}
      steps={createContactUsSteps(isMobile)}
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
        const { action, index, status, type } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status) || action === 'close') {
          handleGuideCloseClick();
          return;
        }
        if (action === 'prev') {
          handleGuidePreviousClick(type, index);
          return;
        }
        if (action === 'next') {
          handleGuideNextClick(type, index);
          return;
        }
        return;
      }}
    />
  );
}

export default ContactUsNews;
