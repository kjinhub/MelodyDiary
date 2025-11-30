import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DiaryList from "./pages/DiaryList";
import ReportPage from "./pages/ReportPage";
import DiaryForm from "./components/DiaryForm";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [diaries, setDiaries] = useState([]);

  // 앱 시작 시 localStorage에서 데이터 로드
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("diaries") || "[]");
    setDiaries(saved);
    console.log("📘 [App] Diaries loaded from localStorage:", saved);
  }, []);

  // 새 일기 추가 시 호출됨
  const handleAddDiary = (newDiary) => {
    const updated = [...diaries, newDiary];
    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
    console.log("📝 [App] New diary added:", newDiary);
  };

  // 일기 삭제 시 호출됨
  const handleDeleteDiary = (index) => {
    const updated = diaries.filter((_, i) => i !== index);
    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
    console.log(`🗑️ [App] Diary deleted (index: ${index})`);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar
          onNewDiary={() => {
            console.log("🎉 [App] DiaryForm opened");
            setShowForm(true);
          }}
        />

        <Routes>
          <Route
            path="/"
            element={
              <DiaryList diaries={diaries} onDelete={handleDeleteDiary} />
            }
          />
          <Route path="/report" element={<ReportPage />} />
        </Routes>

        {showForm && (
          <DiaryForm
            onClose={() => {
              console.log("❌ [App] DiaryForm closed");
              setShowForm(false);
            }}
            onSave={handleAddDiary}
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
