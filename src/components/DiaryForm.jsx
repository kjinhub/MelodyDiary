import React, { useState, useRef } from "react";
import "../styles/components/DiaryForm.css";

import analyzeEmotion from "../utils/gptEmotion";
import {
  getSpotifyToken,
  searchTrack,
  getSongRecommendations,
} from "../utils/spotify";

/**
 * 🧠 DiaryForm Component
 * - 일기 작성 및 저장을 담당하는 주요 UI 폼
 * - GPT 기반 감정 분석 + Spotify 음악 추천/미리보기 기능 통합
 *
 * TEAM NOTES:
 *  - 🔹 Frontend: 파일 업로드/드래그 UI 개선 (모바일 대응)
 *  - 🔹 Backend/API: GPT 및 Spotify API 호출 시 rate limit 고려 필요
 *  - 🔹 UX: 추천 및 저장 중 로딩 피드백 개선 (spinner, skeleton 등)
 *  - 🔹 AI: 감정 분석 결과와 음악 추천 연관성 평가 필요
 */

export default function DiaryForm({ onClose, onSave }) {
  // 🧩 상태 정의 (다양한 입력 필드 및 API 상태 관리)
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [previewTrack, setPreviewTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  console.log("📂 [DiaryForm] Component rendered");
  // REVIEW: 배포 시 console.log 제거 필요 (불필요한 콘솔 출력)

  /**
   * 🖼️ handleFileRead(file)
   * - 이미지 파일을 base64로 변환하여 미리보기용으로 저장
   * - TODO(perf): 대용량 이미지 리사이즈 or 압축 로직 추가 검토
   */
  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
    console.log("🖼️ [DiaryForm] Image uploaded:", file.name);
  };

  /**
   * 🎧 handleRecommend()
   * - GPT 감정 분석 결과 기반으로 Spotify 추천 곡 목록을 불러옴
   * - REVIEW: GPT 호출 빈도 제어 로직 추가 고려 (디바운스/캐시)
   */
  const handleRecommend = async () => {
    if (!text.trim()) return alert("먼저 일기를 작성하세요.");
    setLoading(true);
    console.log("🎧 [DiaryForm] Requesting song recommendations...");

    try {
      const songList = await getSongRecommendations(text);
      setSongs(songList);
      setSelectedSong(null);
      setPreviewTrack(null);
      console.log("✅ [DiaryForm] Recommended songs received:", songList);
    } catch (err) {
      console.error("❌ [DiaryForm] Song recommendation failed:", err);
      alert("노래 추천 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ▶️ handlePreview(song)
   * - 선택된 곡의 Spotify 미리듣기 iframe 로드
   * - FIXME(perf): 연속 클릭 시 API 중복 호출 방지 로직 필요
   */
  const handlePreview = async (song) => {
    console.log("▶️ [DiaryForm] Previewing song:", song);
    try {
      setSelectedSong(song);
      setPreviewTrack(null);

      const token = await getSpotifyToken();
      const track = await searchTrack(song, token);

      if (track?.embedUrl) setPreviewTrack(track);
      console.log("🎵 [DiaryForm] Spotify track preview loaded:", track);
    } catch (err) {
      console.error("❌ [DiaryForm] Preview failed:", err);
    }
  };

  /**
   * 💾 handleSave()
   * - 작성된 일기, 감정 분석 결과, 선택된 곡 정보를 저장
   * - REVIEW(security): 사용자 입력 검증 추가 필요
   * - TODO: 저장 성공 시 애니메이션/피드백 모달 추가
   */
  const handleSave = async () => {
    if (!text || !selectedSong) return alert("일기와 노래를 선택하세요.");
    setLoading(true);
    console.log("💾 [DiaryForm] Saving diary...");

    try {
      // GPT 감정 분석 호출
      const emotion = await analyzeEmotion(text);

      // Spotify 트랙 정보 조회
      const token = await getSpotifyToken();
      const track = await searchTrack(selectedSong, token);

      // 최종 일기 데이터 구성
      const newDiary = {
        text,
        emotion,
        song: track,
        image,
        date: new Date().toISOString().slice(0, 10),
      };

      // 상위 컴포넌트로 저장 이벤트 전달
      onSave(newDiary);

      alert("일기가 저장되었습니다!");
      onClose();
      console.log("✅ [DiaryForm] Diary saved successfully:", newDiary);
    } catch (err) {
      console.error("❌ [DiaryForm] Save failed:", err);
      alert("일기 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🧩 JSX Layout
  // -------------------------------
  return (
    <div className="overlay">
      <div className="form-box">
        {/* NOTE(UI): 모달 헤더 */}
        <div className="header-container">
          <h2 className="modal-title">새로운 일기 작성</h2>
          <button className="close-button" onClick={onClose}>
            x
          </button>
        </div>

        {/* 📷 이미지 업로드 섹션 */}
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

          {/* TODO(UX): 파일 선택 버튼 커스텀 스타일링 */}
          <input
            id="fileInput"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileRead(e.target.files[0])}
            style={{ display: "none" }}
          />
        </section>

        {/* 📝 일기 텍스트 입력 */}
        <section className="text-section">
          <h3>오늘의 이야기</h3>
          <textarea
            placeholder="오늘 하루는 어땠나요?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </section>

        {/* 🎶 추천곡 섹션 */}
        <section className="song-section">
          <div className="form-actions recommend-actions">
            <button onClick={handleRecommend} disabled={loading}>
              {loading ? "추천 중..." : "🎧 곡 추천 받기"}
            </button>
          </div>

          {/* NOTE(UI): 추천 결과 버튼 리스트 */}
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

          {/* 🎵 Spotify 미리듣기 */}
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

        {/* 💾 저장/취소 영역 */}
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
