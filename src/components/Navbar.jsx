import React from "react";
import "./Navbar.css";
export default function Navbar({ onNavigate, onNewDiary }) {
  return (
    <nav className="navbar">
      <div className="logo">🎶 MelodyDiary</div>
      <div className="nav-links">
        <button onClick={() => onNavigate("diary")}>나의 일기</button>
        <button onClick={() => onNavigate("report")}>감정 리포트</button>
      </div>
      <button className="new-btn" onClick={onNewDiary}>
        + 새 일기
      </button>
    </nav>
  );
}
