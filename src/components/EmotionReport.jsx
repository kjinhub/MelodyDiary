import "./EmotionReport.css";
import React from "react";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// 날짜 → 주차 변환 함수
function getWeekKey(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date - firstDay) / (1000 * 60 * 60 * 24));
  const week = Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);
  return `${year}-W${week}`; // 예: "2025-W45"
}
export default function EmotionReport({ diaries, emotionCounts }) {
  const pieLabels = Object.keys(emotionCounts);
  const pieValues = Object.values(emotionCounts);
  const emotionColors = {
    행복: "#FFD580",
    슬픔: "#A57DFF",
    회상: "#9FE2BF",
    사랑: "#FFB6C1",
    평온: "#B0E0E6",
    불안: "#C9A0DC",
    분노: "#FF7F50",
  };

  // ② 주간 감정 변화 부분 (그대로)
  const weeklyData = {};
  diaries.forEach((d) => {
    const weekKey = getWeekKey(d.date);
    if (!weeklyData[weekKey]) weeklyData[weekKey] = {};
    weeklyData[weekKey][d.emotion] = (weeklyData[weekKey][d.emotion] || 0) + 1;
  });

  const emotions = [...new Set(diaries.map((d) => d.emotion))];
  const weeks = Object.keys(weeklyData).sort();

  const datasets = emotions.map((emotion) => ({
    label: emotion,
    data: weeks.map((w) => weeklyData[w][emotion] || 0),
    backgroundColor: emotionColors[emotion] || "#CCCCCC", // fallback
  }));

  const barData = { labels: weeks, datasets };
  // pieLabels: ["행복", "슬픔", "분노", ...]
  const pieBackgroundColors = pieLabels.map(
    (emotion) => emotionColors[emotion] || "#CCCCCC" // fallback: 회색
  );

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieValues,
        backgroundColor: pieBackgroundColors,
      },
    ],
  };
  return (
    <div className="report">
      <h2>감정 리포트</h2>
      <div className="chart-section">
        <h3>전체 감정 비율</h3>
        <div className="chart-box">
          <Pie data={pieData} />
        </div>
      </div>
      <div className="chart-section">
        <h3>주간 감정 변화</h3>
        <div className="chart-box">
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
