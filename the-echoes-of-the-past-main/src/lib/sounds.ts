import { Howl } from 'howler';

const sounds: { [key: string]: Howl } = {
  beep: new Howl({ src: ['/sounds/beep.mp3'] }),
  success: new Howl({ src: ['/sounds/success.mp3'] }),
  error: new Howl({ src: ['/sounds/error.mp3'] }),
  unlock: new Howl({ src: ['/sounds/unlock.mp3'] }),
};

export const playSound = (name: string) => {
  if (sounds[name]) {
    sounds[name].play();
  }
};
