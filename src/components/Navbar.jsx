// Navbar_Modified.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/Navbar.css";

export default function Navbar({ onNewDiary }) {
  return (
    <nav className="navbar">
      {/* 로고 클릭 시 홈("/")으로 이동 */}
      <Link to="/" className="logo">
        🎶 MelodyDiary
      </Link>

      {/* 주요 네비게이션 메뉴 */}
      <div className="nav-links">
        {/* 일기 목록 페이지로 이동 */}
        <Link to="/" className="nav-button">
          나의 일기
        </Link>
        {/* 감정 리포트 페이지로 이동 */}
        <Link to="/report" className="nav-button">
          감정 리포트
        </Link>
      </div>

      {/* 새 일기 작성 버튼: 클릭 시 일기 작성 폼 열림 */}
      <button className="new-btn" onClick={onNewDiary}>
        + 새 일기
      </button>
    </nav>
  );
}
