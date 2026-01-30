# Build-High (빌드하이) 🚀

**엔지니어를 위한 지능형 스터디 및 프로젝트 팀 빌딩 매칭 플랫폼**

Build-High는 개발자들이 자신의 프로젝트나 스터디를 공유하고, AI의 도움을 받아 최적의 팀원을 찾을 수 있도록 돕는 플랫폼입니다. 작성된 게시글을 AI가 분석하여 요약문과 핵심 기술 태그를 자동으로 생성해주는 '지능형 CRUD' 기능을 핵심으로 합니다.

## ✨ 주요 기능

- **지능형 게시글 관리 (Smart CRUD)**: 게시글 저장 시 AI(Gemini/Groq)가 본문을 분석하여 3줄 요약과 핵심 기술 태그(5개)를 자동 생성 및 저장
- **AI 멀티 엔진 지원**: 서비스 환경에 따라 Google Gemini 1.5 Flash와 Groq (Llama 3.3) 엔진 중 선택하여 사용 가능
- **프리미엄 AI 매칭 UI**: 세련된 디자인의 AI 엔진 셀렉터와 대시보드 제공
- **실시간 데이터 캐싱**: 동일하거나 유사한 질문에 대해 DB 캐시를 활용하여 응답 속도 최적화 및 비용 절감
- **Supabase 기반 안전한 인증**: 구글 로그인을 통한 간편한 인증 및 RLS(Row Level Security)를 통한 데이터 보안

## 🛠 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Lucide React
- **Backend/Database**: Supabase (Auth, PostgreSQL, RLS)
- **AI Integration**: Vercel AI SDK, Google Gemini 1.5 Flash, Groq (Llama 3.3 70B)
- **Deployment**: Vercel

## 🚀 시작하기

### 1. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고 필요한 API 키를 입력하세요.

```bash
cp .env.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Groq
GROQ_API_KEY=your_groq_api_key
```

### 2. 의존성 설치 및 실행

```bash
npm install
npm run dev
```

## 📂 프로젝트 구조

- `/app`: Next.js App Router 기반 페이지 및 API 레이어
- `/components`: 재사용 가능한 UI 컴포넌트 (`/domain` 폴더 내 도메인 핵심 컴포넌트 포함)
- `/lib`: Supabase 클라이언트, AI 로직, 유틸리티 함수
- `/supabase`: DB 마이그레이션 및 설정 파일
- `/types`: 공통 타입 정의

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
