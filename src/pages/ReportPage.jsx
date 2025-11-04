import React, { useEffect, useState } from "react";
import EmotionReport from "../components/EmotionReport";
import "./ReportPage.css";

export default function ReportPage() {
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("diaries") || "[]");
    if (Array.isArray(saved)) setDiaries(saved);
  }, []);

  const total = diaries.length;
  const emotionCounts = diaries.reduce((acc, d) => {
    acc[d.emotion] = (acc[d.emotion] || 0) + 1;
    return acc;
  }, {});

  const mostEmotion =
    total > 0
      ? Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "없음";

  const totalSongs = total * 3; // 임의 기준 (한 일기당 3곡 추천된다고 가정)

  return (
    <div className="report-page">
      {/* 상단 요약 카드 */}
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

      {/* 감정 분포 및 활동 차트 */}
      <div className="charts-section">
        <div className="chart-box">
          <EmotionReport diaries={diaries} />
        </div>
      </div>

      {/* 감정 인사이트 */}
      <div className="insight-section">
        {Object.entries(emotionCounts).map(([emotion, count]) => (
          <div key={emotion} className={`insight-card ${emotion}`}>
            <h4>{emotion}</h4>
            <p>{((count / total) * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
