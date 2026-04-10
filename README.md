# 🏮 사주-포인트 (Sajuman)

> **"당신의 운명을 읽는 가장 스마트한 방법"**  
> Google Gemini AI 기반의 고도화된 사주 분석 및 오행 리포트 서비스

<div align="center">
  <img width="100%" alt="Sajuman Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## ✨ 주요 기능

- 🔮 **정밀 사주 분석**: 사용자의 생년월시를 바탕으로 년/월/일/시주의 8글자를 정확하게 도출합니다.
- 🤖 **Gemma 4 AI 심층 풀이**: 최신 Google Gemma 4 (gemma-4-26b-a4b-it) 모델을 연동하여 명리학자의 분석과 같은 고퀄리티 리포트를 제공합니다.
- 📊 **오행 분포 시각화**: 목, 화, 토, 금, 수 오행의 에너지를 차트로 시각화하여 타고난 기질을 한눈에 파악할 수 있습니다.
- 📱 **프리미엄 모바일 UX**: 앱처럼 부드러운 터치 인터페이스와 어느 기기에서나 완벽한 반응형 레이아웃을 지원합니다.
- 🔒 **개인정보 보호**: 클라이언트 사이드 분석과 환경 변수 기반의 안전한 API 연동을 지향합니다.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite 6, TypeScript
- **Styling**: Tailwind CSS 4, Motion (Animations)
- **AI**: Google Gemini API (@google/genai)
- **Icons & UI**: Lucide React, Recharts
- **Library**: `lunar-javascript` (만세력 계산식)

## 🚀 시작하기

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/sajuman.git
   cd sajuman
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   루트 디렉토리에 `.env` 파일을 생성하고 아래 내용을 입력하세요.
   ```env
   VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

## 🌐 배포 (Deployment)

본 프로젝트는 **Vercel** 환경에 최적화되어 있습니다.

1. Vercel에서 프로젝트를 연결합니다.
2. 대시보드의 **Environment Variables** 메뉴에서 `VITE_GEMINI_API_KEY`를 설정하세요.
3. `vercel.json`의 리라이트 설정을 통해 SPA 라우팅이 자동으로 처리됩니다.

---

Designed with ❤️ for a premium Saju experience.
