// ==============================
// 🔗 API 엔드포인트 정의
// ==============================
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const OPENAI_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

// ==============================
// 🎧 Spotify 액세스 토큰 요청
// ==============================
// Spotify API 요청 시 필요한 Bearer 토큰을 발급받음
// @returns {Promise<string>} 액세스 토큰 문자열
export async function getSpotifyToken() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) throw new Error("Failed to fetch Spotify token");

  const data = await response.json();
  return data.access_token;
}

// ==============================
// 🔍 Spotify 트랙 검색 함수
// ==============================
// 특정 노래 제목과 아티스트명으로 Spotify 트랙 검색
// @param {object} song - { title, artist }
// @param {string} token - Spotify 액세스 토큰
// @returns {Promise<object | null>} 트랙 메타데이터 또는 null
export async function searchTrack(song, token) {
  // Spotify 검색 쿼리 구성 (정확도 향상 위해 track + artist 병합)
  const query = `track:"${song.title}" artist:"${song.artist}"`;

  const response = await fetch(
    `${SPOTIFY_SEARCH_URL}?q=${encodeURIComponent(query)}&type=track&limit=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    console.error("Spotify Search API failed:", response.statusText);
    return null;
  }

  const data = await response.json();
  if (!data.tracks || !data.tracks.items.length) return null;

  const track = data.tracks.items[0];

  // 필요한 정보만 추출하여 반환
  return {
    title: track.name,
    artist: track.artists[0].name,
    albumCover: track.album.images[0]?.url || null,
    embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
  };
}

// ==============================
// 🧠 OpenAI 기반 추천 생성
// ==============================
// 사용자의 일기 내용을 분석해 어울리는 노래 3곡을 추천
// @param {string} text - 일기 텍스트
// @param {number} retryCount - 재시도 횟수 (결과 다양화용)
// @returns {Promise<Array<object>>} [{ title, artist }, ...]
export async function getSongRecommendations(text, retryCount = 0) {
  // OpenAI에 전달할 시스템 프롬프트 (추천 조건 명시)
  const systemContent =
    "너는 음악 큐레이터야. " +
    "사용자의 일기 내용을 **정확하게 분석하여 그 일기에 완벽하게 어울리는** 노래 3곡을 추천해. " +
    "추천 노래는 **20대와 30대가 선호하거나 잘 알만한 대중적인 곡**이어야 하며, 장르는 K-POP, 팝, R&B, 인디 음악 등 다양하게 포함하되, " +
    "주로 2000년대 후반부터 현재까지의 인기곡 중에서 선택해. " +
    "출력은 반드시 JSON 객체 형식으로 해. 노래 목록은 'recommendations'라는 키 아래의 배열에 넣어줘. " +
    '예시: {"recommendations":[{"title":"Love Story","artist":"Taylor Swift"}, {"title":"Someone Like You","artist":"Adele"}, {"title":"Perfect","artist":"Ed Sheeran"}]}';

  // OpenAI ChatCompletion API 요청
  const response = await fetch(OPENAI_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }, // JSON 응답 강제 (오류 방지)
      messages: [
        { role: "system", content: systemContent },
        {
          role: "user",
          content: `다음 글에 어울리는 노래를 ${
            retryCount + 1
          }번째로 다르게 추천해줘: ${text}`,
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error("OpenAI API Error:", data.error.message);
    return [];
  }

  try {
    // GPT 응답 내용(JSON 문자열)을 파싱
    const content = data.choices[0].message.content;
    const jsonResponse = JSON.parse(content);
    return jsonResponse.recommendations || [];
  } catch (e) {
    // JSON 파싱 실패 시 원본 로그 출력
    console.error("Failed to parse JSON response from OpenAI:", e);
    console.log("Raw GPT content:", data.choices[0].message.content);
    return [];
  }
}

// ==============================
// 🎶 전체 추천 프로세스 통합
// ==============================
// 1️⃣ OpenAI로 추천곡 3개 생성
// 2️⃣ Spotify에서 각 곡 검색하여 세부 정보(앨범 커버, 링크 등) 매칭
// 3️⃣ 최종 추천 리스트 반환
export async function getRecommendedSongsWithDetails(diaryText) {
  try {
    // Spotify 인증 토큰 획득
    const token = await getSpotifyToken();

    // OpenAI로부터 노래 추천 목록 생성
    const rawRecommendations = await getSongRecommendations(diaryText);

    if (!rawRecommendations.length) {
      console.log("OpenAI에서 추천 목록을 받지 못했습니다.");
      return [];
    }

    // 각 추천곡을 Spotify에서 검색 (병렬 처리)
    const searchPromises = rawRecommendations.map((song) =>
      searchTrack(song, token)
    );

    const detailedSongs = await Promise.all(searchPromises);
    console.log("1. detailedSongs:", detailedSongs);

    // 검색 실패(null) 항목 제거
    const finalRecommendations = detailedSongs.filter((song) => song !== null);
    console.log("2. finalRecommendations:", finalRecommendations);

    // 최종 결과 반환 [{ title, artist, albumCover, embedUrl }]
    return finalRecommendations;
  } catch (error) {
    console.error("전체 노래 추천 프로세스 오류:", error.message);
    return [];
  }
}
