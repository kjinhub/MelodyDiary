import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DiaryList from "./pages/DiaryList";
import ReportPage from "./pages/ReportPage";
import DiaryForm from "./components/DiaryForm";
import { DiaryProvider } from "./context/DiaryContext";

export default function App() {
  // 일기 작성 폼의 표시 여부를 관리하는 상태
  const [showForm, setShowForm] = useState(false);

  return (
    // DiaryProvider로 전역 상태 관리 (Context API 사용)
    <DiaryProvider>
      <Router>
        <div className="app-container">
          {/* 네비게이션 바: 새 일기 버튼 클릭 시 폼 표시 */}
          <Navbar onNewDiary={() => setShowForm(true)} />

          {/* 라우팅 설정: 홈(일기 목록)과 리포트 페이지 */}
          <Routes>
            <Route path="/" element={<DiaryList />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>

          {/* 새 일기 작성 폼: showForm이 true일 때만 렌더링 */}
          {showForm && <DiaryForm onClose={() => setShowForm(false)} />}

          {/* 앱 하단 푸터 */}
          <footer className="footer">
            MelodyDiary · 당신의 감정을 음악으로 기록하세요 🎵
            <br />
            <small>Powered by GPT API & Spotify Embed</small>
          </footer>
        </div>
      </Router>
    </DiaryProvider>
  );
}
