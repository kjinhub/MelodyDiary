import React from "react";
import "../styles/components/DiaryDetailModal.css";

export default function DiaryDetailModal({ diary, onClose }) {
  // 일기 상세 데이터 확인용 로그
  console.log(diary);

  return (
    // 회색 배경 클릭 시 모달 닫힘
    <div className="overlay" onClick={onClose}>
      {/* 내부 클릭 시 닫히지 않도록 이벤트 전파 차단 */}
      <div className="form-box" onClick={(e) => e.stopPropagation()}>
        {/* 일기 작성 날짜 */}
        <h2>{diary.date}</h2>

        {/* 업로드된 이미지가 있는 경우 표시 */}
        {diary.image && (
          <img
            src={diary.image}
            alt="img"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        )}

        {/* 일기 본문 내용 */}
        <p>{diary.text}</p>

        {/* 연결된 음악 정보 및 Spotify Embed 표시 */}
        {diary.song && (
          <>
            <p style={{ fontSize: "0.9em", color: "#555" }}>
              🎧 {diary.song.title} — {diary.song.artist}
            </p>
            <iframe
              title={diary.song.title}
              src={diary.song.embedUrl}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </>
        )}

        {/* 닫기 버튼 */}
        <button className="bottom-close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
