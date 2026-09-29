import { ScreenOrientation } from '@capacitor/screen-orientation';

export async function unlockOrientation() {
  try {
    await ScreenOrientation.unlock();
  } catch (error) {
    console.warn(
      'Não foi possível liberar a orientação da tela:',
      error,
    );
  }
}