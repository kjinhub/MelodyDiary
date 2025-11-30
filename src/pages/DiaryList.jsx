import React from "react";
import DiaryCard from "../components/DiaryCard";
import "./DiaryList.css";

export default function DiaryList({ diaries, onDelete }) {
  console.log("📄 [DiaryList] Rendered, diary count:", diaries.length);

  if (!Array.isArray(diaries)) {
    console.error("❌ [DiaryList] Invalid diary data format:", diaries);
    return <p>데이터 오류 발생</p>;
  }

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
              onDelete={() => {
                console.log(
                  "🗑️ [DiaryList] Delete clicked for diary index:",
                  i
                );
                onDelete(i);
              }}
            />
          ))
      )}
    </div>
  );
}
