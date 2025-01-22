"use client";
import PlayButtons from "@/components/PlayButtons/PlayButtons";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import jsmediatags from 'jsmediatags';

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [volumeControl, setVolumeControl] = useState(60);

  const [songTitle, setSongTitle] = useState("Track Title"); 
  const [artistName, setArtistName] = useState("Artist Name"); 
  const [albumCover, setAlbumCover] = useState("https://upload.wikimedia.org/wikipedia/en/thumb/1/14/Inrainbowscover.png/220px-Inrainbowscover.png"); 

  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio && !audioContextRef.current) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      const source = audioContext.createMediaElementSource(audio);

      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      gainNodeRef.current = gainNode;
    }

    const updateProgress = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
      }
    };

    const setAudioDuration = () => {
      if (audio) {
        setDuration(audio.duration || 0);
      }
    };

    audio?.addEventListener("timeupdate", updateProgress);
    audio?.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio?.removeEventListener("timeupdate", updateProgress);
      audio?.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  useEffect(() => {
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser?.frequencyBinCount || 0);

    const updateVolume = () => {
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        const volume =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setVolumeLevel(volume);
      }

      requestAnimationFrame(updateVolume);
    };

    if (analyser) {
      updateVolume();
    }
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio?.pause();
    } else {
      audio?.play();
      audioContextRef.current?.resume();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    }
  };

  const handleStepForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newProgress = parseFloat(e.target.value);
    if (audio) {
      const newTime = (newProgress / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolumeControl(newVolume * 100);

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  const extractMetadata = (audioUrl: string) => {
    fetch(audioUrl)
      .then((response) => response.blob())
      .then((blob) => {
        jsmediatags.read(blob, {
          onSuccess: (tag) => {
            const { title, artist, picture } = tag.tags;
            const image = picture ? `data:${picture.format};base64,${picture.data}` : "";

            console.log(image)
  
            setSongTitle(title || 'Unknown Title');
            setArtistName(artist || 'Unknown Artist');
            setAlbumCover(image || "https://upload.wikimedia.org/wikipedia/en/thumb/1/14/Inrainbowscover.png/220px-Inrainbowscover.png");
          },
          onError: (error) => {
            console.error("Error reading metadata", error);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching audio", error);
      });
  };

  extractMetadata('audio.mp3');

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-900">
      <div className="relative border-r w-[70%] flex items-end bg-fondo bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="flex items-center justify-center h-10 px-8 gap-x-2 mt-4 text-white absolute -left-16 top-36 bg-black/15 -rotate-90 rounded-xl">
          {volumeControl === 0 ? (
            <VolumeX className="text-red-500 rotate-90" />
          ) : volumeControl <= 33 ? (
            <Volume className="text-white rotate-90" />
          ) : volumeControl <= 66 ? (
            <Volume1 className="text-white rotate-90" />
          ) : (
            <Volume2 className="text-white rotate-90" />
          )}
          <input
            id="volume"
            type="range"
            min={0}
            max={100}
            value={volumeControl}
            onChange={handleVolumeChange}
            className="w-40 appearance-none h-1 rounded-xl cursor-pointer outline-none "
          />
        </div>

        <div className="relative h-72 w-full flex z-10">
          <div className="h-full w-72 flex items-center justify-end">
            <img
              src={albumCover} // Usamos la URL de la imagen del álbum
              alt={songTitle}
              className="rounded-xl w-36 h-36 object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col justify-around px-8">
            <div className="flex text-white justify-between items-center">
              <div className="flex flex-col gap-y-2">
                <h1>{songTitle}</h1> {/* Título de la canción */}
                <h2>{artistName}</h2> {/* Nombre del artista */}
              </div>

              <PlayButtons
                onPlayPause={handlePlayPause}
                onSkipBack={handleSkipBack}
                onStepForward={handleStepForward}
                isPlaying={isPlaying}
              />
            </div>

            <div className="flex items-center w-full">
              <span className="text-white text-sm w-12">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={handleRangeChange}
                className="w-full mx-2"
              />
              <span className="text-white text-sm w-12">
                {formatTime(duration)}
              </span>
            </div>

            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-700 transition-all duration-75"
                style={{ width: `${volumeLevel}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-red-500"></div>

      <audio ref={audioRef} src="audio.mp3"></audio>
    </div>
  );
}
