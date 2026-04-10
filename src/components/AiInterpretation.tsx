import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertCircle, RefreshCw, Trophy, Briefcase, Heart, BookOpen, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { UserProfile } from '../store/useSajuStore';
import { SajuResult } from '../lib/saju';

type PersonaType = 'total' | 'money' | 'career' | 'love';

interface Persona {
  id: PersonaType;
  name: string;
  title: string;
  specialty: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'total',
    name: '',
    title: '균형 분석 시스템',
    specialty: '사주 원국 및 조후 분석',
    icon: <BookOpen size={20} />,
    description: '전체적인 오행의 균형과 기질적 특성을 도출합니다.',
    color: 'stone'
  },
  {
    id: 'money',
    name: '',
    title: '재성 흐름 분석 모듈',
    specialty: '경제적 성취 및 유동성계측',
    icon: <Trophy size={20} />,
    description: '재성(財星)의 흐름과 금전적 성취 가능성을 연산합니다.',
    color: 'amber'
  },
  {
    id: 'career',
    name: '',
    title: '관성 성취 연산 로직',
    specialty: '사회적 지위 및 직업 적성',
    icon: <Briefcase size={20} />,
    description: '관성(官星) 기반의 조직 적응력과 명예운을 분석합니다.',
    color: 'blue'
  },
  {
    id: 'love',
    name: '',
    title: '인성 유대 지표 모델',
    specialty: '인간관계 및 사회적 유대',
    icon: <Heart size={20} />,
    description: '인성(印星)과 귀인운을 바탕으로 사회적 유대를 측정합니다.',
    color: 'rose'
  }
];

interface AiInterpretationProps {
  profile: UserProfile;
  result: SajuResult;
}


export default function AiInterpretation({ profile, result }: AiInterpretationProps) {
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedPersonaId, setSelectedPersonaId] = useState<PersonaType>('total');

  const selectedPersona = PERSONAS.find(p => p.id === selectedPersonaId)!;

  const generateInterpretation = async () => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError('API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiKeyFromEnv = import.meta.env.VITE_GEMINI_API_KEY;
      const cleanKey = String(apiKeyFromEnv || '').trim();

      console.log("최종 전달 키 확인:", cleanKey.substring(0, 10) + "...");

      if (!cleanKey) {
        throw new Error('VITE_GEMINI_API_KEY is missing or empty.');
      }

      const sajuData = `
        [사용자 정보]
        이름: ${profile.name}
        성별: ${profile.gender === 'M' ? '남성' : '여성'}
        
        [사주팔자]
        - 년주: ${result.year.stem.char}${result.year.branch.char}
        - 월주: ${result.month.stem.char}${result.month.branch.char}
        - 일주: ${result.day.stem.char}${result.day.branch.char} (일간: ${result.dayMaster.char}, 오행: ${result.dayMaster.element})
        - 시주: ${result.time.stem.char}${result.time.branch.char}
        
        [오행 분석 점수]
        - 목(木): ${result.elementsCount['목']}
        - 화(火): ${result.elementsCount['화']}
        - 토(土): ${result.elementsCount['토']}
        - 금(金): ${result.elementsCount['금']}
        - 수(水): ${result.elementsCount['수']}
      `;

      const prompt = `
        당신은 사주 명리학 정밀 분석 시스템 [${selectedPersona.title}]입니다.
        이번 분석은 [${selectedPersona.specialty}] 데이터 전용 모드로 진행됩니다.
        
        [분석 대상 데이터]
        - 제공된 사용자의 사주 원국(팔자) 및 현재 대운/세운 데이터를 바탕으로 연산하세요.

        [내용 및 어조 지침]
        1. **전문성과 대중성의 조화**: 학술 용어(원국, 조후, 통근 등)를 사용하되, 반드시 바로 뒤에 일반인이 이해할 수 있는 쉬운 비유를 괄호()로 덧붙이세요.
        2. **논리적 근거 제시**: 단순히 결과만 말하지 말고, "X라는 글자가 Y와 합(合)을 이루어 ~한 에너지가 발생함"과 같이 명리학적 근거를 한 문장 포함하세요.
        3. **핵심 요약 제공**: 분석 서두에 [오늘의 한 줄 핵심 요약]을 배치하세요.
        4. **객관적 실천 가이드**: 추상적인 조언 대신, 행운의 색상, 추천 행동, 주의해야 할 습관 등 구체적인 '개운법'을 제시하세요.
        
        [분석 모듈별 중점 연산 항목]
        ${selectedPersonaId === 'total' ? '- 원국의 조후(온도감) 균형 및 오행의 순환(상생상극) 흐름 종합 분석' : ''}
        ${selectedPersonaId === 'money' ? '- 재성(財星)의 강약과 식상(食傷, 활동력)의 생재(財) 여부 집중 계측' : ''}
        ${selectedPersonaId === 'career' ? '- 관성(官星)의 뿌리와 인성(印星)의 보좌를 통한 직업적 성취도 및 적성 도출' : ''}
        ${selectedPersonaId === 'love' ? '- 일지(日支)의 상태와 관성/재성의 동태를 바탕으로 한 인연법 연산' : ''}

        [형식 지침]
        - 마크다운(Heading, Bold 등)을 사용하여 가독성 있게 작성하세요.
        - 섹션별로 적절한 이모지를 사용하여 친근감을 주되, 문체는 정중한 전문가 톤을 유지하세요.
        
        사주 데이터:
        ${sajuData}
      `;

      // 최신 SDK 규정에 따라 객체 형태로 전달 시도
      const genAIClient = new GoogleGenAI({ apiKey: cleanKey });

      // 최신 @google/genai SDK 호출 방식 (models 객체 통해 직접 호출)
      const aiResponse = await genAIClient.models.generateContent({
        model: 'gemma-4-26b-a4b-it', // <-- 공식 지원 형식으로 변경
        contents: prompt
      });

      const text = aiResponse.text;

      if (!text) throw new Error('AI가 응답을 생성하지 못했습니다.');

      setInterpretation(text);
    } catch (err) {
      console.error('AI 분석 오류:', err);
      setError('AI 명리학자가 분석 중 잠시 자리를 비웠습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-5"
    >
      <div className="flex items-center justify-between border-b border-stone-50 pb-4">
        <h2 className="text-xl font-bold font-serif flex items-center gap-2 text-stone-800">
          <Sparkles className="text-yellow-500 fill-yellow-500" size={22} />
          AI 심층 사주 풀이
        </h2>
      </div>

      {/* 초기 상태: 분석 모듈 선택 및 시스템 가동 버튼 */}
      {!interpretation && !isLoading && !error && (
        <div className="space-y-6">
          <div className="bg-stone-50 p-4 rounded-xl">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-4 px-1">정밀 분석 모듈 선택</p>
            <div className="grid grid-cols-2 gap-3">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersonaId(p.id)}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all ${selectedPersonaId === p.id
                      ? 'border-stone-900 bg-white shadow-md ring-1 ring-stone-900'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                >
                  <div className={`p-2 rounded-lg mb-3 w-fit ${selectedPersonaId === p.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                    {p.icon}
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 mb-1">{p.title}</h3>
                  <p className="text-[10px] text-stone-500 leading-tight">{p.specialty}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center py-4 px-4">
            <p className="text-stone-500 text-[10px] leading-relaxed mb-6 font-mono">
              SYSTEM: [{selectedPersona.title}] 모듈 대기 중... <br />
              전통 명리 알고리즘 기반 정밀 연산을 시작합니다.
            </p>
            <button
              onClick={generateInterpretation}
              className="group relative w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-base overflow-hidden transition-all hover:bg-stone-800 active:scale-95 shadow-xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest">
                <Sparkles size={20} className="group-hover:animate-pulse" />
                정밀 분석 시스템 가동
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-12 space-y-5">
          <div className="relative w-12 h-12 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-stone-100 border-t-stone-900 rounded-full"
            />
            <Sparkles className="absolute inset-0 m-auto text-yellow-500 animate-bounce" size={20} />
          </div>
          <div className="space-y-2">
            <p className="text-stone-800 font-medium">만세력을 바탕으로 운명을 분석 중...</p>
            <p className="text-stone-400 text-xs">잠시만 기다려 주시면 결과가 나옵니다.</p>
          </div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="p-5 bg-red-50 text-red-600 rounded-2xl flex flex-col items-center gap-3">
          <AlertCircle size={24} />
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={generateInterpretation}
            className="flex items-center gap-1 text-xs font-bold underline decoration-2 underline-offset-4"
          >
            <RefreshCw size={14} /> 다시 시도
          </button>
        </div>
      )}

      {/* 결과 출력 상태 */}
      {interpretation && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <div className="prose prose-sm sm:prose-base prose-stone max-w-none 
            prose-headings:font-serif prose-headings:text-stone-800
            prose-p:text-stone-700 prose-p:leading-relaxed
            prose-strong:text-stone-900 prose-strong:font-bold
            bg-stone-50/50 p-4 sm:p-6 rounded-2xl border border-stone-100
            break-words overflow-x-hidden"
          >
            <Markdown>{interpretation}</Markdown>
          </div>

          <div className="mt-8 flex justify-center border-t border-stone-100 pt-6">
            <button
              onClick={generateInterpretation}
              className="flex items-center gap-2 text-stone-400 text-sm hover:text-stone-900 transition-colors"
            >
              <RefreshCw size={14} />
              분석 내용이 마음에 안 드시나요? 다시 생성하기
            </button>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}