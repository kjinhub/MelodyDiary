import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DiaryList from "./pages/DiaryList";
import ReportPage from "./pages/ReportPage";
import DiaryForm from "./components/DiaryForm";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [diaries, setDiaries] = useState([]);

  // 앱 로드 시 localStorage 불러오기
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("diaries") || "[]");
      if (Array.isArray(saved)) setDiaries(saved);
    } catch {
      localStorage.removeItem("diaries");
    }
  }, []);

  // diaries가 바뀔 때마다 localStorage 저장
  useEffect(() => {
    localStorage.setItem("diaries", JSON.stringify(diaries));
  }, [diaries]);

  return (
    <Router>
      <div className="app-container">
        <Navbar onNewDiary={() => setShowForm(true)} />

        <Routes>
          <Route
            path="/"
            element={<DiaryList diaries={diaries} setDiaries={setDiaries} />}
          />

          <Route path="/report" element={<ReportPage />} />
        </Routes>

        {showForm && (
          <DiaryForm
            onClose={() => setShowForm(false)}
            setDiaries={setDiaries}
          />
        )}

        <footer className="footer">
          MelodyDiary · 당신의 감정을 음악으로 기록하세요 🎵
          <br />
          <small>Powered by GPT API & Spotify Embed</small>
        </footer>
      </div>
    </Router>
  );
}
