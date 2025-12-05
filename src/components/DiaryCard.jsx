import React, { useState } from "react";
import DiaryDetailModal from "./DiaryDetailModal";
import "../styles/components/DiaryCard.css";

export default function DiaryCard({ diary, onDelete, onFavorite }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="diary-card" onClick={() => setOpen(true)}>
        {diary.image && (
          <div className="card-image">
            <img src={diary.image} alt="diary" />
          </div>
        )}

        <div className="card-content">
          <span className={`emotion-tag emotion-${diary.emotion}`}>
            {diary.emotion}
          </span>

          <p className="card-date">{diary.date}</p>

          <p className="card-text">
            {diary.text.length > 80
              ? diary.text.slice(0, 80) + "..."
              : diary.text}
          </p>

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

              {/* ⭐ 찜하기 버튼 */}
              <button
                className="favorite-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite(diary.song);
                }}>
                ❤️
              </button>
            </div>
          )}

          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}>
            삭제 🗑️
          </button>
        </div>
      </div>

      {open && (
        <DiaryDetailModal diary={diary} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
