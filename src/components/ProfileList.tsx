import { motion } from 'motion/react';
import { Trash2, User } from 'lucide-react';
import { useSajuStore } from '../store/useSajuStore';

interface ProfileListProps {
  onSelect: (id: string) => void;
}

export default function ProfileList({ onSelect }: ProfileListProps) {
  const { profiles, deleteProfile } = useSajuStore();

  if (profiles.length === 0) return null;

  return (
    <div className="w-full max-w-md mt-8">
      <h3 className="text-sm font-medium text-stone-500 mb-3 px-2">저장된 사주</h3>
      <div className="space-y-2">
        {profiles.map((profile) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-stone-100 cursor-pointer hover:border-stone-300 transition-colors"
            onClick={() => onSelect(profile.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium text-stone-900">{profile.name}</p>
                <p className="text-xs text-stone-500">
                  {profile.birthDate} {profile.birthTime}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteProfile(profile.id);
              }}
              className="p-2 text-stone-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
