// Navbar_Modified.js
import React from "react";
// Link 컴포넌트를 가져옵니다.
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onNewDiary }) {

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🎶 MelodyDiary
      </Link>

      {/* 네비게이션 버튼 영역 */}
      <div className="nav-links">
        <Link to="/" className="nav-button">
          나의 일기
        </Link>
        <Link to="/report" className="nav-button">
          감정 리포트
        </Link>
      </div>
      <button className="new-btn" onClick={onNewDiary}>
        + 새 일기
      </button>
    </nav>
  );
}
