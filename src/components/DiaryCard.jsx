import React, { useState } from "react";
import DiaryDetailModal from "../components/DiaryDetailModal";
import "../styles/components/DiaryCard.css";

/**
 * 🧩 DiaryCard Component
 * - 개별 일기 항목을 카드 형태로 렌더링
 * - 클릭 시 상세 모달을 띄움
 * - 삭제 및 즐겨찾기 기능 제공
 *
 * @prop {Object} diary - 일기 데이터 (image, emotion, date, text, song 포함)
 * @prop {Function} onDelete - 삭제 이벤트 핸들러
 * @prop {Function} onFavorite - 즐겨찾기 이벤트 핸들러
 */

export default function DiaryCard({ diary, onDelete, onFavorite }) {
  // 🧠 UI 상태 관리
  // REVIEW(UI): 모달 오픈 여부를 전역 상태로 승격할 필요가 있는지 논의 필요 (다중 모달 지원 시)
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NOTE(UI): 카드 클릭 시 상세 모달 열림 */}
      <div className="diary-card" onClick={() => setOpen(true)}>
        {/* NOTE(UX): 이미지가 있을 경우만 렌더링 */}
        {diary.image && (
          <div className="card-image">
            <img src={diary.image} alt="diary" />
          </div>
        )}

        <div className="card-content">
          {/* TODO(style): emotion 색상과 매칭되는 CSS 클래스 유지보수 필요 */}
          <span className={`emotion-tag emotion-${diary.emotion}`}>
            {diary.emotion}
          </span>

          {/* NOTE(UI): 날짜 표기 — 포맷팅(YYYY-MM-DD) 통일 필요 */}
          <p className="card-date">{diary.date}</p>

          {/* REVIEW(content): 텍스트 자르기 로직 추출 고려 (공통 util로) */}
          <p className="card-text">
            {diary.text.length > 80
              ? diary.text.slice(0, 80) + "..."
              : diary.text}
          </p>

          {/* NOTE(music): 음악 정보가 존재할 경우에만 섹션 표시 */}
          {diary.song && (
            <div className="song-box">
              <p className="song-title">
                🎵 {diary.song.title} — {diary.song.artist}
              </p>

              {/* REVIEW(accessibility): a 태그로 대체하여 접근성 향상 고려 */}
              <button
                className={`song-button emotion-${diary.emotion}`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(diary.song.embedUrl, "_blank");
                }}>
                음악 재생
              </button>

              {/* 💡 FEATURE: 즐겨찾기(찜) 기능 */}
              {/* FIXME(state): 동일 곡 중복 즐겨찾기 방지 로직 추가 필요 */}
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

          {/* 🗑️ 삭제 버튼 */}
          {/* TODO(UX): 삭제 시 confirm 모달 추가 필요 */}
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

      {/* 📄 상세 모달 */}
      {/* REVIEW(perf): React.memo 적용 고려 — 리렌더 최소화 */}
      {open && (
        <DiaryDetailModal diary={diary} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
