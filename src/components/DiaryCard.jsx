import React, { useState } from "react";
import DiaryDetailModal from "./DiaryDetailModal";
import "../styles/components/DiaryCard.css";

export default function DiaryCard({ diary, onDelete, onFavorite }) {
  // 상세 보기 모달 열림 상태 관리
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 일기 카드 본체 */}
      <div className="diary-card" onClick={() => setOpen(true)}>
        {/* 이미지가 있는 경우 카드 상단에 표시 */}
        {diary.image && (
          <div className="card-image">
            <img src={diary.image} alt="diary" />
          </div>
        )}

        <div className="card-content">
          {/* 감정 태그 (색상은 emotion 값에 따라 CSS로 제어) */}
          <span className={`emotion-tag emotion-${diary.emotion}`}>
            {diary.emotion}
          </span>

          {/* 작성 날짜 */}
          <p className="card-date">{diary.date}</p>

          {/* 본문 요약 (80자 초과 시 생략 처리) */}
          <p className="card-text">
            {diary.text.length > 80
              ? diary.text.slice(0, 80) + "..."
              : diary.text}
          </p>

          {/* 연결된 음악 정보 및 조작 버튼 */}
          {diary.song && (
            <div className="song-box">
              <p className="song-title">
                🎵 {diary.song.title} — {diary.song.artist}
              </p>

              {/* Spotify에서 음악 재생 (새 탭 열기) */}
              <button
                className={`song-button emotion-${diary.emotion}`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(diary.song.embedUrl, "_blank");
                }}>
                음악 재생
              </button>

              {/* 찜(즐겨찾기) 버튼 */}
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

          {/* 일기 삭제 버튼 */}
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

      {/* 일기 상세 보기 모달 */}
      {open && (
        <DiaryDetailModal diary={diary} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
