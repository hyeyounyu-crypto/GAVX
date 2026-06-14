import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Sun, Moon } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  lightMode: boolean;
  setLightMode: (val: boolean) => void;
  title?: string;
  onBack?: () => void;
}

export default function DeviceFrame({ children, lightMode, setLightMode, title, onBack }: DeviceFrameProps) {
  const [time, setTime] = useState('13:26');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes: string | number = now.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-[#0a0a0c] transition-colors duration-300 font-sans">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/8 opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Container: Device Container & Desk instructions */}
      <div className="relative flex flex-col items-center w-full max-w-md">
        
        {/* Device Frame */}
        <div 
          id="mobile-phone-emulator"
          className={`relative w-full aspect-[390/844] max-w-[390px] rounded-[48px] border-[10px] shadow-2xl overflow-hidden transition-colors duration-300 flex flex-col select-none
            ${lightMode 
              ? 'bg-slate-50 border-slate-300 text-slate-800 shadow-slate-900/30' 
              : 'bg-dark-bg border-neutral-800 text-neutral-100 shadow-black/80'
            }`}
        >
          {/* Dynamic Island / Notch */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-neutral-900 absolute right-3"></div>
          </div>

          {/* Device Speaker & Camera dots */}
          <div className="absolute top-1 left-1.5 right-1.5 h-10 pointer-events-none z-40 flex items-center justify-between px-6 text-[11px] font-semibold">
            {/* Time */}
            <span className={lightMode ? 'text-black' : 'text-white'}>{time}</span>
            {/* Device Icons Grid */}
            <div className="flex items-center gap-1.5 opacity-80">
              <Signal size={12} className={lightMode ? 'text-black' : 'text-white'} />
              <div className="text-[9px] uppercase tracking-tighter">LTE</div>
              <Wifi size={12} className={lightMode ? 'text-black' : 'text-white'} />
              <div className="flex items-center gap-0.5 ml-0.5">
                <span className="text-[9px]">92%</span>
                <Battery size={14} className={lightMode ? 'text-black' : 'text-white'} />
              </div>
            </div>
          </div>

          {/* Action Bar Header */}
          <div className={`pt-12 px-6 pb-2 border-b flex items-center justify-between z-30 transition-colors duration-200
            ${lightMode 
              ? 'bg-slate-100/90 border-slate-200 text-slate-900' 
              : 'bg-dark-surface/90 border-neutral-800 text-white'
            }`}
          >
            {onBack ? (
              <button 
                id="header-back-button"
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            ) : (
              <div className="w-10"></div>
            )}
            
            <h1 className="text-sm font-bold font-display tracking-tight uppercase">
              {title || 'Predict.AI'}
            </h1>

            {/* Mode Switcher */}
            <button
              id="theme-toggle-button"
              onClick={() => setLightMode(!lightMode)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors
                ${lightMode ? 'hover:bg-slate-200 text-amber-500' : 'hover:bg-neutral-800 text-neon'}`}
              title="테마 변경"
            >
              {lightMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* App Core viewport */}
          <div className="flex-1 overflow-y-auto relative outline-none flex flex-col">
            {children}
          </div>

          {/* Home Swipe Indicator bar */}
          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black/40 rounded-full z-40 pointer-events-none">
            <div className={`w-full h-full rounded-full ${lightMode ? 'bg-slate-300' : 'bg-neutral-700'}`}></div>
          </div>
        </div>

        {/* Outer Help Info */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-neutral-500 mt-1 max-w-[320px] leading-relaxed">
            본 화면은 실제 모바일 기기 규격에 최적화된 고해상도 예측 시뮬레이터입니다. 우측 상단의 테마 버튼을 터치하여 라이트/다크 디자인 모드를 실시간으로 전개해 볼 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
