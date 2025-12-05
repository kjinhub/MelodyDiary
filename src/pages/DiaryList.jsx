import React from "react";
import DiaryCard from "../components/DiaryCard";
import "../styles/pages/DiaryList.css";
import { useDiaryContext } from "../context/DiaryContext";

export default function DiaryList() {
  const { diaries, deleteDiary, toggleFavorite } = useDiaryContext();

  if (!Array.isArray(diaries)) return <p>데이터 오류 발생</p>;

  return (
    <div className="diary-list">
      {diaries.length === 0 ? (
        <p className="empty">아직 작성된 일기가 없습니다.</p>
      ) : (
        diaries
          .slice()
          .reverse()
          .map((d) => (
            <DiaryCard
              key={d.id} // ✅ id를 key로 써주는 게 더 안전
              diary={d}
              onDelete={() => deleteDiary(d.id)} // ✅ id 기반 삭제
              onFavorite={toggleFavorite}
            />
          ))
      )}
    </div>
  );
}
