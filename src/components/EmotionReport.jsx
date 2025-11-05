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

export default function EmotionReport({ diaries }) {
  // ----- ① 전체 감정 비율 (Pie) -----
  const emotionCounts = diaries.reduce((acc, d) => {
    acc[d.emotion] = (acc[d.emotion] || 0) + 1;
    return acc;
  }, {});
  const pieLabels = Object.keys(emotionCounts);
  const pieValues = Object.values(emotionCounts);

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieValues,
        backgroundColor: [
          "#FFB6C1",
          "#C9A0DC",
          "#9FE2BF",
          "#FFD580",
          "#B0E0E6",
          "#A57DFF",
        ],
      },
    ],
  };

  // ----- ② 주간 감정 변화 (Bar) -----
  const weeklyData = {};
  diaries.forEach((d) => {
    const weekKey = getWeekKey(d.date);
    if (!weeklyData[weekKey]) weeklyData[weekKey] = {};
    weeklyData[weekKey][d.emotion] = (weeklyData[weekKey][d.emotion] || 0) + 1;
  });

  const emotions = [...new Set(diaries.map((d) => d.emotion))];
  const weeks = Object.keys(weeklyData).sort();

  const datasets = emotions.map((emotion, i) => ({
    label: emotion,
    data: weeks.map((w) => weeklyData[w][emotion] || 0),
    backgroundColor: [
      "#FFB6C1",
      "#C9A0DC",
      "#9FE2BF",
      "#FFD580",
      "#B0E0E6",
      "#A57DFF",
    ][i % 6],
  }));

  const barData = { labels: weeks, datasets };

  return (
    <div className="report">
      <h2>감정 리포트</h2>

      {/* 위쪽: 원형 그래프 */}
      <div className="chart-section">
        <h3>전체 감정 비율</h3>
        <div className="chart-box">
          <Pie data={pieData} />
        </div>
      </div>

      {/* 아래쪽: 주간 막대 그래프 */}
      <div className="chart-section">
        <h3>주간 감정 변화</h3>
        <div className="chart-box">
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
