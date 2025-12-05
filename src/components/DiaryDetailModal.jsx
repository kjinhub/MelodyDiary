import React from "react";
import "../styles/components/DiaryDetailModal.css";
export default function DiaryDetailModal({ diary, onClose }) {
  console.log(diary);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="form-box" onClick={(e) => e.stopPropagation()}>
        <h2>{diary.date}</h2>
        {diary.image && (
          <img
            src={diary.image}
            alt="img"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        )}
        <p>{diary.text}</p>
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
        <button className="bottom-close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
