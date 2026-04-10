import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { UserProfile } from '../store/useSajuStore';
import { SajuResult } from '../lib/saju';

interface AiInterpretationProps {
  profile: UserProfile;
  result: SajuResult;
}


export default function AiInterpretation({ profile, result }: AiInterpretationProps) {
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  console.log("현재 로드된 키:", import.meta.env.VITE_GEMINI_API_KEY);
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
        당신은 20년 경력의 명리학자이자 사주 상담가입니다. 
        입력된 사주 데이터를 바탕으로 이 사람의 전반적인 성향, 재물운, 직업운, 연애운을 심층 분석해주세요.
        
        지침:
        1. 말투는 따뜻하고 신뢰감 있는 상담가 어조(~입니다, ~하셔도 좋습니다)를 유지하세요.
        2. 오행의 균형(과다하거나 부족한 오행)을 중심으로 개운법(보완 방법)을 포함해주세요.
        3. 마크다운(Markdown)을 사용하여 가독성 있게 작성하되, 섹션별로 이모지를 적절히 섞어주세요.
        
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

      {/* 초기 상태: 분석 버튼 */}
      {!interpretation && !isLoading && !error && (
        <div className="text-center py-10 px-4 bg-stone-50 rounded-xl">
          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            명리학자 페르소나를 가진 AI가 {profile.name}님의 <br />
            <strong>8글자 팔자와 오행</strong>을 분석하여 맞춤형 풀이를 제공합니다.
          </p>
          <button
            onClick={generateInterpretation}
            className="group relative px-8 py-4 bg-stone-900 text-white rounded-2xl font-semibold text-base overflow-hidden transition-all hover:bg-stone-800 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={18} className="group-hover:animate-pulse" />
              AI 풀이 시작하기
            </span>
          </button>
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