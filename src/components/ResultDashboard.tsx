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
  const { currentProfile, currentResult, addProfile, profiles } = useSajuStore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAlreadySaved = profiles.some(p => 
    p.name === currentProfile?.name && 
    p.birthDate === currentProfile?.birthDate && 
    p.birthTime === currentProfile?.birthTime
  );
  
  if (!currentProfile || !currentResult) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

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
    if (isAlreadySaved) {
      showToast('이미 저장된 사주입니다.');
      return;
    }
    
    addProfile({
      name: currentProfile.name,
      gender: currentProfile.gender,
      isLunar: currentProfile.isLunar,
      birthDate: currentProfile.birthDate,
      birthTime: currentProfile.birthTime,
    });
    showToast('보관함에 저장되었습니다.');
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
          <button 
            onClick={handleSave} 
            disabled={isAlreadySaved}
            className={`p-2 rounded-lg transition-colors ${
              isAlreadySaved ? 'text-green-600 bg-green-50' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {isAlreadySaved ? <Save size={20} className="fill-current" /> : <Save size={20} />}
          </button>
          <button onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${currentProfile.name}님의 사주 분석 결과`,
                url: window.location.href
              }).catch(console.error);
            } else {
              navigator.clipboard.writeText(window.location.href);
              showToast('링크가 복사되었습니다.');
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
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100"
        >
          <h2 className="text-lg font-bold mb-4 font-serif">사주팔자 (四柱八字)</h2>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {/* 천간 (상단) */}
            {renderCharBox(currentResult.time.stem, '시주')}
            {renderCharBox(currentResult.day.stem, '일주', true)}
            {renderCharBox(currentResult.month.stem, '월주')}
            {renderCharBox(currentResult.year.stem, '년주')}
            
            {/* 지지 (하단) */}
            {renderCharBox(currentResult.time.branch, '')}
            {renderCharBox(currentResult.day.branch, '', true)}
            {renderCharBox(currentResult.month.branch, '')}
            {renderCharBox(currentResult.year.branch, '')}
          </div>
          <p className="text-xs text-stone-500 mt-4 text-center">
            * 일주(두 번째 열)의 상단 글자가 본인을 상징하는 '일간'입니다.
          </p>
        </motion.section>

        {/* 오행 분포 및 에너지 리포트 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-serif">오행 에너지 분석</h2>
            <span className="text-[10px] text-stone-400">Total 8 Point</span>
          </div>

          <div className="space-y-4">
            {chartData.sort((a, b) => b.value - a.value).map((item) => {
              const info = (elementsData as any)[item.name];
              const getStatus = (val: number) => {
                if (val >= 4) return { label: '강함', color: 'bg-red-50 text-red-600 border-red-100' };
                if (val >= 2) return { label: '균형', color: 'bg-green-50 text-green-600 border-green-100' };
                if (val === 1) return { label: '약함', color: 'bg-amber-50 text-amber-600 border-amber-100' };
                return { label: '부족', color: 'bg-stone-50 text-stone-400 border-stone-100' };
              };
              const status = getStatus(item.value);
              
              return (
                <div key={item.name} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                       <span className="font-bold text-sm">{item.name}</span>
                       <span className="text-[11px] text-stone-400 font-normal">{info.desc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-stone-600">{item.value}개</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / 8) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 에너지 총평 */}
          <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
            <h3 className="text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">나를 이끄는 핵심 에너지</h3>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <span className="text-xl">{(elementsData as any)[chartData[0].name].icon || '✨'}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">
                  {chartData[0].name} 기운 ({ (elementsData as any)[chartData[0].name].desc })
                </p>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {currentProfile.name}님은 사주에서 <strong>{chartData[0].name}</strong>의 에너지가 가장 뚜렷합니다. 
                  주요 강점은 <strong>{(elementsData as any)[chartData[0].name].pros.split(',')[0]}</strong>입니다.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 해석 리포트 (기질 분석) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 space-y-6"
        >
          <div>
            <h2 className="text-lg font-bold mb-3 font-serif flex items-center gap-2">
              <span className="w-1.5 h-6 bg-stone-900 rounded-full inline-block"></span>
              나의 타고난 기질
            </h2>
            <p className="text-stone-700 leading-relaxed">
              {currentProfile.name}님은 <strong>{currentResult.dayMaster.element}</strong>의 기운을 타고났습니다. 
              {currentResult.dayMaster.name}일간은 {(elementsData as any)[currentResult.dayMaster.element].desc}을 상징합니다.
            </p>
            <div className="mt-4 p-4 bg-stone-50 rounded-xl">
              <h3 className="font-bold text-sm mb-2">장점</h3>
              <p className="text-sm text-stone-600 mb-3">{(elementsData as any)[currentResult.dayMaster.element].pros}</p>
              <h3 className="font-bold text-sm mb-2">보완할 점</h3>
              <p className="text-sm text-stone-600">{(elementsData as any)[currentResult.dayMaster.element].cons}</p>
            </div>
          </div>

          {/* 개념 해설 가이드 추가 */}
          <div className="pt-6 border-t border-stone-100">
            <div className="bg-stone-900 text-white rounded-2xl p-5 relative overflow-hidden group">
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-2 text-stone-300">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded">Traditional Theory</span>
                 </div>
                 <h3 className="font-serif font-bold text-lg mb-2">원국(原局)과 조후(調候)의 상관관계</h3>
                 <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  나의 기질({currentResult.dayMaster.element})은 변하지 않는 사주의 <strong>원국(본질)</strong>이며, 
                  오행 분포에서 강한 {chartData[0].name} 기운은 원국에 영향을 주는 <strong>조후(환경)</strong>입니다.
                 </p>
                 <div className="p-3 bg-white/10 rounded-xl border border-white/5 backdrop-blur-sm">
                    <p className="text-[11px] text-white/90 leading-relaxed italic">
                      "본 사주는 <strong>{currentResult.dayMaster.element}의 원형질</strong>을 유지하되, 
                      외부 환경인 <strong>{chartData[0].name}의 강력한 에너지</strong>에 의해 발현 양상이 결정됩니다. 
                      본질과 조후의 균형을 분석하는 것이 정밀 진단의 핵심입니다."
                    </p>
                 </div>
               </div>
               {/* 장식용 아이콘 */}
               <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 transition-transform group-hover:scale-110">
                  <span className="text-8xl">🏮</span>
               </div>
            </div>
          </div>
        </motion.section>

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
      {/* 토스트 알림 */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-50 px-6 py-3 bg-stone-900 text-white text-sm rounded-full shadow-2xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 이미지 생성 로딩 오버레이 */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-stone-100 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-stone-100 border-t-stone-900 rounded-full animate-spin mb-4" />
              <p className="font-bold text-stone-900">분석 리포트 생성 중...</p>
              <p className="text-xs text-stone-400 mt-2 text-center">잠시만 기다려 주시면 <br/>멋진 이미지가 완성됩니다.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
