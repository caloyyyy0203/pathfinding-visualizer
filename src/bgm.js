import React, { useEffect, useRef } from 'react';

const BackgroundMusic = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = () => {
      audioRef.current.play().catch(error => {
        console.log('Autoplay failed:', error);
      });
    };

    document.addEventListener('click', playAudio, { once: true });
    return () => document.removeEventListener('click', playAudio);
  }, []);

  return (
    <audio ref={audioRef} src="/bgm.mp3" loop />
  );
};

export default BackgroundMusic;
