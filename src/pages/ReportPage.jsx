import React, { useEffect, useState, useMemo } from "react";
import EmotionReport from "../components/EmotionReport";
import "./ReportPage.css";

export default function ReportPage({ favoriteSongs }) {
  const [diaries, setDiaries] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("diaries") || "[]");
    setDiaries(saved);

    // ⭐ favoriteSongs 기반 (최대 3개 역순)
    setRecentTracks(favoriteSongs.slice(-3).reverse());
  }, [favoriteSongs]);

  const total = diaries.length;

  const emotionCounts = useMemo(() => {
    return diaries.reduce((acc, diary) => {
      acc[diary.emotion] = (acc[diary.emotion] || 0) + 1;
      return acc;
    }, {});
  }, [diaries]);

  const mostEmotion = useMemo(() => {
    const entries = Object.entries(emotionCounts);
    if (entries.length === 0) return "없음";
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [emotionCounts]);

  const totalSongs = useMemo(() => total * 3, [total]);

  return (
    <div className="report-page">
      {recentTracks.length > 0 && (
        <div className="recent-tracks-gallery">
          <h3>찜한 음악 🎧</h3>

          <div className="track-thumbnails">
            {recentTracks.map((track, index) => (
              <div
                key={index}
                className="track-item"
                onClick={() => window.open(track.embedUrl, "_blank")}>
                <img src={track.albumCover} alt={track.title} />
                <div className="track-info">
                  <p className="track-title-text">{track.title}</p>
                  <p className="track-artist-text">{track.artist} (듣기)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 이하 기존 코드 유지 — 요약/차트 */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          onClick={() => setShowDetails((p) => !p)}
          className="toggle-button">
          {showDetails ? "요약 보기 ⬆️" : "상세 통계 및 차트 보기 ⬇️"}
        </button>
      </div>

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
          <p>{totalSongs}</p>
        </div>
      </div>

      {showDetails && (
        <>
          <div className="charts-section">
            <div className="chart-box">
              <EmotionReport diaries={diaries} emotionCounts={emotionCounts} />
            </div>
          </div>
          <div className="insight-section">
            {Object.entries(emotionCounts).map(([emotion, count]) => (
              <div key={emotion} className={`insight-card ${emotion}`}>
                <h4>{emotion}</h4>
                <p>{((count / total) * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
