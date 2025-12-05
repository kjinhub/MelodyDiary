import React from "react";
import "../styles/components/DiaryDetailModal.css";

/**
 * 📘 DiaryDetailModal Component
 * - 일기 카드 클릭 시 표시되는 상세 모달
 * - 이미지, 텍스트, 음악 임베드 정보를 포함
 *
 * @prop {Object} diary - 일기 데이터 (date, image, text, song 등)
 * @prop {Function} onClose - 모달 닫기 핸들러
 *
 * TEAM NOTES:
 *  - UI 담당: 스타일링(CSS/모달 애니메이션) 보완 필요
 *  - UX 담당: 모달 접근성 개선 필요 (ESC 키로 닫기 등)
 *  - QA 담당: 외부 embed URL 보안 검증 필요
 */

export default function DiaryDetailModal({ diary, onClose }) {
  console.log(diary);
  // REVIEW(debug): 배포 전 console.log 제거 필요 (개인 정보 노출 방지)

  return (
    // 🧱 모달 오버레이 (배경 클릭 시 닫힘)
    // TODO(UX): 클릭 외에도 ESC 키로 닫기 기능 추가
    <div className="overlay" onClick={onClose}>
      {/* NOTE(UI): 이벤트 버블링 방지로 내부 클릭 시 모달 닫힘 방지 */}
      <div className="form-box" onClick={(e) => e.stopPropagation()}>
        {/* 💬 일기 작성 날짜 */}
        {/* TODO(i18n): 날짜 포맷 로컬라이징 필요 */}
        <h2>{diary.date}</h2>

        {/* NOTE(UI): 이미지 렌더링 */}
        {/* REVIEW(perf): lazy loading 적용 검토 */}
        {diary.image && (
          <img
            src={diary.image}
            alt="img"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        )}

        {/* 📓 일기 본문 */}
        {/* TODO(style): 긴 텍스트 overflow 처리 (scroll 추가 고려) */}
        <p>{diary.text}</p>

        {/* 🎧 음악 섹션 */}
        {diary.song && (
          <>
            {/* NOTE(UI): 음악 정보 표시 */}
            {/* REVIEW(content): 길이 긴 제목/아티스트 줄바꿈 처리 필요 */}
            <p style={{ fontSize: "0.9em", color: "#555" }}>
              🎧 {diary.song.title} — {diary.song.artist}
            </p>

            {/* 💬 음악 재생 iframe */}
            {/* FIXME(security): embedUrl 검증 로직 필요 (XSS 방지) */}
            <iframe
              title={diary.song.title}
              src={diary.song.embedUrl}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </>
        )}

        {/* 🧩 닫기 버튼 */}
        {/* REVIEW(accessibility): <button> 대신 <Dialog> 구조 적용 시 더 적합 */}
        <button className="bottom-close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
