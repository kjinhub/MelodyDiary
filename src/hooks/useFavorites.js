// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

export default function useFavorites() {
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
    setFavoriteSongs(saved);
  }, []);

  const toggleFavorite = (song) => {
    setFavoriteSongs((prev) => {
      const exists = prev.some((s) => s.embedUrl === song.embedUrl);
      const updated = exists
        ? prev.filter((s) => s.embedUrl !== song.embedUrl)
        : [...prev, song];
      localStorage.setItem("favoriteSongs", JSON.stringify(updated));
      return updated;
    });
  };

  return { favoriteSongs, toggleFavorite };
}
