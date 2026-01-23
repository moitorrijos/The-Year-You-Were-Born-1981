import React, { useEffect, useState, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';
import Footer from './Footer';

interface StoryViewProps {
  story: string;
  year: string;
  onReset: () => void;
}

const StoryView: React.FC<StoryViewProps> = ({ story, year, onReset }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [opacity, setOpacity] = useState(0);
  const textContainerRef = useRef<HTMLDivElement>(null);
  
  // Audio context for "typing" sound effect could go here, but keeping it visual for now
  
  useEffect(() => {
    // Fade in the container first
    setTimeout(() => setOpacity(1), 100);

    let index = 0;
    // Faster typing speed for better UX on long texts
    const typingSpeed = 30; 
    
    const interval = setInterval(() => {
      if (index < story.length) {
        setDisplayedText((prev) => prev + story.charAt(index));
        index++;
        
        // Auto-scroll to bottom while typing
        if (textContainerRef.current) {
            // Only auto-scroll if user is near bottom to allow reading previous parts
            const { scrollTop, scrollHeight, clientHeight } = textContainerRef.current;
            if (scrollHeight - scrollTop - clientHeight < 100) {
                 textContainerRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
            }
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
        const buttonContainer = document.querySelector('.bmc-btn-container')
        if (buttonContainer) {
          (buttonContainer as HTMLElement).style.visibility = 'visible';
          (buttonContainer as HTMLElement).style.opacity = '1';
        }
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [story]);

  // Format the text to handle bolding and newlines slightly better visually
  const formattedText = displayedText.split('\n').map((line, i) => (
    <span key={i} className="block mb-4 leading-relaxed">
      {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </span>
  ));

  return (
    <div 
      className="min-h-screen bg-black text-neutral-300 flex flex-col transition-opacity duration-1000"
      style={{ opacity }}
    >
      {/* Header */}
      <header className="flex-none p-6 flex justify-between items-center border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-2xl font-serif-playfair font-bold text-white">{year}</h1>
        <button 
          onClick={onReset}
          className="p-2 hover:bg-white/10 rounded-full transition-colors group"
          title="Travel to another year"
        >
          <RefreshCcw className="w-5 h-5 text-neutral-400 group-hover:text-white transition-transform group-hover:-rotate-180 duration-500" />
        </button>
      </header>

      {/* Main Content */}
      <main 
        className="flex-grow overflow-y-auto px-4 md:px-8 lg:px-20 py-12 relative"
        ref={textContainerRef}
      >
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-lg md:prose-xl max-w-none">
            <div className="font-serif-playfair text-lg md:text-2xl text-neutral-200">
               {formattedText}
               {isTyping && <span className="inline-block w-2 h-6 md:h-8 bg-white ml-1 animate-blink align-middle"></span>}
            </div>
          </div>
        </div>
      </main>

      <div className="mx-auto py-8 px-4 text-center">
        <Footer />   
      </div> 
      
      
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
};

export default StoryView;
