import React from "react";
import DiaryCard from "../components/DiaryCard";
import "../styles/pages/DiaryList.css";

export default function DiaryList({ diaries, onDelete, onFavorite }) {
  if (!Array.isArray(diaries)) return <p>데이터 오류 발생</p>;

  return (
    <div className="diary-list">
      {diaries.length === 0 ? (
        <p className="empty">아직 작성된 일기가 없습니다.</p>
      ) : (
        diaries
          .slice()
          .reverse()
          .map((d, i) => (
            <DiaryCard
              key={i}
              diary={d}
              onDelete={() => onDelete(i)}
              onFavorite={onFavorite} // ⭐ DiaryCard에 이벤트 전달
            />
          ))
      )}
    </div>
  );
}
