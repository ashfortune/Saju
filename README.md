# 🏮 사주-포인트 (Sajuman AI)

> **"고전 명리학의 전통과 인공지능 기술의 결합, 데이터로 읽는 정밀 사주 분석 플랫폼"**

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)](https://saju-point.vercel.app)
[![React](https://img.shields.io/badge/Framework-React_19-blue?style=flat-square&logo=react)](https://react.dev)
[![Gemini](https://img.shields.io/badge/AI-Gemma_4-orange?style=flat-square&logo=googlegemini)](https://deepmind.google/technologies/gemini/)

---

## 🚀 프로젝트 개요 (Overview)

**Sajuman AI**는 복잡한 한자와 모호한 비유 중심의 기존 사주 서비스를 넘어, **명리학의 논리적 데이터를 시스템화**하고 **LLM(Gemma 4)의 정밀 추론**을 결합하여 현대적인 인사이트를 제공하는 웹 애플리케이션입니다. 

단순한 운세를 넘어 재성(財星), 관성(官星) 등 도메인별 특화 분석 모듈을 제공하며, 고품질 리포트 이미지 생성 기능을 통해 사용자 경험을 극대화했습니다.

---

## ✨ 핵심 기능 (Key Features)

### 1. ⚙️ 정밀 만세력 연산 엔진
- 사용자의 생년월시 데이터를 바탕으로 **원국(原局)**을 정확히 도출합니다.
- 오행의 분포도를 정밀하게 계측하여 데이터 시각화 리포트를 제공합니다.

### 2. 🎭 도메인 특화 AI 분석 모듈 (Modular Analysis)
단순 상담이 아닌, 고전 이론을 학습한 4가지 인공지능 분석 모듈을 제공합니다.
- **균형 분석 시스템**: 사주 원국 및 조후(調候)의 총체적 조화 분석
- **재성 흐름 분석 모듈**: 경제적 유동성 및 재물 성취 지표 연산
- **관성 성취 연산 로직**: 조직 적합성 및 사회적 성취 경로 추론
- **인성 유대 지표 모델**: 사회적 유대 및 귀인운 지표 측정

### 3. 📸 프리미엄 리포트 이미지 내보내기
- 분석 결과를 SNS 공유 및 개인 소장에 최적화된 **고화질 PNG 이미지**로 즉시 저장할 수 있습니다.
- `html-to-image`와 고해상도 렌더링 최적화를 통해 텍스트의 선명도를 유지합니다.

### 4. 📱 모바일 퍼스트 프리미엄 UX
- 네이티브 앱 수준의 인터랙션을 위해 터치 하이라이트 제거, 바운스 효과 제어 등 **미세 UX 튜닝**을 적용했습니다.
- 반응형 그리드 설계를 통해 8글자의 사주 팔자가 모든 기기에서 선명하게 표시됩니다.

---

## 🛡️ 기술적 도전 및 해결 과정 (Technical Excellence)

### ✅ AI 프롬프트 엔지니어링 및 페르소나 설계
기존의 감성적 조언에서 벗어나 **"논리적 진단"**의 인상을 주기 위해, AI에게 전문가 페르소나 대신 **"특화 분석 모듈"**로서의 역할을 부여했습니다. 이를 통해 명리학 용어(통근, 합충 등)를 활용한 객관적이고 신뢰도 높은 리포트를 도출하는 데 성공했습니다.

### ✅ 모바일 환경에서의 이미지 렌더링 최적화
DOM 요소를 이미지로 변환할 때 폰트 깨짐 및 레이아웃 어긋남 문제를 해결하기 위해, 캡처 시 전용 브랜딩 레이어를 활성화하고 배경색 및 패딩을 강제 렌더링하는 전용 로직을 구현했습니다.

### ✅ SPA 배포 및 라우팅 이슈 해결
Vercel 배포 후 새로고침 시 발생하는 404 에러를 방지하기 위해 `vercel.json`에 리라이트 규칙을 설정하고, SPA 라우팅 환경에서의 보안 안정성을 확보했습니다.

---

## 🛠 Tech Stack

- **Core**: React 19, TypeScript, Vite 6
- **AI**: Google Gemini Pro (Gemma 4-26B)
- **State**: Zustand (Persistence Middleware 적용)
- **Animation**: Motion (Framer Motion)
- **Utility**: `lunar-javascript` (정밀 만세력), `html-to-image` (리포트 캡처)
- **Styling**: Tailwind CSS 4, Vanilla CSS (Premium Tuning)

---

## 📂 Project Structure

```text
src/
├── components/      # 고도화된 UI 컴포넌트 (분석 모듈, 대시보드 등)
├── lib/            # 사주 로직 및 만세력 연산 엔진
├── store/          # Zustand 기반 전역 상태 관리
├── data/           # 오행 및 기초 명리 데이터베이스
└── App.tsx         # 메인 라우팅 및 레이아웃 제어
```

---

## 🏁 시작하기 (Getting Started)

```bash
# Clone
git clone https://github.com/ashfortune/Saju.git

# Install
npm install

# .env 설정
VITE_GEMINI_API_KEY=your_api_key_here

# Run
npm run dev
```

---

Designed with 🏮 **Modern Tradition** for a Premium Saju Experience.
