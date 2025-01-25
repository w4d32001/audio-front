"use client";
import React, { useState, useEffect } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useMusic } from "@/hooks/useMusic";
import Music from "@/components/Music/Music";
import PlayButtons from "@/components/PlayButtons/PlayButtons";
import { Plus, Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import axios from "axios";

export default function Home() {
  const { musicList, loading, error, setMusicList } = useMusic();
  const [currentMusicIndex, setCurrentMusicIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volumeControl, setVolumeControl] = useState<number>(60);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateMusicList = (newMusic: any) => {
    setMusicList((prevList) => [...prevList, newMusic]);
  };

  const currentMusic = musicList[currentMusicIndex];

  const {
    audioRef,
    progress,
    currentTime,
    duration,
    handleSkipBack,
    handleStepForward,
  } = useAudioPlayer(currentMusic?.music || "");

  useEffect(() => {
    if (currentMusic && audioRef.current) {
      const audio = audioRef.current;
      console.log(audio)
      console.log(currentMusic);
      if (audio.src !== `http://localhost:3001/uploads/${currentMusic.music}`) {
        audio.src = `http://localhost:3001/uploads/${currentMusic.music}`;
        audio.load();
      }
      audio.volume = volumeControl / 100;
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error("Error al reproducir audio:", error);
        });
      }
    }
  }, [currentMusic, audioRef, volumeControl, isPlaying]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolumeControl(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleMusicClick = (index: number) => {
    setCurrentMusicIndex(index);
    setIsPlaying(true);
  };

  const handleAudioEnded = () => {
    if (currentMusicIndex < musicList.length - 1) {
      setCurrentMusicIndex(currentMusicIndex + 1);
    } else {
      setCurrentMusicIndex(0);
    }
  };
  const handleSkipNextClick = () => {
    if (currentMusicIndex < musicList.length - 1) {
      setCurrentMusicIndex(currentMusicIndex + 1);
    } else {
      setCurrentMusicIndex(0);
    }
  };

  const handleSkipPrevClick = () => {
    if (currentMusicIndex > 0) {
      setCurrentMusicIndex(currentMusicIndex - 1);
    } else {
      setCurrentMusicIndex(musicList.length - 1);
    }
  };

  const handleSkipBackClick = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
    }
  };

  const handleStepForwardClick = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          console.error("Error al reproducir audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const extractVideoId = (url: string) => {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(currentMusic?.video || "");

  const handleDeleteMusic = async (id: string) => {
    try {
      console.log("ID a eliminar:", id);
      const response = await axios.delete(`http://localhost:3001/music/${id}`);
      console.log("Respuesta del servidor:", response.data);
  
      const updatedList = musicList.filter((music) => music._id !== id);
      setMusicList(updatedList);
  
      if (currentMusicIndex >= updatedList.length) {
        setCurrentMusicIndex(Math.max(updatedList.length - 1, 0));
      }
  
      if (updatedList.length === 0) {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al eliminar la música:", error.response?.data || error.message);
        alert(`Error al eliminar la música: ${error.response?.data?.message || "Error desconocido"}`);
      } else {
        console.error("Error inesperado:", error);
      }
    }
  };
  
  

  return (
    <div className="flex flex-row-reverse min-h-screen overflow-hidden bg-gray-900">
      <div className="relative border-r w-[71%] flex items-end bg-cover bg-center">
        {videoId && (
          <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&modestbranding=1&controls=0&showinfo=0&rel=0&fs=0&iv_load_policy=3&cc_load_policy=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        ></iframe>
        
        )}
        <div className="flex items-center justify-center h-10 px-8 gap-x-2 mt-4 text-white absolute -right-16 top-36 bg-black/70 -rotate-90 rounded-xl">
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
            className="w-40 appearance-none h-1 rounded-xl cursor-pointer outline-none"
          />
        </div>
        <div className="relative h-72 w-full flex z-10">
          <div className="h-full w-72 flex items-center justify-end">
            <img
              src={currentMusic?.image || "https://via.placeholder.com/150"}
              alt="Imagen de la canción"
              className="rounded-xl w-60 h-60 object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col justify-around px-8">
            <div className="flex text-white justify-between p-4 items-center bg-gray-900/80 rounded-xl">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-xl font-gummy">
                  {currentMusic?.title || "Título de la canción"}
                </h1>
                <h2 className="font-nunito">
                  {currentMusic?.artist || "Artista"}
                </h2>
              </div>
              <PlayButtons
                onPlayPause={handlePlayPause}
                onSkipBack={handleSkipBackClick}
                onStepForward={handleStepForwardClick}
                onSkipNext={handleSkipNextClick}
                onSkipPrev={handleSkipPrevClick}
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
                onChange={(e) => {
                  const audio = audioRef.current;
                  if (audio) {
                    audio.currentTime =
                      (parseFloat(e.target.value) / 100) * audio.duration;
                  }
                }}
                className="w-full mx-2 appearance-none h-1 rounded-xl cursor-pointer outline-none"
              />
              <span className="text-white text-sm w-12">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 text-white h-svh">
        <div className="flex items-center justify-between border-b p-4 h-16">
          <span className="font-gummy text-xl">Lista de músicas</span>
          <span className="hover:text-orange-600 cursor-pointer">
            <Plus strokeWidth={3} onClick={openModal} />
          </span>
          <Modal isOpen={isModalOpen} closeModal={closeModal} updateMusicList={updateMusicList} />
        </div>
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto flex flex-col gap-y-3 p-2">
          {musicList.map((music, index) => (
            <Music
              key={music._id}
              image={music.image}
              artist={music.artist}
              title={music.title}
              onDelete={() => handleDeleteMusic(music._id)}
              onClick={() => handleMusicClick(index)}
            />
          ))}
        </div>
      </div>

      <audio ref={audioRef} onEnded={handleAudioEnded}></audio>
    </div>
  );
}
