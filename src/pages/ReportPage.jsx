import React from "react";
import EmotionReport from "../components/EmotionReport";
import "../styles/pages/ReportPage.css";
import { useDiaryContext } from "../context/DiaryContext";
import { useReportData } from "../hooks/useReportData";

export default function ReportPage() {
  // 전역 컨텍스트에서 사용자 일기 데이터와 찜한 음악 가져오기
  const { favoriteSongs, diaries } = useDiaryContext();

  // 커스텀 훅: 통계용 데이터 계산 (총 일기 수, 감정 분포, 가장 많은 감정 등)
  const { recentTracks, total, emotionCounts, mostEmotion } = useReportData(
    favoriteSongs,
    diaries
  );

  // 일기가 하나도 없는 경우: 빈 상태 표시
  if (total === 0) {
    return (
      <div className="empty-report">
        <p>오늘의 일기를 저장해보세요!</p>
        <button onClick={() => (window.location.href = "/")}>
          ✏️ 새 일기 작성하기
        </button>
      </div>
    );
  }

  return (
    <div className="report-page">
      {/* 요약 섹션: 총 일기 수 / 가장 많은 감정 / 추천받은 음악 수 */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>전체 일기</h3>
          <p>{total}</p>
        </div>
        <div className="summary-card">
          <h3>가장 많은 감정</h3>
          <p>{mostEmotion}</p>
        </div>
        <div className="summary-card">
          <h3>추천받은 음악</h3>
          <p>{total * 3}</p>
        </div>
      </div>

      {/* 감정 비율 차트 섹션 (EmotionReport 컴포넌트로 시각화) */}
      <div className="charts-inline">
        <EmotionReport diaries={diaries} emotionCounts={emotionCounts} />
      </div>

      {/*  찜한 음악 갤러리: 최근 트랙 썸네일 및 정보 표시 */}
      <div className="recent-tracks-gallery">
        <h3>찜한 음악 🎧</h3>
        <div className="track-thumbnails">
          {recentTracks.map((track, i) => (
            <div
              key={i}
              className="track-item"
              // 클릭 시 Spotify Embed 링크 새 탭으로 열기
              onClick={() => window.open(track.embedUrl, "_blank")}>
              <img src={track.albumCover} alt={track.title} />
              <div className="track-info">
                <p className="track-title-text">{track.title}</p>
                <p className="track-artist-text">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
