import "../styles/components/EmotionReport.css";
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

// Chart.js에서 사용할 요소 등록 (도넛형, 막대형 차트 등)
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// 날짜 문자열을 기준으로 몇 번째 주인지 계산하는 유틸 함수
function getWeekKey(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date - firstDay) / (1000 * 60 * 60 * 24));
  const week = Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);
  return `${year}-W${week}`; // 예: "2025-W45"
}

export default function EmotionReport({ diaries, emotionCounts }) {
  // 전체 감정별 통계 (Pie 차트용)
  const pieLabels = Object.keys(emotionCounts);
  const pieValues = Object.values(emotionCounts);

  // 감정별 색상 매핑
  const emotionColors = {
    행복: "#FFD580",
    슬픔: "#A57DFF",
    회상: "#9FE2BF",
    사랑: "#FFB6C1",
    평온: "#B0E0E6",
    불안: "#C9A0DC",
    분노: "#FF7F50",
  };

  // 주차별 감정 데이터를 집계
  const weeklyData = {};
  diaries.forEach((d) => {
    const weekKey = getWeekKey(d.date);
    if (!weeklyData[weekKey]) weeklyData[weekKey] = {};
    weeklyData[weekKey][d.emotion] = (weeklyData[weekKey][d.emotion] || 0) + 1;
  });

  // 전체 등장 감정 목록 및 주차 목록 정렬
  const emotions = [...new Set(diaries.map((d) => d.emotion))];
  const weeks = Object.keys(weeklyData).sort();

  // 각 감정별 데이터셋 생성 (막대 그래프용)
  const datasets = emotions.map((emotion) => ({
    label: emotion,
    data: weeks.map((w) => weeklyData[w][emotion] || 0),
    backgroundColor: emotionColors[emotion] || "#CCCCCC",
  }));

  const barData = { labels: weeks, datasets };

  // 파이 차트용 데이터 구성..
  const pieBackgroundColors = pieLabels.map(
    (emotion) => emotionColors[emotion] || "#CCCCCC"
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

  // 감정 통계 리포트 렌더링
  return (
    <div className="report">
      <h2>감정 리포트</h2>

      {/* 전체 감정 비율 (Pie 차트) */}
      <div className="chart-section">
        <h3>전체 감정 비율</h3>
        <div className="chart-box">
          <Pie data={pieData} />
        </div>
      </div>

      {/* 주간 감정 변화 (Bar 차트) */}
      <div className="chart-section">
        <h3>주간 감정 변화</h3>
        <div className="chart-box">
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
