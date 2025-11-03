import React, { useEffect, useState } from "react";
import EmotionReport from "../components/EmotionReport";

export default function ReportPage() {
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("diaries") || "[]");
    if (Array.isArray(saved)) setDiaries(saved);
  }, []);

  return <EmotionReport diaries={diaries} />;
}
