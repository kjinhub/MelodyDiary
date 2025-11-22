import React, { useEffect, useState, useMemo } from "react";
import EmotionReport from "../components/EmotionReport";
import "./ReportPage.css";

export default function ReportPage() {
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("diaries") || "[]");
    if (Array.isArray(saved)) setDiaries(saved);
  }, []);

  const total = diaries.length;

  // 감정 비율 계산
  const emotionCounts = useMemo(() => {
    return diaries.reduce((acc, d) => {
      acc[d.emotion] = (acc[d.emotion] || 0) + 1;
      return acc;
    }, {});
  }, [diaries]);

  // 가장 많은 감정 계산
  const mostEmotion = useMemo(() => {
    const entries = Object.entries(emotionCounts);
    if (entries.length === 0) return "없음";
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [emotionCounts]);

  const totalSongs = useMemo(() => total * 3, [total]);

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
          <p>{totalSongs}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-box">
          <EmotionReport diaries={diaries} />
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
    </div>
  );
}
