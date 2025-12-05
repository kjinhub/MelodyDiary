import React, { useState, useRef } from "react";
import "../styles/components/DiaryForm.css";
import { useDiaryContext } from "../context/DiaryContext";
import analyzeEmotion from "../utils/gptEmotion";
import {
  getSpotifyToken,
  searchTrack,
  getSongRecommendations,
} from "../utils/spotify";

export default function DiaryForm({ onClose }) {
  // 전역 컨텍스트에서 일기 추가 함수 가져오기
  const { addDiary } = useDiaryContext();

  // 로컬 상태 정의
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [previewTrack, setPreviewTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // 이미지 파일을 읽어 미리보기로 표시
  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // OpenAI 기반으로 일기 내용에서 추천 곡 요청
  const handleRecommend = async () => {
    if (!text.trim()) return alert("먼저 일기를 작성하세요.");
    setLoading(true);
    try {
      const songList = await getSongRecommendations(text);
      setSongs(songList);
      setSelectedSong(null);
      setPreviewTrack(null);
    } catch {
      alert("노래 추천 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 선택한 노래를 Spotify에서 미리듣기 로드
  const handlePreview = async (song) => {
    try {
      setSelectedSong(song);
      setPreviewTrack(null);
      const token = await getSpotifyToken();
      const track = await searchTrack(song, token);
      if (track?.embedUrl) setPreviewTrack(track);
    } catch {
      console.error("미리듣기 실패");
    }
  };

  // 일기와 선택된 노래를 저장
  const handleSave = async () => {
    if (!text || !selectedSong) return alert("일기와 노래를 선택하세요.");
    setLoading(true);
    try {
      const emotion = await analyzeEmotion(text);
      const token = await getSpotifyToken();
      const track = await searchTrack(selectedSong, token);

      const newDiary = {
        id: crypto.randomUUID(),
        text,
        emotion,
        song: track,
        image,
        date: new Date().toISOString().slice(0, 10),
      };

      addDiary(newDiary);
      alert("일기가 저장되었습니다!");
      onClose();
    } catch {
      alert("일기 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="form-box"
        onClick={(e) => e.stopPropagation()} // 배경 클릭 시 닫힘 방지
      >
        {/* 헤더 영역 */}
        <div className="header-container">
          <h2 className="modal-title">새로운 일기 작성</h2>
          <button className="close-button" onClick={onClose}>
            x
          </button>
        </div>

        {/* 사진 업로드 영역 */}
        <section className="photo-section">
          <h3>오늘의 사진</h3>
          <label
            htmlFor="fileInput"
            className={`photo-upload ${dragActive ? "active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("image/")) handleFileRead(file);
            }}>
            {image ? (
              <img src={image} alt="preview" />
            ) : (
              <div>📷 사진 업로드</div>
            )}
          </label>

          <input
            id="fileInput"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileRead(e.target.files[0])}
            style={{ display: "none" }}
          />
        </section>

        {/* 일기 작성 영역 */}
        <section className="text-section">
          <h3>오늘의 이야기</h3>
          <textarea
            placeholder="오늘 하루는 어땠나요?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </section>

        {/* 노래 추천 영역 */}
        <section className="song-section">
          <div className="form-actions recommend-actions">
            <button onClick={handleRecommend} disabled={loading}>
              {loading ? "추천 중..." : "🎧 곡 추천 받기"}
            </button>
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

          {/* 미리듣기 플레이어 */}
          {previewTrack && (
            <div className="preview-player">
              <p>
                🎧 {previewTrack.title} — {previewTrack.artist}
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

        {/* 저장 및 취소 버튼 */}
        <div className="final-action-block">
          <button onClick={handleSave} disabled={!selectedSong || loading}>
            {loading ? "저장 중..." : "일기 저장하기"}
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
