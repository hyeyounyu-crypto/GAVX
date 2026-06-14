import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

interface AnalysingViewProps {
  lightMode: boolean;
  onFinish: () => void;
  onCancel?: () => void;
}

export default function AnalysingView({ lightMode, onFinish, onCancel }: AnalysingViewProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let currentPct = 0;
    const interval = setInterval(() => {
      if (currentPct < 100) {
        currentPct += Math.floor(Math.random() * 4) + 2; // increments by 2 to 5%
        if (currentPct > 100) currentPct = 100;
        setPercent(currentPct);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onFinish();
        }, 500); // short delay after hitting 100%
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="absolute inset-0 bg-black text-white flex flex-col justify-between p-6 z-[100] animate-fade-in font-sans select-none">
      {/* Top Header - Close X Circular button left aligned */}
      <div className="pt-6">
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center hover:bg-neutral-800 hover:text-white transition-colors"
          title="분석 취소"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Container - Scanning layout - Screenshot 8 */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 px-4">
        {/* Multi stacked cards contour drawing frame */}
        <div className="relative w-60 aspect-[4/5] bg-neutral-900/60 rounded-[36px] border border-neutral-800 shadow-2xl flex items-center justify-center overflow-hidden mb-8">
          {/* Deck background stacked effect sheets */}
          <div className="absolute top-1 w-11/12 aspect-[4/5] rounded-[36px] bg-neutral-950/40 border border-neutral-800 scale-95 opacity-50"></div>
          <div className="absolute top-2 w-10/12 aspect-[4/5] rounded-[36px] bg-neutral-950/40 border border-neutral-800 scale-90 opacity-25"></div>

          {/* Glowing laser swept bar */}
          <div className="absolute left-0 right-0 h-6 bg-[#EAFF20]/20 border-y border-[#EAFF20] flex items-center justify-center shadow-[0_0_20px_rgba(234,255,32,0.6)] animate-scanner z-20">
            <div className="w-full h-[1px] bg-[#EAFF20]"></div>
          </div>

          {/* Center visual icon placeholder matching Screenshot 8 */}
          <div className="flex flex-col items-center justify-center text-center p-6 z-10">
            {/* Outline dynamic landscape contour drawing icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              className="w-24 h-24 text-neutral-600 stroke-[1.2]"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        </div>

        {/* AI Status text header - Screenshot 8 */}
        <h3 className="text-xl font-bold font-sans text-center text-white mb-6">
          AI 분석 중...
        </h3>

        {/* Horizontal linear track bar with percentage text */}
        <div className="w-10/12 flex flex-col items-center">
          <div className="w-full h-1 bg-neutral-900 rounded-full relative overflow-hidden mb-3">
            <div 
              className="h-full bg-[#EAFF20] rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(234,255,32,0.8)]" 
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-[#EAFF20] font-mono">
            {percent}%
          </span>
        </div>
      </div>

      {/* Paragraph detailed labels at bottom - Screenshot 8 */}
      <div className="pb-12 text-center text-xs text-neutral-400 font-sans tracking-tight leading-relaxed max-w-[90%] mx-auto">
        <p className="font-semibold text-neutral-300">파손 부위를 정밀하게 스캔하고 있습니다.</p>
        <p className="mt-1">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
