import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DiaryList from "./pages/DiaryList";
import ReportPage from "./pages/ReportPage";
import DiaryForm from "./components/DiaryForm";

export default function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Navbar onNewDiary={() => setShowForm(true)} />

        <Routes>
          <Route path="/" element={<DiaryList />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>

        {showForm && <DiaryForm onClose={() => setShowForm(false)} />}

        <footer className="footer">
          MelodyDiary · 당신의 감정을 음악으로 기록하세요 🎵
          <br />
          <small>Powered by GPT API & Spotify Embed</small>
        </footer>
      </div>
    </Router>
  );
}
