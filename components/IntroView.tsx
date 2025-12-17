import React, { useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';

interface IntroViewProps {
  onStartJourney: (year: string) => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onStartJourney }) => {
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yearNum = parseInt(year, 10);
    const currentYear = new Date().getFullYear();

    if (isNaN(yearNum) || year.length !== 4) {
      setError('Please enter a valid 4-digit year.');
      return;
    }

    if (yearNum < 1900 || yearNum > currentYear) {
      setError(`Please enter a year between 1900 and ${currentYear}.`);
      return;
    }

    onStartJourney(year);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-black to-black opacity-50 z-0 pointer-events-none"></div>

      <div className="z-10 max-w-md w-full text-center space-y-8 animate-fade-in-up">
        <div className="space-y-2">
            <div className="flex justify-center mb-4">
                <Clock className="w-12 h-12 text-white/80" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif-display font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
            The Year<br/>You Were Born
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-mono-display uppercase tracking-widest mt-4">
            A journey back to your origin
            </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative group">
            <input
              type="text"
              value={year}
              onChange={(e) => {
                setYear(e.target.value.replace(/\D/g, '').slice(0, 4));
                setError('');
              }}
              placeholder="1990"
              className="w-full bg-transparent border-b-2 border-neutral-700 text-center text-6xl md:text-7xl font-bold py-4 focus:outline-none focus:border-white transition-colors placeholder-neutral-800 font-serif-display text-white"
              autoFocus
            />
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-xl"></div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-mono-display animate-pulse">{error}</p>
          )}

          <button
            type="submit"
            disabled={!year || year.length !== 4}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg tracking-wide hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
             <span className="relative z-10">Enter Time Machine</span>
             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </form>
      </div>
      
      <div className="absolute bottom-8 text-neutral-600 text-xs font-mono-display">
        Powered by Gemini AI
      </div>
    </div>
  );
};

export default IntroView;
