"use client";
import axios from "axios";
import { X } from "lucide-react";
import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  updateMusicList: (data: any) => void;
}

export default function Modal({ isOpen, closeModal, updateMusicList }: ModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    image: "",
    video: "",
    music: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        music: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("artist", formData.artist);
    form.append("image", formData.image);
    form.append("video", formData.video);

    if (formData.music) {
      form.append("music", formData.music);
    }

    try {
      const response = await axios.post("http://localhost:3001/music", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data) {
        updateMusicList(response.data.data); 
      }
      console.log("Respuesta del servidor:", response.data);
      close(); 
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const close = () => {
    closeModal();
    setFormData({
      title: "",
      artist: "",
      image: "",
      video: "",
      music: null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex z-50 items-center px-1">
      <div className="w-[70%]"></div>
      <div className="bg-black/80 flex-1 p-8 rounded-lg shadow-lg max-w-lg text-orange-600 font-gummy">
        <div className="flex justify-between items-center mb-4">
          <div className="w-full flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Agregar Música</h2>
            <th className="bg-orange-600 h-1 w-3/6 flex " />
          </div>
          <span className="hover:text-red-700 transition-colors cursor-pointer text-white">
            <X strokeWidth={2} onClick={close} />
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-4 mb-2">
            <label htmlFor="title" className="block font-medium text-gray-100 text-lg">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 py-2 px-4 outline-none text-gray-900 border border-gray-300 rounded w-full "
              required
            />
          </div>

          <div className="flex flex-col gap-y-4 mb-2">
            <label htmlFor="artist" className="block font-medium text-gray-100 text-lg">
              Artista
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="mt-1 py-2 px-4 outline-none text-gray-900 border border-gray-300 rounded w-full "
              required
            />
          </div>

          <div className="flex flex-col gap-y-4 mb-2">
            <label htmlFor="image" className="block font-medium text-gray-100 text-lg">
              Imagen (URL)
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 py-2 px-4 outline-none text-gray-900 border border-gray-300 rounded w-full "
              required
            />
          </div>

          <div className="flex flex-col gap-y-4 mb-2">
            <label htmlFor="video" className="block font-medium text-gray-100 text-lg">
              Video (URL)
            </label>
            <input
              type="text"
              id="video"
              name="video"
              value={formData.video}
              onChange={handleChange}
              className="mt-1 py-2 px-4 outline-none text-gray-900 border border-gray-300 rounded w-full "
              required
            />
          </div>

          <div className="flex flex-col gap-y-4 mb-2">
            <label htmlFor="music" className="block font-medium text-gray-100 text-lg cursor-pointer">
              Archivo de Música
              <div className="flex items-center gap-x-4 justify-center">
                <img
                  src="music.png"
                  id="music"
                  alt="Icono de Música"
                  className="h-20 w-auto cursor-pointer"
                />
              </div>
            </label>

            <input
              type="file"
              id="music"
              name="music"
              onChange={handleFileChange}
              className=""
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
