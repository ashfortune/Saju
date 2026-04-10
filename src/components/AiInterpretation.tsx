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
        
        입력된 데이터를 고전 명리 이론에 근거하여 기술적이고 논리적으로 분석해주세요.
        
        분석 모듈별 중점 연산 항목:
        ${selectedPersonaId === 'total' ? '- 원국의 조후(調候) 균형 및 오행 상생상극의 흐름에 대한 종합 지표를 도출하세요.' : ''}
        ${selectedPersonaId === 'money' ? '- 재성(財星)의 통근(通根) 여부 및 용신(用神)을 활용한 경제적 유동성을 계측하세요.' : ''}
        ${selectedPersonaId === 'career' ? '- 관성(官星)의 건왕함과 적성 지표를 대조하여 사회적 성취 경로를 도출하세요.' : ''}
        ${selectedPersonaId === 'love' ? '- 인성(印星)의 분포 및 기운의 유통을 바탕으로 사회적 유대 및 귀인운 지표를 연산하세요.' : ''}

        분석 지침:
        1. 말투는 객관적이며 신뢰감 있는 전문가 문체(~함, ~로 판단됨, ~으로 분석됨)를 지향하세요.
        2. "조언", "위로"와 같은 주관적 표현보다 "데이터 상의 경향성", "명리학적 지표"와 같은 객관적 어휘를 사용하세요.
        3. 마크다운을 활용해 가독성 있게 작성하되, 시스템 리포트 느낌의 정밀한 레이아웃을 구성하세요.
        
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
                    className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                      selectedPersonaId === p.id 
                      ? 'border-stone-900 bg-white shadow-md ring-1 ring-stone-900' 
                      : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mb-3 w-fit ${
                      selectedPersonaId === p.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
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
          <div className="prose prose-stone max-w-none 
            prose-headings:font-serif prose-headings:text-stone-800
            prose-p:text-stone-700 prose-p:leading-relaxed
            prose-strong:text-stone-900 prose-strong:font-bold
            bg-stone-50/50 p-6 rounded-2xl border border-stone-100"
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