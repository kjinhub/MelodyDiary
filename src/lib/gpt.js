export async function getSongRecommendations(text, retryCount = 0) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "너는 음악 큐레이터야. 사용자의 일기 내용을 분석해서 어울리는 노래 3곡을 추천해. " +
            "출력은 반드시 JSON 배열 형식으로 해. 예시: " +
            '[{"title":"Love Story","artist":"Taylor Swift"}, {"title":"Someone Like You","artist":"Adele"}, {"title":"Perfect","artist":"Ed Sheeran"}]',
        },
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
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    console.error("GPT 응답 파싱 오류:", e);
    return [];
  }
}
