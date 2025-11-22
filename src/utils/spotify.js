// constants.js 또는 config.js 파일에 해당 URL을 정의하는 것이 좋습니다.
// 아래 URL은 예시이며 실제 Spotify API 엔드포인트와는 다릅니다.

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const OPENAI_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Spotify API 접근을 위한 인증 토큰을 가져옵니다.
 *
 * @returns {Promise<string>} Spotify 액세스 토큰
 */
export async function getSpotifyToken() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // Base64 인코딩된 클라이언트 ID와 시크릿을 Authorization 헤더에 포함
      Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Spotify token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Spotify에서 특정 트랙을 검색합니다.
 *
 * @param {object} song - 노래 정보 {title: string, artist: string}
 * @param {string} token - Spotify 액세스 토큰
 * @returns {Promise<object | null>} 검색된 트랙 정보 또는 검색 실패 시 null
 */
export async function searchTrack(song, token) {
  // 제목과 아티스트를 정확히 검색하는 쿼리 생성
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

  // 검색 결과가 없으면 null 반환
  if (!data.tracks || !data.tracks.items.length) {
    return null;
  }

  const track = data.tracks.items[0];

  return {
    title: track.name,
    artist: track.artists[0].name,
    // 가장 큰 이미지 URL을 사용합니다. 이미지가 없을 수도 있으니 확인합니다.
    albumCover: track.album.images[0]?.url || null,
    embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
  };
}

/**
 * OpenAI GPT를 사용하여 사용자 텍스트에 기반한 노래를 추천받습니다.
 * 응답 형식을 JSON으로 강제하여 파싱 오류를 줄였습니다.
 *
 * @param {string} text - 사용자의 일기 내용
 * @param {number} retryCount - 재시도 횟수
 * @returns {Promise<Array<object>>} 추천 노래 목록
 */
export async function getSongRecommendations(text, retryCount = 0) {
  const systemContent =
    "너는 음악 큐레이터야. " +
    "사용자의 일기 내용을 **정확하게 분석하여 그 일기에 완벽하게 어울리는** 노래 3곡을 추천해. " +
    "추천 노래는 **20대와 30대가 선호하거나 잘 알만한 대중적인 곡**이어야 하며, 장르는 K-POP, 팝, R&B, 인디 음악 등 다양하게 포함하되, 주로 2000년대 후반부터 현재까지의 인기곡 중에서 선택해. " +
    "출력은 반드시 JSON 객체 형식으로 해. 노래 목록은 'recommendations'라는 키 아래의 배열에 넣어줘. " +
    '예시: {"recommendations":[{"title":"Love Story","artist":"Taylor Swift"}, {"title":"Someone Like You","artist":"Adele"}, {"title":"Perfect","artist":"Ed Sheeran"}]}';

  // 참고: 강조된 부분(**)이 추가되거나 수정된 부분입니다.

  const response = await fetch(OPENAI_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      // JSON 출력 형식 강제 (최신 API 권장 방식)
      response_format: { type: "json_object" },
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

  // API 호출 자체에 오류가 있을 경우 빈 배열 반환
  if (data.error) {
    console.error("OpenAI API Error:", data.error.message);
    return [];
  }

  try {
    const content = data.choices[0].message.content;
    const jsonResponse = JSON.parse(content);

    // recommendations 키의 배열을 반환
    // GPT가 만약 3곡이 아닌 1-2곡만 포함한 유효한 JSON을 주면, 그 개수만큼 반환됩니다.
    return jsonResponse.recommendations || [];
  } catch (e) {
    // JSON.parse 실패 시 (매우 드물게 발생 가능)
    console.error("Failed to parse JSON response from OpenAI:", e);
    console.log("Raw GPT content:", data.choices[0].message.content);
    return [];
  }
}

/**
 * 전체 추천 프로세스를 실행하는 메인 함수 (예시)
 * @param {string} diaryText - 일기 내용
 * @returns {Promise<Array<object>>} Spotify 정보가 포함된 추천 노래 목록
 */
export async function getRecommendedSongsWithDetails(diaryText) {
  try {
    // 1. 토큰 가져오기
    const token = await getSpotifyToken();

    // 2. OpenAI로부터 추천 목록 (title, artist) 가져오기
    const rawRecommendations = await getSongRecommendations(diaryText);

    if (!rawRecommendations.length) {
      console.log("OpenAI에서 추천 목록을 받지 못했습니다.");
      return [];
    }

    // 3. 각 추천곡을 Spotify에서 검색하여 상세 정보(albumCover, embedUrl) 가져오기
    const searchPromises = rawRecommendations.map((song) =>
      searchTrack(song, token)
    );

    // 모든 검색을 병렬로 처리
    const detailedSongs = await Promise.all(searchPromises);

    // 4. Spotify에서 검색에 성공한 트랙만 필터링 (null이 아닌 트랙)
    const finalRecommendations = detailedSongs.filter((song) => song !== null);

    // 최종적으로 이 배열의 개수가 3개 미만일 수 있습니다.
    return finalRecommendations;
  } catch (error) {
    console.error("전체 노래 추천 프로세스 오류:", error.message);
    return [];
  }
}
