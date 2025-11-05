import React, { useState, useRef } from "react";
import "./DiaryForm.css";

// 실제 API 함수 import
import analyzeEmotion from "../utils/gptEmotion"; // 감정 분석 (GPT)
import {
  getSpotifyToken,
  searchTrack,
  getSongRecommendations,
} from "../utils/spotify"; // Spotify 관련 함수

export default function DiaryForm({ onClose }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [previewTrack, setPreviewTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // 파일 읽기
  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // 파일 선택
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) handleFileRead(file);
  };

  // 드래그 앤 드롭
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFileRead(file);
  };

  // GPT 노래 추천 요청
  const handleRecommend = async () => {
    if (!text.trim()) return alert("먼저 일기를 작성하세요.");
    setLoading(true);
    try {
      const songList = await getSongRecommendations(text, retryCount);
      setSongs(songList);
      setSelectedSong(null);
      setPreviewTrack(null);
    } catch (err) {
      console.error("추천 실패:", err);
      alert("노래 추천 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 다른 곡 추천
  const handleRetry = async () => {
    setRetryCount((prev) => prev + 1);
    await handleRecommend();
  };

  // 곡 미리듣기
  const handlePreview = async (song) => {
    try {
      setSelectedSong(song);
      setPreviewTrack(null);
      const token = await getSpotifyToken();
      const track = await searchTrack(song, token);
      if (track?.embedUrl) setPreviewTrack(track);
    } catch (err) {
      console.error("미리듣기 오류:", err);
      alert("Spotify에서 노래를 불러올 수 없습니다.");
    }
  };

  // 일기 저장
  const handleSave = async () => {
    if (!text || !selectedSong) return alert("일기와 노래를 선택하세요.");
    setLoading(true);
    try {
      const emotion = await analyzeEmotion(text);
      const token = await getSpotifyToken();
      const track = await searchTrack(selectedSong, token);

      const newDiary = {
        text,
        emotion,
        song: track,
        image,
        date: new Date().toISOString().slice(0, 10),
      };

      const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
      diaries.push(newDiary);
      localStorage.setItem("diaries", JSON.stringify(diaries));

      alert("일기가 저장되었습니다!");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("저장 실패:", err);
      alert("일기 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="form-box">
        {/* 상단 헤더 */}
        <div className="header-container">
          <h2 className="modal-title">
            <span className="icon-sparkle">✨</span> 새로운 일기 작성
          </h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* 오늘의 사진 */}
        <section className="photo-section">
          <h3 className="section-title">오늘의 사진</h3>
          <label
            htmlFor="fileInput"
            className={`photo-upload ${dragActive ? "active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            {image ? (
              <img src={image} alt="preview" />
            ) : (
              <div className="photo-placeholder">
                <span className="photo-icon">📷</span>
                <div>사진을 업로드하세요</div>
              </div>
            )}
          </label>
          <input
            id="fileInput"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </section>

        {/* 오늘의 이야기 */}
        <section className="text-section">
          <h3 className="section-title">오늘의 이야기</h3>
          <textarea
            placeholder="오늘 하루는 어땠나요? 감정과 이야기를 자유롭게 적어보세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </section>

        {/* 노래 추천 */}
        <section className="song-section">
          <div className="form-actions recommend-actions">
            <button
              onClick={handleRecommend}
              disabled={loading}
              className="secondary-button">
              {loading ? "추천 중..." : "🎧 곡 추천 받기"}
            </button>
            {songs.length > 0 && (
              <button
                onClick={handleRetry}
                disabled={loading}
                className="secondary-button">
                🔁 다른 곡 추천받기
              </button>
            )}
          </div>

          {songs.length > 0 && (
            <div className="song-choice">
              {songs.map((s, i) => (
                <button
                  key={i}
                  className={selectedSong === s ? "selected" : ""}
                  onClick={() => handlePreview(s)}>
                  ▶ {s.title} — {s.artist}
                </button>
              ))}
            </div>
          )}

          {previewTrack && (
            <div className="preview-player">
              <p>
                🎧 미리듣기: {previewTrack.title} — {previewTrack.artist}
              </p>
              <iframe
                title={previewTrack.title}
                src={previewTrack.embedUrl}
                width="100%"
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            </div>
          )}
        </section>

        {/* 저장 / 취소 */}
        <div className="final-action-block">
          <button
            onClick={handleSave}
            disabled={!selectedSong || loading}
            className="primary-button">
            {loading ? "저장 중..." : "일기 저장하기"}
          </button>
          <button onClick={onClose} className="cancel-text-button">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
