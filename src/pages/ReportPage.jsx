import React from "react";
import EmotionReport from "../components/EmotionReport";
import "../styles/pages/ReportPage.css";
import { useDiaryContext } from "../context/DiaryContext";
import { useReportData } from "../hooks/useReportData";

export default function ReportPage() {
  const { favoriteSongs, diaries } = useDiaryContext();
  const { recentTracks, total, emotionCounts, mostEmotion } = useReportData(
    favoriteSongs,
    diaries
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
      {/* 요약 섹션 */}
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

      {/* 차트 섹션 */}
      <div className="charts-inline">
        <EmotionReport diaries={diaries} emotionCounts={emotionCounts} />
      </div>

      {/* 찜한 음악 섹션 */}
      <div className="recent-tracks-gallery">
        <h3>찜한 음악 🎧</h3>
        <div className="track-thumbnails">
          {recentTracks.map((track, i) => (
            <div
              key={i}
              className="track-item"
              onClick={() => window.open(track.embedUrl, "_blank")}>
              <img src={track.albumCover} alt={track.title} />
              <div className="track-info">
                <p className="track-title-text">{track.title}</p>
                <p className="track-artist-text">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
