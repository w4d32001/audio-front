// hooks/useMusic.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface Music {
 _id: string;
  title: string;
  artist: string;
  image: string;
  video: string;
  music: string;
}

export const useMusic = () => {
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusic = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/music/"); 
        setMusicList(response.data.data);
      } catch (err) {
        setError("Error al cargar las músicas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []); 

  return { musicList, loading, error, setMusicList };
};
