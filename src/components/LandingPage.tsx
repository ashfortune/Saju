import { motion } from 'motion/react';
import { Compass } from 'lucide-react';
import ProfileList from './ProfileList';

interface LandingPageProps {
  onStart: () => void;
  onSelectProfile: (id: string) => void;
}

export default function LandingPage({ onStart, onSelectProfile }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center text-white">
            <Compass size={40} />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-stone-900 font-serif">사주-포인트</h1>
        <p className="text-stone-500 mb-8">
          개인정보 유출 걱정 없는<br />
          빠르고 깔끔한 클라이언트 사이드 사주 분석
        </p>
        
        <button
          onClick={onStart}
          className="w-full py-4 bg-stone-900 text-white rounded-xl font-medium text-lg hover:bg-stone-800 transition-colors"
        >
          새로운 사주 보기
        </button>
      </motion.div>

      <ProfileList onSelect={onSelectProfile} />
    </div>
  );
}
