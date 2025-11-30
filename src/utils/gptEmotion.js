export default async function analyzeEmotion(text) {
  const allowedEmotions = [
    "행복",
    "슬픔",
    "사랑",
    "평온",
    "불안",
    "분노",
    "우울",
  ];

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
            "다음 글의 주된 감정을 한 단어로 ONLY 반환해줘. 반드시 아래 중 하나만 답해:\n행복, 슬픔, 사랑, 평온, 불안, 분노, 우울",
        },
        { role: "user", content: text },
      ],
    }),
  });

  // 1) JSON 파싱
  const data = await response.json();

  // 2) 모델의 결과값
  const raw = data?.choices?.[0]?.message?.content?.trim() ?? "";

  // 3) 유효성 검증
  const emotion = allowedEmotions.includes(raw) ? raw : "기타";

  return emotion;
}
