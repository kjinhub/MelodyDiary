import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DiaryList from "./pages/DiaryList";
import ReportPage from "./pages/ReportPage";
import DiaryForm from "./components/DiaryForm";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [diaries, setDiaries] = useState([]);

  // ⭐ 찜한 노래 상태
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  // 앱 시작 시 localStorage에서 불러오기
  useEffect(() => {
    const savedDiaries = JSON.parse(localStorage.getItem("diaries") || "[]");
    setDiaries(savedDiaries);

    const savedFav = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
    setFavoriteSongs(savedFav);
  }, []);

  // 일기 추가
  const handleAddDiary = (newDiary) => {
    const updated = [...diaries, newDiary];
    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
  };

  // 일기 삭제
  const handleDeleteDiary = (index) => {
    const updated = diaries.filter((_, i) => i !== index);
    setDiaries(updated);
    localStorage.setItem("diaries", JSON.stringify(updated));
  };

  // ⭐ 찜하기 처리 (상태 + localStorage)
  const handleFavoriteSong = (song) => {
    setFavoriteSongs((prev) => {
      const exists = prev.some((s) => s.embedUrl === song.embedUrl);
      if (exists) return prev;

      const updated = [...prev, song];
      localStorage.setItem("favoriteSongs", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar onNewDiary={() => setShowForm(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <DiaryList
                diaries={diaries}
                onDelete={handleDeleteDiary}
                onFavorite={handleFavoriteSong} // ⭐ 찜하기 이벤트 전달
              />
            }
          />

          <Route
            path="/report"
            element={<ReportPage favoriteSongs={favoriteSongs} />} // ⭐ 전달
          />
        </Routes>

        {/* 모달 */}
        {showForm && (
          <DiaryForm
            onClose={() => setShowForm(false)}
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
