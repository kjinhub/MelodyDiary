import React, { useState } from "react";
import DiaryDetailModal from "./DiaryDetailModal";
import "./DiaryCard.css";

export default function DiaryCard({ diary, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="diary-card" onClick={() => setOpen(true)}>
        {/* 사진 영역 */}
        {diary.image && (
          <div className="card-image">
            <img src={diary.image} alt="diary" />
          </div>
        )}

        {/* 내용 영역 */}
        <div className="card-content">
          {/* 감정 태그 */}
          <span className={`emotion-tag emotion-${diary.emotion}`}>
            {diary.emotion}
          </span>

          {/* 날짜 */}
          <p className="card-date">{diary.date}</p>

          {/* 내용 미리보기 */}
          <p className="card-text">
            {diary.text.length > 80
              ? diary.text.slice(0, 80) + "..."
              : diary.text}
          </p>

          {/* 음악 정보 */}
          {diary.song && (
            <div className="song-box">
              <p className="song-title">
                🎵 {diary.song.title} — {diary.song.artist}
              </p>
              <button
                className={`song-button emotion-${diary.emotion}`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(diary.song.embedUrl, "_blank");
                }}>
                음악 재생
              </button>
            </div>
          )}
          {/* ✅ 삭제 버튼 추가 */}
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 방지
              onDelete(); // 상위로 전달
            }}>
            삭제 🗑️
          </button>
        </div>
      </div>

      {/* 상세보기 모달 */}
      {open && (
        <DiaryDetailModal diary={diary} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
