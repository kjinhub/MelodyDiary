import React from "react";
import "./EmotionReport.css";
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

export default function EmotionReport({ diaries }) {
  const emotionCounts = diaries.reduce((acc, d) => {
    acc[d.emotion] = (acc[d.emotion] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(emotionCounts);
  const dataValues = Object.values(emotionCounts);

  const pieData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#FFB6C1",
          "#C9A0DC",
          "#9FE2BF",
          "#FFD580",
          "#B0E0E6",
        ],
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      { label: "감정 빈도", data: dataValues, backgroundColor: "#a57dff" },
    ],
  };

  return (
    <div className="report">
      <h2>감정 리포트</h2>
      <div className="charts">
        <Pie data={pieData} />
        <Bar data={barData} />
      </div>
    </div>
  );
}
