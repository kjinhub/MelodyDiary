import React, { useState, useRef } from "react";
import "./DiaryForm.css";

import analyzeEmotion from "../utils/gptEmotion"; // 감정 분석 (GPT)
import {
  getSpotifyToken,
  searchTrack,
  getSongRecommendations,
} from "../utils/spotify"; // Spotify 관련 함수

export default function DiaryForm({ onClose }) {
  // 사용자가 텍스트 영역에 작성하는 일기 내용 상태
  const [text, setText] = useState("");

  // 업로드된 이미지 파일의 Data URL (미리보기 및 저장용)
  const [image, setImage] = useState(null);

  // GPT로부터 추천받은 노래 목록 (title, artist 배열)
  const [songs, setSongs] = useState([]);

  // 사용자가 songs 목록 중에서 최종적으로 선택한 노래 객체
  const [selectedSong, setSelectedSong] = useState(null);

  // Spotify API를 통해 가져온 최종 미리듣기 정보 (embedUrl, title, artist, albumCover 포함)
  const [previewTrack, setPreviewTrack] = useState(null);

  // 데이터 요청(GPT, Spotify) 및 저장 시 로딩 상태 관리 (버튼 비활성화 및 UI 표시용)
  const [loading, setLoading] = useState(false);

  // '다른 곡 추천받기' 버튼 클릭 횟수 (GPT에게 다른 추천을 요청하기 위해 사용됨)
  const [retryCount, setRetryCount] = useState(0);

  // 드래그 앤 드롭 영역의 활성화 상태 (UI 피드백용)
  const [dragActive, setDragActive] = useState(false);

  // 숨겨진 파일 입력(input type="file") 요소에 접근하기 위한 참조
  const fileInputRef = useRef(null);

  // 파일
  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); // 이걸 안하면 새 탭에서 사진을 열어버림
    setDragActive(false);
    const file = e.dataTransfer.files[0]; //dataTransfer 여기에는 사용자가 드롭한 파일들이 들어있음
    // 따라서 file배열의 첫번째 값만 가져오라는뜻
    if (file && file.type.startsWith("image/")) {
      // 이미지 파일의 경우 타입이 image로 시작함
      handleFileRead(file);
    }
  };

  // GPT 노래 추천 요청
  const handleRecommend = async () => {
    if (!text.trim()) return alert("먼저 일기를 작성하세요.");
    setLoading(true);
    try {
      const songList = await getSongRecommendations(text, retryCount);
      console.log(songList);

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
      console.log("Spotify 검색 결과 (searchTrack 반환 값):", track);
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
            <span className="icon-sparkle"></span> 새로운 일기 작성
          </h2>
          <button className="close-button" onClick={onClose}>
            x{" "}
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
