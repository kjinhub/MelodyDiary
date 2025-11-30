export default async function analyzeEmotion(text) {
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
            "다음 글의 주된 감정을 한 단어로 요약해줘. 가능한 값: 행복, 슬픔, 사랑, 평온, 불안, 분노 ,우울만 들어가야해 ",
        },
        { role: "user", content: text },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
