import React from 'react';
import { User, Car, Building, MoreHorizontal, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { IncidentDetails } from '../types';

interface DetailsViewProps {
  lightMode: boolean;
  onNext: () => void;
  onBack: () => void;
  details: IncidentDetails;
  setDetails: React.Dispatch<React.SetStateAction<IncidentDetails>>;
}

export default function DetailsView({ lightMode, onNext, onBack, details, setDetails }: DetailsViewProps) {
  
  // Spacing excluded character counter
  const getCharCountNoSpaces = (text: string) => {
    return text.replace(/\s/g, '').length;
  };

  const currentNoSpacesCount = getCharCountNoSpaces(details.accidentDetailsText);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawVal = e.target.value;
    const noSpaces = getCharCountNoSpaces(rawVal);
    
    // Physical block of further inputs if spacing-excluded count exceeds 500
    if (noSpaces <= 500) {
      setDetails(prev => ({ ...prev, accidentDetailsText: rawVal }));
    } else {
      // Auto crop/truncate
      let cropped = '';
      let runningCount = 0;
      for (let i = 0; i < rawVal.length; i++) {
        const char = rawVal[i];
        if (char !== ' ' && char !== '\n') {
          runningCount++;
        }
        if (runningCount <= 500) {
          cropped += char;
        } else {
          break;
        }
      }
      setDetails(prev => ({ ...prev, accidentDetailsText: cropped }));
    }
  };

  const toggleParty = (partyId: string) => {
    setDetails(prev => {
      const idx = prev.involvedParties.indexOf(partyId);
      if (idx > -1) {
        return {
          ...prev,
          involvedParties: prev.involvedParties.filter(p => p !== partyId)
        };
      } else {
        return {
          ...prev,
          involvedParties: [...prev.involvedParties, partyId]
        };
      }
    });
  };

  return (
    /* Vibrant full yellow-neon background - Screenshot 14 wrapper */
    <div className="flex-1 flex flex-col bg-[#EAFF20] p-5 overflow-y-auto pb-32 select-none font-sans">
      
      {/* 1. Black progress timeline capsule - Highlight all 3 stages fully */}
      <div className="px-5 py-3.5 mb-5 rounded-[24px] bg-black text-white flex flex-col gap-1.5 shadow justify-center">
        {/* Progress track */}
        <div className="relative h-1.5 w-full bg-neutral-800 rounded-full mt-1">
          {/* Yellow progress indicators */}
          <div className="absolute top-0 left-0 h-full w-[100%] bg-[#EAFF20] rounded-full"></div>
          {/* Node dots */}
          <div className="absolute top-1/2 left-[12%] -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#EAFF20] ring-4 ring-black"></div>
          <div className="absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#EAFF20] ring-4 ring-black"></div>
          <div className="absolute top-1/2 left-[88%] -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#EAFF20] ring-4 ring-black"></div>
        </div>
        <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold">
          <span className="text-[#EAFF20]">사진</span>
          <span className="text-[#EAFF20] translate-x-1">유형</span>
          <span className="text-[#EAFF20]">상세</span>
        </div>
      </div>

      {/* Involved Party Section - Screenshot 14 */}
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-black font-sans leading-tight">Involved Party</h2>
        
        {/* Subtitle tag */}
        <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold rounded-full mt-1 px-3 shadow-sm select-none uppercase tracking-wide">
          Select the parties involved
        </div>

        {/* 4 White Rounded Cards Grid */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { id: 'person', label: 'Person.', icon: <User size={24} className="stroke-[1.5]" /> },
            { id: 'car', label: 'Car.', icon: <Car size={24} className="stroke-[1.5]" /> },
            { id: 'facility', label: 'Facility.', icon: <Building size={24} className="stroke-[1.5]" /> },
            { id: 'ect', label: 'ect.', icon: <MoreHorizontal size={24} className="stroke-[1.5]" /> }
          ].map((item) => {
            const isSelected = details.involvedParties.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleParty(item.id)}
                className={`aspect-[4/5] rounded-3xl bg-white flex flex-col items-center justify-center gap-1.5 relative select-none transition-all cursor-pointer shadow-sm border-2
                  ${isSelected
                    ? 'border-black scale-102 ring-2 ring-black/10'
                    : 'border-white hover:border-neutral-200'
                  }`}
              >
                {/* Check ring indicator top right */}
                <div className="absolute top-2 right-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-black border-black text-white' : 'bg-transparent border-neutral-300'}`}
                  >
                    {isSelected && <span className="text-[8px] font-bold">✓</span>}
                  </div>
                </div>

                {/* Card Icon */}
                <span className={`transition-colors duration-200 ${isSelected ? 'text-black' : 'text-neutral-400'}`}>
                  {item.icon}
                </span>

                {/* Card Label */}
                <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-tight font-sans">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accident Details Section - Screenshot 14 */}
      <div className="mb-6 flex flex-col">
        <h2 className="text-lg font-extrabold text-black font-sans leading-tight">Accident Details</h2>
        <span className="text-[11px] font-bold text-neutral-800 mt-0.5">Write down the accident details</span>

        {/* White Textarea Container Card */}
        <div className="mt-3 bg-white rounded-[28px] p-5 shadow-sm border border-neutral-100 flex flex-col">
          <textarea
            value={details.accidentDetailsText}
            onChange={handleTextChange}
            placeholder="예) 오후 3시경, 주차장에서 후진 중 차량과 접촉했습니다. 범퍼 스크래치 외 인명 피해는 없습니다."
            className="w-full text-xs font-medium text-neutral-800 placeholder-neutral-400 leading-relaxed outline-none resize-none h-28 border-0 p-0 focus:ring-0"
            maxLength={600}
          />

          {/* Spacer char indicator on bottom right */}
          <div className="flex justify-between items-center mt-3 border-t border-neutral-100 pt-3">
            <span className="text-[10px] text-neutral-400 flex items-center gap-1">
              <AlertCircle size={12} className="text-neutral-450" />
              공백(Space)은 카운트 제외
            </span>
            <div className="flex items-center text-[10px] font-mono font-bold">
              <span className={`transition-colors duration-200
                ${details.accidentDetailsText.length === 0 
                  ? 'text-neutral-400' 
                  : (currentNoSpacesCount >= 480 ? 'text-red-600 font-extrabold' : 'text-blue-600')
                }`}
              >
                {currentNoSpacesCount}
              </span>
              <span className="text-neutral-400"> / </span>
              <span className={`font-semibold ${currentNoSpacesCount >= 480 ? 'text-red-600' : 'text-neutral-400'}`}>
                500자
              </span>
            </div>
          </div>
        </div>

        {/* Guidelines List under textarea - Screenshot 14 */}
        <div className="mt-4 px-1 select-none">
          <ul className="text-[11px] text-neutral-800 font-bold leading-relaxed space-y-1.5 font-sans">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
              <span>사고 발생 시각을 기재해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
              <span>사고 경위와 상황을 구체적으로 작성해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
              <span>목격자가 있다면 연락처를 함께 남겨주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></span>
              <span>경찰 신고 여부를 기재해주세요</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Gigantic Premium Solid Black Button - Screenshot 14 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] p-5 bg-transparent rounded-b-[40px] z-50 flex gap-2">
        <button
          onClick={onBack}
          className="px-5 py-4 rounded-full bg-black text-white hover:bg-neutral-900 text-xs font-bold transition-all shadow active:scale-95"
        >
          이전으로
        </button>
        <button
          onClick={onNext}
          disabled={currentNoSpacesCount === 0}
          className={`flex-1 py-4 rounded-full text-xs font-extrabold tracking-wide text-center flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]
            ${currentNoSpacesCount > 0 
              ? 'bg-black text-white hover:bg-neutral-900' 
              : 'bg-black/40 text-neutral-400 cursor-not-allowed border-black/10'}`}
        >
          <Sparkles size={14} className="text-[#EAFF20] animate-pulse" />
          <span>AI 견적 분석 하기</span>
          <ChevronRight size={14} className="text-white" />
        </button>
      </div>

    </div>
  );
}
