// src/hooks/useReportData.js
import { useMemo } from "react";

export function useReportData(favoriteSongs, diaries) {
  // 최근 찜한 음악 3개를 최신순으로 반환
  const recentTracks = useMemo(
    () => favoriteSongs.slice(-3).reverse(),
    [favoriteSongs]
  );

  // 전체 작성된 일기 수
  const total = diaries.length;

  // 감정별 등장 횟수 집계
  const emotionCounts = useMemo(() => {
    return diaries.reduce((acc, diary) => {
      acc[diary.emotion] = (acc[diary.emotion] || 0) + 1;
      return acc;
    }, {});
  }, [diaries]);

  // 가장 많이 등장한 감정 계산
  const mostEmotion = useMemo(() => {
    const entries = Object.entries(emotionCounts);
    if (entries.length === 0) return "없음";
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [emotionCounts]);

  // 통계 데이터 반환 (리포트용)
  return { recentTracks, total, emotionCounts, mostEmotion };
}
