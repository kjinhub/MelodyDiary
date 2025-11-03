import React, { useState } from "react";
import analyzeEmotion from "../utils/gptEmotion";
import {
  getSpotifyToken,
  getSongRecommendations,
  searchTrack,
} from "../utils/spotify";

export default function DiaryForm({ onClose }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const emotion = await analyzeEmotion(text);
      const songs = await getSongRecommendations(text);
      const token = await getSpotifyToken();

      console.log("Recommended songs:", songs);
      console.log("Emotion detected:", emotion);
      console.log("Spotify token:", token);

      const track = songs.length ? await searchTrack(songs[0], token) : null;

      const newDiary = {
        text,
        emotion,
        song: track || null,
        date: new Date().toISOString().slice(0, 10),
      };

      const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
      diaries.push(newDiary);
      localStorage.setItem("diaries", JSON.stringify(diaries));
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
    onClose();
    window.location.reload();
  }

  return (
    <div className="overlay">
      <div className="form-box">
        <h2>새 일기 작성</h2>
        <textarea
          placeholder="오늘의 감정을 적어보세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="form-actions">
          <button onClick={onClose}>취소</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "GPT 분석 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
