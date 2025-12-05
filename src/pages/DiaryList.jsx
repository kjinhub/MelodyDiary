import React from "react";
import DiaryCard from "../components/DiaryCard";
import "../styles/pages/DiaryList.css";
import { useDiaryContext } from "../context/DiaryContext";

export default function DiaryList() {
  // 📂 전역 컨텍스트에서 일기 데이터 및 제어 함수들 가져오기
  const { diaries, deleteDiary, toggleFavorite } = useDiaryContext();

  // 🚨 예외 처리: diaries가 배열 형태가 아닐 경우
  if (!Array.isArray(diaries)) return <p>데이터 오류 발생</p>;

  return (
    <div className="diary-list">
      {/* 📝 작성된 일기가 없을 경우 안내 메시지 출력 */}
      {diaries.length === 0 ? (
        <p className="empty">아직 작성된 일기가 없습니다.</p>
      ) : (
        // 📚 최신 일기가 위로 오도록 reverse() 후 DiaryCard 컴포넌트로 렌더링
        diaries
          .slice() // 원본 배열 변형 방지용 얕은 복사
          .reverse()
          .map((d) => (
            <DiaryCard
              key={d.id} // ✅ React 렌더링 안정성 확보 (id 기반 key)
              diary={d} // 개별 일기 데이터 전달
              onDelete={() => deleteDiary(d.id)} // ✅ 일기 삭제 이벤트 핸들러
              onFavorite={toggleFavorite} // ❤️ 즐겨찾기(찜) 토글
            />
          ))
      )}
    </div>
  );
}
