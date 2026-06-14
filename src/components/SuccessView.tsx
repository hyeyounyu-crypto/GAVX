import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface SuccessViewProps {
  lightMode: boolean;
  onFinish: () => void;
}

export default function SuccessView({ lightMode, onFinish }: SuccessViewProps) {
  // Redirect to report after 1.8 seconds helper
  useEffect(() => {
    const timer = setTimeout(onFinish, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gradient-to-b from-[#EFFFF2] to-[#D4FED9] select-none text-center relative font-sans">
      
      {/* Giant yellow success circle with white check icon - Screenshot 15 */}
      <div className="relative w-32 h-32 rounded-full bg-[#EAFF20] flex items-center justify-center shadow-lg border-2 border-white/85 mb-8 animate-fade-in hover:scale-105 transition-all">
        <Check size={56} className="text-[#328540] stroke-[4]" />

        {/* Pulse rings */}
        <div className="absolute -inset-4 rounded-full bg-[#EAFF20]/25 animate-ping" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Main Title Verbatim - Screenshot 15 */}
      <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight leading-snug font-sans">
        사고 신고가 완료되었습니다!
      </h2>
      
      {/* Description text verbatim - Screenshot 15 */}
      <p className="text-xs text-neutral-600 font-bold mt-2 font-sans">
        곧 예상 청구 금액 분석이 시작됩니다.
      </p>

      {/* Manual transition button */}
      <button
        onClick={onFinish}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#2A7537] hover:underline uppercase tracking-widest cursor-pointer"
      >
        만약 이동하지 않는다면 클릭하세요
      </button>

    </div>
  );
}
