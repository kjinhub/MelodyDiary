// src/hooks/useDiaries.js
import { useState, useEffect } from "react";

export default function useDiaries() {
  const [diaries, setDiaries] = useState([]);

  // 초기 로드
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("diaries") || "[]");
    setDiaries(saved);
  }, []);

  // 추가
  const addDiary = (newDiary) => {
    const updated = [...diaries, newDiary];
    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
  };

  // 삭제
  const deleteDiary = (targetId) => {
    const updated = diaries.filter((d) => d.id !== targetId);

    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
  };

  return { diaries, addDiary, deleteDiary };
}
