import { useState } from "react";
import "./DiaryItem.css";

function DiaryItem({ diary, onDelete }) {
  const [showMusic, setShowMusic] = useState(false);

  return (
    <div className="diary-item">
      {diary.imgUrl && <img src={diary.imgUrl} alt="일기 이미지" />}
      <p className="text">{diary.text}</p>
      <span className="date">{diary.date}</span>
      {diary.musicUrl && (
        <>
          <button onClick={() => setShowMusic(!showMusic)}>
            🎧 {showMusic ? "숨기기" : "음악 보기"}
          </button>
          {showMusic && (
            <iframe
              src={diary.musicUrl}
              width="100%"
              height="80"
              allow="autoplay; encrypted-media"></iframe>
          )}
        </>
      )}
      <button className="delete" onClick={() => onDelete(diary.id)}>
        삭제
      </button>
    </div>
  );
}

export default DiaryItem;
