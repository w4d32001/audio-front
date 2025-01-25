// hooks/useVolumeControl.ts
import { useState, useRef, useEffect } from 'react';

export const useVolumeControl = () => {
  const [volumeControl, setVolumeControl] = useState(60);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volumeControl / 100;
    }
  }, [volumeControl]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeControl(parseFloat(e.target.value));
  };

  return {
    volumeControl,
    handleVolumeChange,
  };
};
