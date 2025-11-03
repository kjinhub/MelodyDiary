import React from "react";

export default function DiaryCard({ diary }) {
  if (!diary) return null;

  const safeText =
    typeof diary.text === "string"
      ? diary.text
      : JSON.stringify(diary.text || "");
  const safeEmotion =
    typeof diary.emotion === "string"
      ? diary.emotion
      : JSON.stringify(diary.emotion || "감정 분석 실패");

  const track = diary.song || {};
  const safeTitle =
    typeof track.title === "string" ? track.title : "(제목 없음)";
  const safeArtist =
    typeof track.artist === "string" ? track.artist : "(아티스트 미상)";
  const embedUrl = typeof track.embedUrl === "string" ? track.embedUrl : null;

  return (
    <div className="card">
      <div className="card-header">
        <span>{diary.date}</span>
        <span className="emotion-tag">{safeEmotion}</span>
      </div>

      <p>{safeText}</p>

      {embedUrl && (
        <>
          <p style={{ fontSize: "0.9em", color: "#555" }}>
            🎧 {safeTitle} — {safeArtist}
          </p>
          <iframe
            title={`${safeTitle}-${safeArtist}`}
            src={embedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </>
      )}
    </div>
  );
}
