// Navbar_Modified.js
import React from "react";
// Link 컴포넌트를 가져옵니다.
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onNewDiary }) {
  // 🌟 useNavigate를 사용할 필요가 없어집니다!

  return (
    <nav className="navbar">
      {/* 로고: 로직 없이 이동하므로 Link 사용이 적합하지만, onClick 이벤트가 필요하다면 navigate도 가능 */}
      {/* 여기서는 단순 이동이므로 Link 사용 예시로 변경 */}
      <Link to="/" className="logo">
        🎶 MelodyDiary
      </Link>

      {/* 네비게이션 버튼 영역 */}
      <div className="nav-links">
        {/* 🌟 1. 단순 페이지 이동이므로 Link 사용 */}
        {/* to 속성만 지정하면 끝! */}
        <Link to="/" className="nav-button">
          나의 일기
        </Link>
        <Link to="/report" className="nav-button">
          감정 리포트
        </Link>
      </div>

      {/* 새 일기 작성 버튼: 페이지 이동이 아닌, 상태 변경 로직이 있으므로 button 사용 (정상) */}
      <button className="new-btn" onClick={onNewDiary}>
        + 새 일기
      </button>
    </nav>
  );
}
