// src/hooks/useDiaries.js
import { useState, useEffect } from "react";

export default function useDiaries() {
  // 일기 데이터 상태
  const [diaries, setDiaries] = useState([]);

  // 컴포넌트 마운트 시 로컬 스토리지에서 기존 일기 목록 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("diaries") || "[]");
    setDiaries(saved);
  }, []);

  // 새로운 일기 추가
  const addDiary = (newDiary) => {
    const updated = [...diaries, newDiary];
    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
  };

  // 특정 일기 삭제
  const deleteDiary = (targetId) => {
    const updated = diaries.filter((d) => d.id !== targetId);
    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
  };

  // 일기 목록, 추가/삭제 함수 반환
  return { diaries, addDiary, deleteDiary };
}
