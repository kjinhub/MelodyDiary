import React, { useEffect, useState } from "react";
import DiaryCard from "../components/DiaryCard";

export default function DiaryList() {
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("diaries") || "[]");
      if (Array.isArray(saved)) setDiaries(saved);
    } catch {
      localStorage.removeItem("diaries");
    }
  }, []);

  return (
    <div className="diary-list">
      {diaries.length === 0 ? (
        <p className="empty">아직 작성된 일기가 없습니다.</p>
      ) : (
        diaries
          .slice()
          .reverse()
          .map((d, i) => <DiaryCard key={i} diary={d} />)
      )}
    </div>
  );
}
