import React, { useEffect, useState, useMemo } from "react";
import EmotionReport from "../components/EmotionReport";
import "./ReportPage.css";

export default function ReportPage() {
  const [diaries, setDiaries] = useState([]);

  // 🌟 최근 3개 일기의 앨범 커버 URL 및 상세 정보를 저장할 상태
  const [recentTracks, setRecentTracks] = useState([]);

  // useMemo 검증을 위한 상태는 유지
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // 1. Local Storage에서 전체 일기 데이터 로드
    const saved = JSON.parse(localStorage.getItem("diaries") || "[]");

    if (Array.isArray(saved)) {
      setDiaries(saved);

      // 2. 🌟 최근 음악 갤러리를 위한 데이터 추출 로직 (artist, embedUrl 추가)
      const latestTracks = saved
        .slice(-3) // 배열의 뒤쪽(최근) 3개만 자르기
        .reverse() // 최신 순으로 정렬 (가장 최근이 0번 인덱스)
        .map((d) => ({
          albumCover: d.song?.albumCover,
          title: d.song?.title,
          artist: d.song?.artist, // 🌟 아티스트 추가
          embedUrl: d.song?.embedUrl, // 🌟 Spotify 링크 추가
        }));

      setRecentTracks(latestTracks);
    }
  }, []); // 마운트 시점에 한 번만 실행

  const total = diaries.length;

  // 감정 비율 계산 (useMemo 최적화)
  const emotionCounts = useMemo(() => {
    console.log("🔴 emotionCounts 복잡한 감정 비율 계산 다시 실행됨!");
    return diaries.reduce((acc, diary) => {
      acc[diary.emotion] = (acc[diary.emotion] || 0) + 1;
      return acc;
    }, {});
  }, [diaries]);

  // 가장 많은 감정 계산 (useMemo 최적화)
  const mostEmotion = useMemo(() => {
    console.log("🟠 mostEmotion 계산 다시 실행됨!");
    const entries = Object.entries(emotionCounts);
    if (entries.length === 0) return "없음";
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [emotionCounts]);

  const totalSongs = useMemo(() => total * 3, [total]);

  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  // 🌟 [추가된 함수] 앨범 클릭 시 Spotify로 이동
  const handleTrackClick = (url) => {
    if (url) {
      // 새 탭에서 Spotify 링크 열기
      window.open(url, "_blank");
    }
  };

  return (
    <div className="report-page">
      {/* 🌟 최근 음악 썸네일 갤러리 */}
      {recentTracks.length > 0 && (
        <div className="recent-tracks-gallery">
          <h3>최근 기록한 음악 🎧</h3>
          <div className="track-thumbnails">
            {recentTracks.map((track, index) => (
              // 🌟 클릭 가능한 track-item (Spotify로 이동)
              <div
                key={index}
                className="track-item"
                title={`${track.title} - ${track.artist}`}
                onClick={() => handleTrackClick(track.embedUrl)} // 🌟 클릭 이벤트 핸들러 연결
              >
                <img src={track.albumCover} alt={track.title} />
                {/* 🌟 노래 제목 및 아티스트 표시 영역 */}
                <div className="track-info">
                  <p className="track-title-text">{track.title}</p>
                  <p className="track-artist-text">{track.artist} (듣기)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🌟 상세 보기 토글 버튼 */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button onClick={handleToggleDetails} className="toggle-button">
          {showDetails ? "요약 보기 ⬆️" : "상세 통계 및 차트 보기 ⬇️"}
        </button>
      </div>

      <div className="summary-section">
        {/* ... 요약 카드들 ... */}
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
          <p>{totalSongs}</p>
        </div>
      </div>

      {/* 상세 통계 (showDetails가 true일 때만 렌더링) */}
      {showDetails && (
        <>
          <div className="charts-section">
            <div className="chart-box">
              <EmotionReport diaries={diaries} />
            </div>
          </div>

          <div className="insight-section">
            {Object.entries(emotionCounts).map(([emotion, count]) => (
              <div key={emotion} className={`insight-card ${emotion}`}>
                <h4>{emotion}</h4>
                <p>{((count / total) * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
