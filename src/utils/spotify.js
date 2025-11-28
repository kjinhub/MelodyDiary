const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const OPENAI_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
// @returns {Promise<string>}
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
  if (!response.ok) {
    throw new Error("Failed to fetch Spotify token");
  }
  const data = await response.json();
  return data.access_token;
}
//  Spotify에서 특정 트랙을 검색합니다.
//  @param {object} song - 노래 정보 {title: string, artist: string}
//  @param {string} token - Spotify 액세스 토큰
//  @returns {Promise<object | null>} 검색된 트랙 정보 또는 검색 실패 시 null

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
  if (!data.tracks || !data.tracks.items.length) {
    return null;
  }
  const track = data.tracks.items[0];
  return {
    title: track.name,
    artist: track.artists[0].name,
    albumCover: track.album.images[0]?.url || null,
    embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
  };
}
//  @param {string} text - 사용자의 일기 내용
//  @param {number} retryCount - 재시도 횟수
//  @returns {Promise<Array<object>>} 추천 노래 목록
export async function getSongRecommendations(text, retryCount = 0) {
  const systemContent =
    "너는 음악 큐레이터야. " +
    "사용자의 일기 내용을 **정확하게 분석하여 그 일기에 완벽하게 어울리는** 노래 3곡을 추천해. " +
    "추천 노래는 **20대와 30대가 선호하거나 잘 알만한 대중적인 곡**이어야 하며, 장르는 K-POP, 팝, R&B, 인디 음악 등 다양하게 포함하되, 주로 2000년대 후반부터 현재까지의 인기곡 중에서 선택해. " +
    "출력은 반드시 JSON 객체 형식으로 해. 노래 목록은 'recommendations'라는 키 아래의 배열에 넣어줘. " +
    '예시: {"recommendations":[{"title":"Love Story","artist":"Taylor Swift"}, {"title":"Someone Like You","artist":"Adele"}, {"title":"Perfect","artist":"Ed Sheeran"}]}';
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
  if (data.error) {
    console.error("OpenAI API Error:", data.error.message);
    return [];
  }
  try {
    const content = data.choices[0].message.content;
    const jsonResponse = JSON.parse(content);

    return jsonResponse.recommendations || [];
  } catch (e) {
    console.error("Failed to parse JSON response from OpenAI:", e);
    console.log("Raw GPT content:", data.choices[0].message.content);
    return [];
  }
}

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

    return finalRecommendations;
  } catch (error) {
    console.error("전체 노래 추천 프로세스 오류:", error.message);
    return [];
  }
}
