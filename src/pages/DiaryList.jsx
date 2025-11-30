import React from "react";
import DiaryCard from "../components/DiaryCard";
import "./DiaryList.css";

function DiaryList({ diaries, setDiaries }) {
  const handleDelete = (index) => {
    const updated = diaries.filter((_, i) => i !== index);
    setDiaries(updated); // App의 diaries 상태 변경
  };

  return (
    <div className="diary-list">
      {diaries.length === 0 ? (
        <p className="empty">아직 작성된 일기가 없습니다.</p>
      ) : (
        diaries
          .slice()
          .reverse()
          .map((diary, index) => (
            <DiaryCard
              key={index}
              diary={diary}
              onDelete={() => handleDelete(index)}
            />
          ))
      )}
    </div>
  );
}

export default React.memo(DiaryList);
