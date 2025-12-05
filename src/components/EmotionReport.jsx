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

// 🧩 Chart.js 기본 요소 등록
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

/**
 * 🧠 EmotionReport Component
 * - 전체 감정 통계(Pie Chart) 및 주간 감정 추이(Bar Chart) 시각화
 * - 데이터 기반 감정 트렌드 분석 대시보드 역할
 *
 * TEAM NOTES:
 *  - Frontend: Chart.js 렌더링 최적화 (responsive 속성 추가)
 *  - Data: 감정 값 표준화 필요 (e.g. "행복", "Happy" 혼용 방지)
 *  - UI/UX: 색상 팔레트 접근성 검토 (저시력 사용자 대비)
 *  - Analytics: 감정 변화 추이를 월 단위로 확장 검토
 */

// 📅 날짜 → 주차 변환 함수
// REVIEW: ISO 8601 기준으로 주차 계산 로직 보정 필요
function getWeekKey(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date - firstDay) / (1000 * 60 * 60 * 24));
  const week = Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);
  return `${year}-W${week}`; // 예: "2025-W45"
}

export default function EmotionReport({ diaries, emotionCounts }) {
  // 🎨 감정 데이터 기반 Pie 차트 구성
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

  /**
   * 📊 주간 감정 변화 데이터 생성
   * - 일기 날짜별로 주차 단위 집계
   * - 각 주차에 감정별 빈도수를 누적
   *
   * TODO(data): 주별 감정 총합 normalization 고려
   */
  const weeklyData = {};
  diaries.forEach((d) => {
    const weekKey = getWeekKey(d.date);
    if (!weeklyData[weekKey]) weeklyData[weekKey] = {};
    weeklyData[weekKey][d.emotion] = (weeklyData[weekKey][d.emotion] || 0) + 1;
  });

  const emotions = [...new Set(diaries.map((d) => d.emotion))];
  const weeks = Object.keys(weeklyData).sort();

  /**
   * 📈 Bar 차트용 데이터셋 구성
   * - 각 감정별 주간 빈도값 매핑
   * - REVIEW(UI): 색상 대비 향상 필요 (색맹 대비)
   */
  const datasets = emotions.map((emotion) => ({
    label: emotion,
    data: weeks.map((w) => weeklyData[w][emotion] || 0),
    backgroundColor: emotionColors[emotion] || "#CCCCCC", // fallback
  }));

  const barData = { labels: weeks, datasets };

  // 🥧 Pie 차트 데이터
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

      {/* 📊 Pie Chart: 전체 감정 비율 */}
      {/* REVIEW(perf): chart.js animation 옵션 최적화 필요 */}
      <div className="chart-section">
        <h3>전체 감정 비율</h3>
        <div className="chart-box">
          <Pie data={pieData} />
        </div>
      </div>

      {/* 📅 Bar Chart: 주간 감정 변화 */}
      <div className="chart-section">
        <h3>주간 감정 변화</h3>
        <div className="chart-box">
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
