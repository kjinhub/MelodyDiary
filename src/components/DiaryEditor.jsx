import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { getSpotifyToken, searchTrack } from "../lib/spotify";
import { getSongRecommendations } from "../lib/gpt";
import "./DiaryEditor.css";

function DiaryEditor({ onAdd }) {
  const [text, setText] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // ✅ GPT에게 노래 추천 요청
  const handleRecommend = async (isRetry = false) => {
    if (!text) return alert("일기 내용을 먼저 입력하세요!");
    setLoading(true);

    if (isRetry) {
      setRecommendations([]);
      setRetryCount((prev) => prev + 1);
    }

    try {
      const result = await getSongRecommendations(text);
      const list = result
        .split("\n")
        .filter((line) => line.trim())
        .slice(0, 3); // 최대 3곡
      setRecommendations(list);
    } catch (error) {
      console.error(error);
      alert("GPT 추천 요청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Spotify 검색 + 자동 추가
  const handleSelect = async (title) => {
    const token = await getSpotifyToken();
    const track = await searchTrack(title, token);
    if (!track) return alert("Spotify에서 곡을 찾을 수 없습니다.");

    onAdd({
      id: Date.now(),
      text,
      imgUrl,
      musicUrl: track.embedUrl,
      date: new Date().toLocaleDateString(),
    });

    setText("");
    setImgUrl(null);
    setRecommendations([]);
    setRetryCount(0);
  };

  return (
    <div className="editor">
      <ImageUploader onUpload={setImgUrl} />

      <textarea
        placeholder="오늘의 감정을 기록해보세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="recommend-btn"
        onClick={() => handleRecommend(false)}
        disabled={loading}>
        {loading ? "추천 중..." : "🎧 GPT로 노래 추천받기"}
      </button>

      {recommendations.length > 0 && (
        <div className="recommend-box">
          <p>🎵 추천곡 목록</p>

          {recommendations.map((r, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(r)}
              className="song-btn">
              {r}
            </button>
          ))}

          <button
            className="retry-btn"
            onClick={() => handleRecommend(true)}
            disabled={loading}>
            🔄 다른 추천곡 보기
          </button>
        </div>
      )}
    </div>
  );
}

export default DiaryEditor;
