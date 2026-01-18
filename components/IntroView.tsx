import React, { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";

interface IntroViewProps {
  onStartJourney: (year: string) => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onStartJourney }) => {
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yearNum = parseInt(year, 10);
    const currentYear = new Date().getFullYear();

    if (isNaN(yearNum) || year.length !== 4) {
      setError("Please enter a valid 4-digit year.");
      return;
    }

    if (yearNum < 1900 || yearNum > currentYear) {
      setError(`Please enter a year between 1900 and ${currentYear}.`);
      return;
    }

    onStartJourney(year);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 text-white">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-black to-black opacity-50"></div>

      <div className="animate-fade-in-up z-10 w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <div className="mb-4 flex justify-center">
            <Clock className="h-12 w-12 text-white/80" />
          </div>
          <h1 className="font-serif-display bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-5xl font-bold tracking-tighter text-transparent md:text-6xl">
            The Year
            <br />
            You Were Born
          </h1>
          <p className="font-mono-display mt-4 text-sm uppercase tracking-widest text-neutral-400 md:text-base">
            A journey back to your origin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="group relative">
            <input
              type="text"
              value={year}
              onChange={(e) => {
                setYear(e.target.value.replace(/\D/g, "").slice(0, 4));
                setError("");
              }}
              placeholder="1990"
              className="font-serif-display w-full border-b-2 border-neutral-700 bg-transparent py-4 text-center text-6xl font-bold text-white placeholder-neutral-800 transition-colors focus:border-white focus:outline-none md:text-7xl"
              autoFocus
            />
            <div className="pointer-events-none absolute inset-0 bg-white/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100"></div>
          </div>

          {error && (
            <p className="font-mono-display animate-pulse text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!year || year.length !== 4}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold tracking-wide text-black transition-all hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10">Enter Time Machine</span>
            <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]"></div>
          </button>
        </form>
      </div>

      <div className="font-mono-display absolute bottom-8 text-xs text-neutral-600">
        Created by{" "}
        <a
          href="https://frontendjuan.com"
          className="text-neutral-400 underline hover:text-neutral-500"
        >
          FrontEndJuan
        </a>{" "}
        with the help of Gemini AI. Inspired by the awesome website{" "}
        <a
          href="https://whathappenedinmybirthyear.com"
          className="text-neutral-400 underline hover:text-neutral-500"
        >
          What Happend The Year You Were Born
        </a>
        .
      </div>
    </div>
  );
};

export default IntroView;
