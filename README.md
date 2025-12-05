<div align="center">

# 🎵 MelodyDiary (멜로디 다이어리)

> **"하루의 감정을 음악으로 기록하는 감성 일기장"**

AI가 일기 내용을 분석해 어울리는 음악을 추천하고, Spotify에서 바로 들어볼 수 있는 React 기반 웹앱입니다.

---

### 🧩 Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Spotify](https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7E018?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

## 🌈 Preview

| GPT 추천 + 일기 작성 화면  | Spotify 미리듣기 |
|------------------------------|----------------|
| <img src ="https://github.com/kjinhub/MelodyDiary/issues/1#issue-3579687057"> | <img src ="https://github.com/kjinhub/MelodyDiary/issues/2#issue-3579689056"> |

> 🎧 왼쪽: GPT가 추천한 노래 목록 + 사진 업로드 + 감정 일기 작성 화면  
> ✍️ 오른쪽: Spotify 미리듣기
> 이미지를 클릭해주면 원본 이미지를 확인하실 수 있습니다 . 



---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🖋️ **일기 작성** | 사진 업로드(드래그/클릭) + 텍스트 입력 |
| 🤖 **GPT 음악 추천** | OpenAI API를 사용해 감정 기반 음악 3곡 자동 추천 |
| 🔁 **다시 추천받기** | 마음에 드는 곡이 없을 때 다른 추천곡 요청 |
| 🎧 **Spotify 자동 검색** | 클릭 시 Spotify Web API로 곡 검색 및 embed 미리듣기 |
| 💾 **로컬 저장** | 일기/이미지/음악이 LocalStorage에 저장 |
| 💙 **Toss 스타일 UI** | 라운드 카드 + 부드러운 파란 포인트 컬러 |

---

## 🧠 기술 개요

| 구분 | 기술 | 설명 |
|------|------|------|
| **Frontend** | React (Vite) | SPA 구조 및 빠른 개발환경 |
| **AI 추천** | OpenAI GPT API | 일기 텍스트 → 음악 추천 |
| **음악 연동** | Spotify Web API | 곡 검색, 앨범커버, embed URL 생성 |
| **저장소** | LocalStorage | 클라이언트 단 저장 |
| **디자인** | CSS (Toss 스타일) | 카드형 UI, 라운드 + 그림자 효과 |

---

## ⚙️ 프로젝트 구조

```
src/
├── App.jsx                        # 앱 전체 루트 컴포넌트 (라우팅 + Provider)
│
├── components/
│   ├── Navbar.jsx                 # 상단 네비게이션 바
│   ├── DiaryCard.jsx              # 일기 요약 카드
│   ├── DiaryDetailModal.jsx       # 일기 상세 보기 모달
│   ├── DiaryForm.jsx              # 새 일기 작성 폼
│   ├── EmotionReport.jsx          # 감정 통계 차트 컴포넌트
│
├── context/
│   └── DiaryContext.jsx           # Context API (일기/찜 상태 전역 관리)
│
├── hooks/
│   ├── useDiaries.js              # 로컬 스토리지 기반 일기 CRUD 훅
│   ├── useFavorites.js            # 음악 찜(즐겨찾기) 상태 관리 훅
│   └── useReportData.js           # 감정 통계 및 리포트 데이터 생성 훅
│
├── pages/
│   ├── DiaryList.jsx              # 일기 목록 페이지
│   └── ReportPage.jsx             # 감정 리포트 페이지
│
├── styles/
│   ├── components/                # 각 컴포넌트별 스타일
│   └── pages/                     # 페이지별 스타일
│
└── utils/
    ├── spotify.js                 # Spotify + OpenAI 음악 추천 로직
    └── gptEmotion.js              # OpenAI 기반 감정 분석 함수

```

---

## 🔐 환경 변수 (.env)

```env
VITE_OPENAI_API_KEY=sk-당신의_오픈AI_API_키
VITE_SPOTIFY_CLIENT_ID=당신의_CLIENT_ID
VITE_SPOTIFY_CLIENT_SECRET=당신의_CLIENT_SECRET

# 1️⃣ 패키지 설치
npm install

# 2️⃣ 개발 서버 실행
npm run dev

🧭 사용 흐름

1️⃣ 사진 업로드 + 감정 일기 작성
2️⃣ 🎧 GPT로 노래 추천받기 클릭
3️⃣ GPT가 3곡 제안 → 마음에 드는 곡 선택
4️⃣ 🔁 다른 곡 보기 클릭 시 새로운 추천
5️⃣ Spotify 미리듣기 자동 재생
6️⃣ 💾 저장하기 로 로컬 스토리지 보관

📚 API 사용 요약
API	역할	비고
OpenAI Chat API	텍스트 기반 음악 추천	model: gpt-3.5-turbo
Spotify Web API	곡 검색, 앨범 커버, track ID 반환	Client Credentials Flow
Spotify Embed Player	음악 미리듣기 플레이어	/embed/track/{id} 사용

