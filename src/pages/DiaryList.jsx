import React from "react";
import DiaryCard from "../components/DiaryCard";
import "../styles/pages/DiaryList.css";

/**
 * 📒 DiaryList Component
 * - 일기 목록을 렌더링하며 각 DiaryCard로 위임
 * - 역순 정렬(최신 일기 우선), 삭제/즐겨찾기 기능 연동
 *
 * TEAM NOTES:
 *  - Frontend: 렌더링 최적화 필요 (React.memo or virtualization)
 *  - Data: diaries 배열 구조 및 키 안정성 확인
 *  - UX: 비어 있는 상태(Empty State) 시 애니메이션 추가 검토
 *  - QA: 삭제/즐겨찾기 이벤트 전파 정상 작동 여부 테스트 필요
 */

export default function DiaryList({ diaries, onDelete, onFavorite }) {
  // 🚨 데이터 유효성 검사
  // FIXME(data): diaries가 비동기 로드 중 null일 수 있으므로 로딩 처리 고려
  if (!Array.isArray(diaries)) return <p>데이터 오류 발생</p>;

  return (
    <div className="diary-list">
      {/* 🪶 비어 있는 상태 처리 */}
      {/* REVIEW(UX): 일기 없음 상태 시 일러스트 또는 CTA 버튼 추가 */}
      {diaries.length === 0 ? (
        <p className="empty">아직 작성된 일기가 없습니다.</p>
      ) : (
        // NOTE(UI): 최신 순 정렬을 위해 reverse() 사용
        // TODO(perf): 대규모 데이터 시 useMemo() 적용 고려
        diaries
          .slice()
          .reverse()
          .map((d, i) => (
            <DiaryCard
              key={i} // REVIEW: index 대신 고유 ID 사용 권장 (데이터 재정렬 시 리렌더 방지)
              diary={d}
              onDelete={() => onDelete(i)}
              onFavorite={onFavorite} // ⭐ DiaryCard에 즐겨찾기 이벤트 전달
            />
          ))
      )}
    </div>
  );
}
