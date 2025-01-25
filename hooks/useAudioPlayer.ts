import { useState, useRef, useEffect } from 'react';

export const useAudioPlayer = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(1); // Volumen por defecto a 1 (máximo)

  // Actualizar la URL del audio cuando cambie
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = audioUrl; // Actualiza la URL del audio cuando cambie
      audio.load(); // Recargar el audio
    }
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const updateProgress = () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
      };

      const setAudioDuration = () => {
        setDuration(audio.duration || 0);
      };

      // No reiniciar la canción al finalizar, si es necesario
      const handleAudioEnd = () => {
        setIsPlaying(false); // Detener la reproducción al finalizar
      };

      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("loadedmetadata", setAudioDuration);
      audio.addEventListener("ended", handleAudioEnd);

      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("loadedmetadata", setAudioDuration);
        audio.removeEventListener("ended", handleAudioEnd);
      };
    }
  }, []);

  // Función para manejar la reproducción/pausa
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Función para retroceder 10 segundos
  const handleSkipBack = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    }
  };

  // Función para adelantar 10 segundos
  const handleStepForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    }
  };

  // Función para cambiar el volumen
  const handleVolumeChange = (volume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      setVolumeLevel(volume); // Actualizar el estado del volumen
    }
  };

  return {
    audioRef,
    isPlaying,
    progress,
    currentTime,
    duration,
    volumeLevel,
    handlePlayPause,
    handleSkipBack,
    handleStepForward,
    handleVolumeChange, // Para cambiar el volumen
  };
};
