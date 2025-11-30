import React, { useState, useRef } from "react"; // React 훅 가져오기 (상태관리, 참조)
import "./DiaryForm.css"; // CSS 스타일 불러오기

// GPT 감정 분석 함수
import analyzeEmotion from "../utils/gptEmotion";
// Spotify 관련 API 유틸 함수
import {
  getSpotifyToken,
  searchTrack,
  getSongRecommendations,
} from "../utils/spotify";

// DiaryForm 컴포넌트 — 일기 작성 및 노래 추천 폼
export default function DiaryForm({ onClose, onSave }) {
  // 일기 본문 텍스트 상태
  const [text, setText] = useState("");
  // 업로드된 이미지 (base64 URL)
  const [image, setImage] = useState(null);
  // 추천받은 노래 목록
  const [songs, setSongs] = useState([]);
  // 사용자가 선택한 노래
  const [selectedSong, setSelectedSong] = useState(null);
  // Spotify 미리듣기 트랙 정보
  const [previewTrack, setPreviewTrack] = useState(null);
  // 로딩 상태 (API 요청 중일 때 true)
  const [loading, setLoading] = useState(false);
  // 노래 추천 재시도 횟수
  const [retryCount, setRetryCount] = useState(0);
  // 드래그 상태 (이미지 드래그 중인지 여부)
  const [dragActive, setDragActive] = useState(false);
  // 숨겨진 <input type="file" /> 요소 제어용 참조
  const fileInputRef = useRef(null);

  console.log("📂 [DiaryForm] Component rendered"); // 디버깅 로그

  // 이미지 파일을 읽고 미리보기로 표시하는 함수
  const handleFileRead = (file) => {
    const reader = new FileReader(); // 브라우저 내장 파일 리더 생성
    reader.onload = () => setImage(reader.result); // 읽기가 완료되면 base64 데이터 저장
    reader.readAsDataURL(file); // 파일을 base64 형식으로 읽기
    console.log("🖼️ [DiaryForm] Image uploaded:", file.name);
  };

  // GPT를 통해 노래 추천 요청
  const handleRecommend = async () => {
    if (!text.trim()) return alert("먼저 일기를 작성하세요."); // 일기 내용이 비었으면 중단
    setLoading(true); // 로딩 시작
    console.log("🎧 [DiaryForm] Requesting song recommendations...");

    try {
      // GPT 기반 추천 함수 호출 (일기 내용 + 재시도 횟수)
      const songList = await getSongRecommendations(text, retryCount);
      setSongs(songList); // 추천받은 노래 목록 저장
      setSelectedSong(null); // 이전 선택 초기화
      setPreviewTrack(null); // 미리듣기 초기화
      console.log("✅ [DiaryForm] Recommended songs received:", songList);
    } catch (err) {
      console.error("❌ [DiaryForm] Song recommendation failed:", err);
      alert("노래 추천 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // Spotify에서 선택한 노래 미리듣기
  const handlePreview = async (song) => {
    console.log("▶️ [DiaryForm] Previewing song:", song);
    try {
      setSelectedSong(song); // 선택한 노래 저장
      setPreviewTrack(null); // 기존 미리듣기 초기화

      const token = await getSpotifyToken(); // Spotify API 접근 토큰 발급
      const track = await searchTrack(song, token); // 노래 정보 검색 (Spotify에서)

      if (track?.embedUrl) setPreviewTrack(track); // 미리듣기 URL 있으면 iframe 표시
      console.log("🎵 [DiaryForm] Spotify track preview loaded:", track);
    } catch (err) {
      console.error("❌ [DiaryForm] Preview failed:", err);
    }
  };

  // 일기 저장 기능
  const handleSave = async () => {
    if (!text || !selectedSong) return alert("일기와 노래를 선택하세요."); // 필수 조건 확인
    setLoading(true);
    console.log("💾 [DiaryForm] Saving diary...");

    try {
      // GPT 감정 분석
      const emotion = await analyzeEmotion(text);
      // Spotify 토큰 발급 및 노래 정보 검색
      const token = await getSpotifyToken();
      const track = await searchTrack(selectedSong, token);

      // 새 일기 객체 생성
      const newDiary = {
        text, // 작성한 일기
        emotion, // GPT 감정 결과
        song: track, // Spotify 노래 정보
        image, // 업로드된 이미지
        date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD 형식의 날짜
      };

      // 부모(App) 컴포넌트의 onSave 함수로 전달
      onSave(newDiary);

      alert("일기가 저장되었습니다!");
      onClose(); // 모달 닫기
      console.log("✅ [DiaryForm] Diary saved successfully:", newDiary);
    } catch (err) {
      console.error("❌ [DiaryForm] Save failed:", err);
      alert("일기 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 🖼️ UI 구성 (JSX)
  return (
    <div className="overlay">
      {" "}
      {/* 모달 배경 */}
      <div className="form-box">
        {" "}
        {/* 폼 박스 전체 */}
        {/* 상단 헤더 영역 */}
        <div className="header-container">
          <h2 className="modal-title">새로운 일기 작성</h2>
          <button className="close-button" onClick={onClose}>
            x
          </button>{" "}
          {/* 닫기 버튼 */}
        </div>
        {/* 이미지 업로드 구역 */}
        <section className="photo-section">
          <h3>오늘의 사진</h3>
          <label
            htmlFor="fileInput"
            className={`photo-upload ${dragActive ? "active" : ""}`} // 드래그 중 시각 효과
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
            {/* 이미지가 있으면 미리보기, 없으면 안내 문구 */}
            {image ? (
              <img src={image} alt="preview" />
            ) : (
              <div>📷 사진 업로드</div>
            )}
          </label>

          {/* 실제 파일 업로드 input (숨김 처리) */}
          <input
            id="fileInput"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileRead(e.target.files[0])}
            style={{ display: "none" }}
          />
        </section>
        {/* 일기 내용 입력 */}
        <section className="text-section">
          <h3>오늘의 이야기</h3>
          <textarea
            placeholder="오늘 하루는 어땠나요?"
            value={text}
            onChange={(e) => setText(e.target.value)} // 입력값 업데이트
          />
        </section>
        {/* 노래 추천 영역 */}
        <section className="song-section">
          <div className="form-actions recommend-actions">
            {/* GPT 추천 버튼 */}
            <button onClick={handleRecommend} disabled={loading}>
              {loading ? "추천 중..." : "🎧 곡 추천 받기"}
            </button>

            {/* 이미 노래가 있으면 재추천 버튼 표시 */}
            {songs.length > 0 && (
              <button
                onClick={() => {
                  setRetryCount((r) => r + 1);
                  handleRecommend();
                  console.log("🔁 [DiaryForm] Retrying recommendation...");
                }}
                disabled={loading}>
                🔁 다른 곡 추천받기
              </button>
            )}
          </div>

          {/* 추천된 노래 목록 출력 */}
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

          {/* Spotify 미리듣기 플레이어 */}
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
        {/* 저장 / 취소 버튼 */}
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
