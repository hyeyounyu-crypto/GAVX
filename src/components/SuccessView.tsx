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
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white select-none text-center relative overflow-hidden font-sans">

      {/* Soft yellow glow rising from the bottom - Screenshot 15 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-96 bg-[#EAFF20]/30 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Giant yellow success circle with white check icon - Screenshot 15 */}
      <div className="relative w-32 h-32 rounded-full bg-gradient-to-b from-[#F2FF6A] to-[#E2F500] flex items-center justify-center shadow-[0_8px_30px_rgba(234,255,32,0.45)] border-[3px] border-white mb-9 animate-fade-in hover:scale-105 transition-all z-10">
        <Check size={58} className="text-white stroke-[4]" />

        {/* Pulse ring */}
        <div className="absolute -inset-3 rounded-full bg-[#EAFF20]/25 animate-ping" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Main Title Verbatim - Screenshot 15 */}
      <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight leading-snug font-sans z-10">
        사고 신고가 완료되었습니다!
      </h2>

      {/* Description text verbatim - Screenshot 15 */}
      <p className="text-sm text-neutral-400 font-bold mt-2.5 font-sans z-10">
        곧 예상 청구 금액 분석이 시작됩니다.
      </p>

      {/* Manual transition button */}
      <button
        onClick={onFinish}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-neutral-400 hover:text-neutral-600 hover:underline uppercase tracking-widest cursor-pointer z-10"
      >
        만약 이동하지 않는다면 클릭하세요
      </button>

    </div>
  );
}