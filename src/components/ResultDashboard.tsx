import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Share2, Image as ImageIcon, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toPng } from 'html-to-image';
import { useSajuStore } from '../store/useSajuStore';
import { SajuChar } from '../lib/saju';
import elementsData from '../data/elements.json';
import AiInterpretation from './AiInterpretation';

interface ResultDashboardProps {
  onBack: () => void;
}

const ELEMENT_COLORS: Record<string, string> = {
  '목': 'var(--color-element-wood)',
  '화': 'var(--color-element-fire)',
  '토': 'var(--color-element-earth)',
  '금': 'var(--color-element-metal)',
  '수': 'var(--color-element-water)',
};

export default function ResultDashboard({ onBack }: ResultDashboardProps) {
  const { currentProfile, currentResult, addProfile } = useSajuStore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  if (!currentProfile || !currentResult) return null;

  const handleSaveImage = useCallback(async () => {
    if (captureRef.current === null) return;
    
    setIsCapturing(true);
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        backgroundColor: '#f8f5f2', 
        style: {
          padding: '20px',
        }
      });
      
      const link = document.createElement('a');
      link.download = `사주포인트_${currentProfile.name}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('이미지 저장 실패:', err);
      alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsCapturing(false);
    }
  }, [currentProfile]);

  const handleSave = () => {
    if (currentProfile.id === 'temp') {
      addProfile({
        name: currentProfile.name,
        gender: currentProfile.gender,
        isLunar: currentProfile.isLunar,
        birthDate: currentProfile.birthDate,
        birthTime: currentProfile.birthTime,
      });
      alert('저장되었습니다.');
    }
  };

  const chartData = Object.entries(currentResult.elementsCount).map(([name, value]) => ({
    name,
    value,
    color: ELEMENT_COLORS[name]
  }));

  const renderCharBox = (charInfo: SajuChar, label: string, isDayMaster: boolean = false) => (
    <div className={`flex flex-col items-center p-2 sm:p-3 rounded-xl border ${isDayMaster ? 'border-stone-900 bg-stone-100' : 'border-stone-200 bg-white shadow-sm'}`}>
      <span className="text-[10px] sm:text-xs text-stone-500 mb-1">{label}</span>
      <span className="text-2xl sm:text-3xl font-serif font-bold mb-0.5 sm:mb-1" style={{ color: ELEMENT_COLORS[charInfo.element] }}>
        {charInfo.char}
      </span>
      <span className="text-[9px] sm:text-xs font-semibold text-stone-600">{charInfo.name}</span>
      <span className="text-[8px] sm:text-[10px] text-stone-400 mt-0.5">{charInfo.element}</span>
      {charInfo.god && <span className="text-[8px] sm:text-[10px] text-stone-500 font-medium mt-0.5 line-clamp-1">{charInfo.god}</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-stone-200 z-10 px-4 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-stone-500 hover:text-stone-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-serif font-bold text-lg">{currentProfile.name}님의 사주</h1>
        <div className="flex gap-2">
          {currentProfile.id === 'temp' && (
            <button onClick={handleSave} className="p-2 text-stone-500 hover:text-stone-900">
              <Save size={20} />
            </button>
          )}
          <button onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${currentProfile.name}님의 사주 분석 결과`,
                url: window.location.href
              }).catch(console.error);
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('링크가 복사되었습니다.');
            }
          }} className="p-2 text-stone-500 hover:text-stone-900">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <main ref={captureRef} className="max-w-md mx-auto p-4 space-y-6 mt-4">
        {/* 사주 브랜딩 추가 (이미지 저장 시 식별용) */}
        <div className="text-center py-2 opacity-0 h-0" id="capture-branding">
           <h3 className="font-serif font-bold text-stone-400">사주-포인트 :: 🏮</h3>
        </div>

        {/* 팔자 카드 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
... (생략) ...
        {/* AI 심층 사주 풀이 */}
        <AiInterpretation profile={currentProfile} result={currentResult} />

        {/* 이미지 저장 시 하단 워터마크 안내 */}
        <div className="text-center pt-8 pb-4 opacity-30 text-[10px] text-stone-500">
           Copyright © Sajuman. All rights reserved.
        </div>
      </main>

      {/* 이미지 저장 버튼 (플로팅) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <button
          onClick={handleSaveImage}
          disabled={isCapturing}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
            isCapturing ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-stone-800'
          }`}
        >
          {isCapturing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              이미지 생성 중...
            </span>
          ) : (
            <>
              <Download size={20} />
              이미지로 결과 소장하기 (📸)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
