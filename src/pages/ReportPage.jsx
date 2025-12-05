// src/pages/ReportPage.jsx
import React from "react";
import EmotionReport from "../components/EmotionReport";
import { useReportData } from "../hooks/useReportData";
import "../styles/pages/ReportPage.css";

export default function ReportPage({ favoriteSongs }) {
  const savedDiaries = JSON.parse(localStorage.getItem("diaries") || "[]");
  const { recentTracks, total, emotionCounts, mostEmotion } = useReportData(
    favoriteSongs,
    savedDiaries
  );

  if (total === 0) {
    return (
      <div className="empty-report">
        <p>오늘의 일기를 저장해보세요!</p>
        <button onClick={() => (window.location.href = "/")}>
          ✏️ 새 일기 작성하기
        </button>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="summary-section">
        <div className="summary-card">
          <h3>전체 일기</h3>
          <p>{total}</p>
        </div>
        <div className="summary-card">
          <h3>가장 많은 감정</h3>
          <p>{mostEmotion}</p>
        </div>
        <div className="summary-card">
          <h3>추천받은 음악</h3>
          <p>{total * 3}</p>
        </div>
      </div>

      <div className="charts-inline">
        <EmotionReport diaries={savedDiaries} emotionCounts={emotionCounts} />
      </div>

      <div className="recent-tracks">
        {recentTracks.map((track, i) => (
          <div key={i} onClick={() => window.open(track.embedUrl, "_blank")}>
            <img src={track.albumCover} alt={track.title} />
            <p>{track.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
