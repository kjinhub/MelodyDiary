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
            "너는 음악 큐레이터야. 사용자가 쓴 일기 내용의 분위기에 어울리는 노래 제목과 가수를 3곡 추천해줘.",
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
  return data.choices[0].message.content;
}
