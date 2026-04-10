import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { UserProfile } from '../store/useSajuStore';

interface InputFormProps {
  onBack: () => void;
  onSubmit: (profile: Omit<UserProfile, 'id'>) => void;
}

export default function InputForm({ onBack, onSubmit }: InputFormProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [isLunar, setIsLunar] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate || !birthTime) return;
    
    onSubmit({
      name,
      gender,
      isLunar,
      birthDate,
      birthTime
    });
  };

  return (
    <div className="min-h-screen p-6 bg-stone-50">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="mb-6 p-2 -ml-2 text-stone-500 hover:text-stone-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100"
        >
          <h2 className="text-2xl font-bold mb-6 font-serif text-stone-900">정보 입력</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
                placeholder="홍길동"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">성별</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender('M')}
                  className={`flex-1 py-3 rounded-xl border ${gender === 'M' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-500 border-stone-200'}`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setGender('F')}
                  className={`flex-1 py-3 rounded-xl border ${gender === 'F' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-500 border-stone-200'}`}
                >
                  여성
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">양력/음력</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsLunar(false)}
                  className={`flex-1 py-3 rounded-xl border ${!isLunar ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-500 border-stone-200'}`}
                >
                  양력
                </button>
                <button
                  type="button"
                  onClick={() => setIsLunar(true)}
                  className={`flex-1 py-3 rounded-xl border ${isLunar ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-500 border-stone-200'}`}
                >
                  음력
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">생년월일</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">태어난 시간</label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-4 bg-stone-900 text-white rounded-xl font-medium text-lg hover:bg-stone-800 transition-colors"
            >
              분석하기
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
