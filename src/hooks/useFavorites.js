// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

export default function useFavorites() {
  // 사용자가 찜한(즐겨찾기한) 음악 목록 상태
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  // 컴포넌트 마운트 시 로컬 스토리지에서 기존 찜 목록 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
    setFavoriteSongs(saved);
  }, []);

  // 특정 곡의 찜 상태를 토글 (추가/삭제)
  const toggleFavorite = (song) => {
    setFavoriteSongs((prev) => {
      // 이미 존재하는지 확인
      const exists = prev.some((s) => s.embedUrl === song.embedUrl);

      // 존재하면 제거, 없으면 추가
      const updated = exists
        ? prev.filter((s) => s.embedUrl !== song.embedUrl)
        : [...prev, song];

      // 변경된 목록을 로컬 스토리지에 동기화
      localStorage.setItem("favoriteSongs", JSON.stringify(updated));

      return updated;
    });
  };

  // favoriteSongs 배열과 토글 함수 반환
  return { favoriteSongs, toggleFavorite };
}
