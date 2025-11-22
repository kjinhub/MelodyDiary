import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onNewDiary }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* 로고 */}
      <div className="logo" onClick={() => navigate("/")}>
        🎶 MelodyDiary
      </div>

      {/* 네비게이션 버튼 영역 */}
      <div className="nav-links">
        <button onClick={() => navigate("/")}>나의 일기</button>
        <button onClick={() => navigate("/report")}>감정 리포트</button>
      </div>

      {/* 새 일기 작성 버튼 */}
      <button className="new-btn" onClick={onNewDiary}>
        + 새 일기
      </button>
    </nav>
  );
}
