import { Howl, Howler } from 'howler';

const sounds = {
  bgm: new Howl({
    src: ['/audio/bgm-war.mp3'], // Placeholder standard path
    loop: true,
    volume: 0.3,
  }),
  buttonClick: new Howl({
    src: ['/audio/click.mp3'],
    volume: 0.6,
  }),
  chestOpen: new Howl({
    src: ['/audio/chest-open.mp3'],
    volume: 0.8,
  }),
  shootShell: new Howl({
    src: ['/audio/shoot-shell.mp3'],
    volume: 0.5,
  }),
  shootLaser: new Howl({
    src: ['/audio/shoot-laser.mp3'],
    volume: 0.4,
  }),
  explosionSm: new Howl({
    src: ['/audio/explode-sm.mp3'],
    volume: 0.5,
  }),
  explosionLg: new Howl({
    src: ['/audio/explode-lg.mp3'],
    volume: 0.8,
  }),
  engineIdle: new Howl({
    src: ['/audio/engine-idle.mp3'],
    loop: true,
    volume: 0.2,
  }),
  engineMove: new Howl({
    src: ['/audio/engine-move.mp3'],
    loop: true,
    volume: 0.4,
  })
};

let bgmPlaying = false;

export const playSound = (soundName) => {
  if (sounds[soundName]) {
    try {
      sounds[soundName].play();
    } catch {}
  }
};

export const stopSound = (soundName) => {
  if (sounds[soundName]) {
    sounds[soundName].stop();
  }
};

export const toggleBgm = () => {
  if (bgmPlaying) {
    sounds.bgm.pause();
    bgmPlaying = false;
  } else {
    sounds.bgm.play();
    bgmPlaying = true;
  }
};

export const setMasterVolume = (vol) => {
  Howler.volume(vol); // 0.0 to 1.0
};
