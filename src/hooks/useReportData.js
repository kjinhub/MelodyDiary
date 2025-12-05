// src/hooks/useReportData.js
import { useMemo } from "react";

export function useReportData(favoriteSongs, diaries) {
  const recentTracks = useMemo(
    () => favoriteSongs.slice(-3).reverse(),
    [favoriteSongs]
  );
  const total = diaries.length;

  const emotionCounts = useMemo(() => {
    return diaries.reduce((acc, diary) => {
      acc[diary.emotion] = (acc[diary.emotion] || 0) + 1;
      return acc;
    }, {});
  }, [diaries]);

  const mostEmotion = useMemo(() => {
    const entries = Object.entries(emotionCounts);
    if (entries.length === 0) return "없음";
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [emotionCounts]);

  return { recentTracks, total, emotionCounts, mostEmotion };
}
