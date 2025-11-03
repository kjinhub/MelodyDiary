import React, { useState } from "react";
import Navbar from "./components/Navbar";
import DiaryList from "./pages/DiaryList";
import ReportPage from "./pages/ReportPage";
import DiaryForm from "./components/DiaryForm";

export default function App() {
  const [page, setPage] = useState("diary");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="app-container">
      <Navbar onNavigate={setPage} onNewDiary={() => setShowForm(true)} />
      {page === "diary" ? <DiaryList /> : <ReportPage />}
      {showForm && <DiaryForm onClose={() => setShowForm(false)} />}
      <footer className="footer">
        MelodyDiary · 당신의 감정을 음악으로 기록하세요 🎵
        <br />
        <small>Powered by GPT API & Spotify Embed</small>
      </footer>
    </div>
  );
}
