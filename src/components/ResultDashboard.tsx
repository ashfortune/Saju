import { motion } from 'motion/react';
import { ArrowLeft, Save, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

  if (!currentProfile || !currentResult) return null;

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

      <main className="max-w-md mx-auto p-4 space-y-6 mt-4">
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

        {/* 오행 분포 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100"
        >
          <h2 className="text-lg font-bold mb-4 font-serif">오행 분포</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* 해석 리포트 */}
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
        </motion.section>

        {/* AI 심층 사주 풀이 */}
        <AiInterpretation profile={currentProfile} result={currentResult} />
      </main>
    </div>
  );
}
