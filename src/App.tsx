import { useState } from 'react';
import LandingPage from './components/LandingPage';
import InputForm from './components/InputForm';
import LoadingScreen from './components/LoadingScreen';
import ResultDashboard from './components/ResultDashboard';
import { useSajuStore, UserProfile } from './store/useSajuStore';

type ViewState = 'landing' | 'input' | 'loading' | 'result';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const { analyze, setCurrentProfile, clearCurrent } = useSajuStore();

  const handleStart = () => {
    clearCurrent();
    setView('input');
  };

  const handleSelectProfile = (id: string) => {
    setCurrentProfile(id);
    setView('loading');
  };

  const handleSubmit = (profile: Omit<UserProfile, 'id'>) => {
    analyze(profile);
    setView('loading');
  };

  const handleLoadingComplete = () => {
    setView('result');
  };

  const handleBackToHome = () => {
    clearCurrent();
    setView('landing');
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen">
      {view === 'landing' && (
        <LandingPage onStart={handleStart} onSelectProfile={handleSelectProfile} />
      )}
      {view === 'input' && (
        <InputForm onBack={handleBackToHome} onSubmit={handleSubmit} />
      )}
      {view === 'loading' && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      {view === 'result' && (
        <ResultDashboard onBack={handleBackToHome} />
      )}
    </div>
  );
}
