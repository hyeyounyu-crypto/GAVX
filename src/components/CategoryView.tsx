import React, { useState } from 'react';
import { MapPin, Phone, RefreshCw, Layers, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Check, BookOpen, Navigation, Menu, Crosshair, AlertCircle } from 'lucide-react';
import { DamagePart, SeatStatus } from '../types';

interface CategoryViewProps {
  lightMode: boolean;
  onNext: () => void;
  onBack: () => void;
  damageParts: DamagePart[];
  setDamageParts: React.Dispatch<React.SetStateAction<DamagePart[]>>;
  damageSeverity: number;
  setDamageSeverity: (val: number) => void;
  dirtySeats: SeatStatus[];
  setDirtySeats: React.Dispatch<React.SetStateAction<SeatStatus[]>>;
  dirtSeverity: number;
  setDirtSeverity: (val: number) => void;
  activeCategories: string[];
  setActiveCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function CategoryView({
  lightMode,
  onNext,
  onBack,
  damageParts,
  setDamageParts,
  damageSeverity,
  setDamageSeverity,
  dirtySeats,
  setDirtySeats,
  dirtSeverity,
  setDirtSeverity,
  activeCategories,
  setActiveCategories
}: CategoryViewProps) {
  // Currently expanded block: 'undrivable' | 'damaged' | 'condition' | 'ect'
  const [expandedSection, setExpandedSection] = useState<'undrivable' | 'damaged' | 'condition' | 'ect' | null>(null);
  
  // Selected model name state
  const [carModel, setCarModel] = useState<string>('테슬라 모델 S');
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);

  // Selected pollution types
  const [contaminationType, setContaminationType] = useState<string>('음식물');

  // Toggle category checkbox selection
  const toggleCategory = (catId: string) => {
    setActiveCategories((prev) => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const toggleDamagePart = (id: string) => {
    setDamageParts((prev) => prev.map(p => {
      if (p.id === id) {
        return { ...p, selected: !p.selected };
      }
      return p;
    }));
    if (!activeCategories.includes('damaged')) {
      setActiveCategories(prev => [...prev, 'damaged']);
    }
  };

  const toggleSeat = (id: string) => {
    setDirtySeats((prev) => prev.map(s => {
      if (s.id === id) {
        return { ...s, selected: !s.selected };
      }
      return s;
    }));
    if (!activeCategories.includes('condition')) {
      setActiveCategories(prev => [...prev, 'condition']);
    }
  };

  const availableModels = [
    '테슬라 모델 S',
    '테슬라 모델 3',
    '현대 아반떼 CN7',
    '기아 EV6 GT-Line',
    '제네시스 G80'
  ];

  return (
    <div className="flex-1 flex flex-col p-5 overflow-y-auto bg-transparent pb-32">
      
      {/* 1. Progress Step Indicator - Matches Case Stage 2 */}
      <div className="px-5 py-3.5 mb-5 rounded-[24px] bg-black text-white flex flex-col gap-1.5 shadow-md justify-center">
        {/* Progress tracks */}
        <div className="relative h-1.5 w-full bg-neutral-800 rounded-full mt-1">
          {/* Lime progress indicators */}
          <div className="absolute top-0 left-0 h-full w-[50%] bg-[#EAFF20] rounded-full"></div>
          {/* Node dots */}
          <div className="absolute top-1/2 left-[12%] -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#EAFF20] ring-4 ring-black"></div>
          <div className="absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#EAFF20] ring-4 ring-black"></div>
          <div className="absolute top-1/2 left-[88%] -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-neutral-600 ring-4 ring-black"></div>
        </div>
        <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold font-sans">
          <span className="text-[#EAFF20]">사진</span>
          <span className="text-[#EAFF20] translate-x-1">유형</span>
          <span className="text-neutral-500">상세</span>
        </div>
      </div>

      {/* Accordion list */}
      <div className="flex flex-col gap-3.5">
        
        {/* =================== OPTION 1: Undrivable. Card - Screenshot 10 =================== */}
        <div 
          className="rounded-[32px] overflow-hidden border border-[#EAFF20] bg-[#EAFF20] text-black transition-all duration-300 shadow-sm"
        >
          {/* Header */}
          <div 
            onClick={() => {
              setExpandedSection(expandedSection === 'undrivable' ? null : 'undrivable');
              if (!activeCategories.includes('undrivable')) {
                toggleCategory('undrivable');
              }
            }}
            className="p-5 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              {/* Checklist box */}
              <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all 
                ${expandedSection === 'undrivable' 
                  ? 'border-black bg-black text-[#EAFF20]' 
                  : (activeCategories.includes('undrivable') ? 'border-neutral-800 bg-neutral-800 text-white' : 'border-neutral-300')}`}
              >
                {(expandedSection === 'undrivable' || activeCategories.includes('undrivable')) && <Check size={14} strokeWidth={3} />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold font-sans">Undrivable.</span>
                {/* Book icon */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px]
                  ${expandedSection === 'undrivable' ? 'bg-black text-[#EAFF20]' : 'bg-neutral-200 text-neutral-600'}`}>
                  <BookOpen size={10} />
                </div>
              </div>
            </div>
            {expandedSection === 'undrivable' ? <ChevronUp size={18} className="text-black" /> : <ChevronDown size={18} />}
          </div>

          {/* Expanded Content */}
          {expandedSection === 'undrivable' && (
            <div className="px-5 pb-5 pt-1 text-xs">
              <p className="font-semibold leading-relaxed text-neutral-900 mb-4 whitespace-pre-line">
                {`내 위치가 맞나요?
현재 자신의 위치를 확인한 후,
근처에 있는 견인 업체를 확인하고 연결할 수 있어요.`}
              </p>

              {/* Geographical Map Box */}
              <div className="mt-2 mb-4">
                <span className="font-extrabold text-[11px] text-neutral-800 uppercase tracking-wider mb-2 block font-mono">Location</span>
                
                {/* Simulated Custom Vector roadmap matching mockup 10 */}
                <div className="w-full h-44 rounded-2xl relative overflow-hidden bg-[#E4EFD6] border border-neutral-900/10 shadow-inner">
                  {/* Roadways drawing */}
                  <div className="absolute top-0 bottom-0 left-[40%] w-8 bg-[#FFFFFD] rotate-12"></div>
                  <div className="absolute left-0 right-0 top-[50%] h-10 bg-[#FFFFFD] -rotate-6"></div>
                  
                  {/* Water canals drawing */}
                  <div className="absolute right-0 bottom-0 top-[60%] w-20 bg-blue-200 rounded-tl-[80px]"></div>

                  {/* Tow Truck Pin icon on roadmap */}
                  <div className="absolute top-[28%] left-[28%] flex flex-col items-center">
                    <div className="px-2 py-0.5 rounded-md bg-black text-white text-[9px] font-bold shadow-md flex items-center gap-1 z-10 whitespace-nowrap">
                      🚛 견인차 2km 인근
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping absolute top-5"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center mt-1 border border-white text-[10px] font-bold">
                      ★
                    </div>
                  </div>

                  {/* Target Red marker point */}
                  <div className="absolute top-[55%] left-[55%] flex flex-col items-center">
                    <MapPin size={28} className="text-red-500 drop-shadow fill-red-500" />
                    <div className="w-2 h-2 rounded-full bg-red-400 absolute bottom-[-2px] animate-pulse"></div>
                  </div>

                  {/* Address Pill Overlay bottom center - Screenshot 10 */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black text-white text-[10px] font-bold shadow flex items-center gap-1.5 whitespace-nowrap">
                    📍 서울 강남구 테헤란로 152
                  </div>

                  {/* Map Scale Circle expand icon */}
                  <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white text-black shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                    <Navigation size={12} className="rotate-45 text-neutral-800" />
                  </button>
                </div>
              </div>

              {/* Three action controllers at bottom of map - Screenshot 10 */}
              <div className="mt-3 flex items-center gap-2">
                {/* Menu list button circle */}
                <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-900 active:scale-95 transition-all">
                  <Menu size={16} />
                </button>

                {/* Telephone hook wide pill */}
                <button className="flex-1 h-10 rounded-full bg-white text-black hover:bg-neutral-50 border border-neutral-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-sm">
                  📞 긴급 견인업체 전화연결
                </button>

                {/* GPS current target location button circle */}
                <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-900 active:scale-95 transition-all">
                  <Crosshair size={16} />
                </button>
              </div>
            </div>
          )}
        </div>


        {/* =================== OPTION 2: Damaged. Card - Screenshot 11 =================== */}
        <div 
          className={`rounded-[32px] overflow-hidden border transition-all duration-300 shadow-sm
            ${expandedSection === 'damaged' 
              ? 'bg-[#111111] border-[#111111] text-white' 
              : 'bg-neutral-300 border-neutral-300 text-neutral-900'}`}
        >
          {/* Header */}
          <div 
            onClick={() => {
              setExpandedSection(expandedSection === 'damaged' ? null : 'damaged');
              if (!activeCategories.includes('damaged')) {
                toggleCategory('damaged');
              }
            }}
            className="p-5 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all 
                ${expandedSection === 'damaged' 
                  ? 'border-white bg-[#EAFF20] text-black' 
                  : (activeCategories.includes('damaged') ? 'border-neutral-800 bg-neutral-800 text-white' : 'border-neutral-300')}`}
              >
                {(expandedSection === 'damaged' || activeCategories.includes('damaged')) && <Check size={14} strokeWidth={3} />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold font-sans">Damaged.</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px]
                  ${expandedSection === 'damaged' ? 'bg-[#EAFF20] text-black' : 'bg-neutral-200 text-neutral-600'}`}>
                  <BookOpen size={10} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                ${expandedSection === 'damaged' ? 'bg-[#EAFF20]/20 text-[#EAFF20]' : 'bg-neutral-200 text-neutral-600'}`}>
                {damageParts.filter(p => p.selected).length}곳 파손
              </span>
              {expandedSection === 'damaged' ? <ChevronUp size={18} className="text-white" /> : <ChevronDown size={18} />}
            </div>
          </div>

          {/* Expanded Content */}
          {expandedSection === 'damaged' && (
            <div className="px-5 pb-5 pt-1 text-xs">
              
              {/* Select Dropdown Tesla - Screenshot 11 */}
              <div className="relative mb-4">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-neutral-200 text-xs font-bold hover:bg-neutral-850 active:scale-[0.99] transition-transform"
                >
                  <span>{carModel}</span>
                  <ChevronDown size={14} className="text-neutral-400" />
                </button>

                {showModelDropdown && (
                  <div className="absolute left-0 right-0 top-11 bg-neutral-900 border border-neutral-800 rounded-xl mt-1 py-1 shadow-2xl z-45 overflow-hidden">
                    {availableModels.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setCarModel(m);
                          setShowModelDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-neutral-200 hover:bg-[#EAFF20] hover:text-black text-xs font-bold transition-all"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtitles */}
              <h4 className="text-sm font-extrabold text-neutral-100 mt-5">차량 파손 부위</h4>
              <p className="text-[11px] text-neutral-400 mt-1 mb-4 leading-relaxed">
                파손된 부위를 여러 각도로 확인한 후 진행해 주세요.
              </p>

              {/* Interactive diagram vehicle contour spot markers */}
              <div className="w-full py-6 rounded-2xl bg-neutral-900 border border-neutral-850 flex flex-col items-center justify-center relative overflow-hidden mb-5">
                <div className="absolute top-2 left-3 font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                  {carModel} isometric view
                </div>

                <div className="relative w-10/12 max-w-[260px] aspect-[1.8] flex items-center justify-center my-3">
                  {/* Clean isometric car schematic image */}
                  <img 
                    src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400" 
                    alt="Tesla car graphic schematic view" 
                    className="w-full h-full object-contain opacity-55 mix-blend-screen"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hotspots spot click selection points - Screenshot 11 circles */}
                  {damageParts.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => toggleDamagePart(part.id)}
                      className="absolute group z-20 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${part.x}%`, top: `${part.y}%` }}
                    >
                      <span className="relative flex h-7 w-7">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-65 ${part.selected ? 'bg-red-500' : 'bg-transparent'}`}></span>
                        <span className={`relative inline-flex rounded-full h-7 w-7 items-center justify-center shadow-lg transition-all border
                          ${part.selected 
                            ? 'bg-red-500 text-white border-white scale-115' 
                            : 'bg-black/60 border-neutral-700 text-neutral-300'
                          }`}
                        >
                          <AlertCircle size={14} className={part.selected ? 'animate-bounce text-white' : 'text-neutral-300'} />
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Directly selectable pills list */}
              <div className="mb-5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-neutral-400 block mb-2">
                  바로 가기
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {damageParts.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => toggleDamagePart(part.id)}
                      className={`px-3 py-1.5 rounded-full font-extrabold text-[11px] transition-all cursor-pointer
                        ${part.selected 
                          ? 'bg-[#EAFF20] text-black' 
                          : 'bg-neutral-900 text-neutral-300 border border-neutral-800'}`}
                    >
                      {part.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Damage intensity slider - Screenshot 11 */}
              <div className="mt-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-850">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-[11px] text-neutral-400 font-sans tracking-wide uppercase">
                    파손 정도
                  </span>
                  <span className="text-xs font-extrabold text-[#EAFF20]">
                    {damageSeverity < 33 ? '살짝 긁힘' : damageSeverity < 66 ? '확실한 손상' : '주행 불가'}
                  </span>
                </div>
                
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={damageSeverity}
                  onChange={(e) => setDamageSeverity(Number(e.target.value))}
                  className="w-full accent-white bg-neutral-800 h-1.5 rounded-full appearance-none cursor-pointer"
                />

                <div className="flex justify-between text-[9px] text-neutral-500 font-bold mt-2 font-sans">
                  <span>살짝 긁힘</span>
                  <span>확실한 손상</span>
                  <span>주행 불가</span>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* =================== OPTION 3: Condition. Card - Screenshot 12-13 =================== */}
        <div 
          className={`rounded-[32px] overflow-hidden border transition-all duration-300 shadow-sm
            ${expandedSection === 'condition' 
              ? 'bg-white border-neutral-250 text-black shadow-lg' 
              : 'bg-neutral-200 border-neutral-200 text-neutral-900'}`}
        >
          {/* Header */}
          <div 
            onClick={() => {
              setExpandedSection(expandedSection === 'condition' ? null : 'condition');
              if (!activeCategories.includes('condition')) {
                toggleCategory('condition');
              }
            }}
            className="p-5 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all 
                ${expandedSection === 'condition' 
                  ? 'border-neutral-900 bg-neutral-900 text-[#EAFF20]' 
                  : (activeCategories.includes('condition') ? 'border-neutral-800 bg-neutral-800 text-white' : 'border-neutral-300')}`}
              >
                {(expandedSection === 'condition' || activeCategories.includes('condition')) && <Check size={14} strokeWidth={3} />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold font-sans">Condition.</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px]
                  ${expandedSection === 'condition' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                  <BookOpen size={10} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                ${expandedSection === 'condition' ? 'bg-neutral-900/10 text-neutral-900' : 'bg-neutral-200 text-neutral-600'}`}>
                {dirtySeats.filter(s => s.selected).length}석 오염
              </span>
              {expandedSection === 'condition' ? <ChevronUp size={18} className="text-black" /> : <ChevronDown size={18} />}
            </div>
          </div>

          {/* Expanded Content */}
          {expandedSection === 'condition' && (
            <div className="px-5 pb-5 pt-1 text-xs">
              
              {/* OYUM CHIPS - Screenshot 12 */}
              <div className="mb-4">
                <span className="text-[11px] font-extrabold text-neutral-600 uppercase tracking-widest block mb-2 font-sans">
                  오염 유형
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {['음식물', '음료수', '흙 / 먼지', '토사물'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setContaminationType(type)}
                      className={`py-2 text-center rounded-xl font-extrabold text-[11px] transition-all cursor-pointer
                        ${contaminationType === type
                          ? 'bg-black text-[#EAFF20] shadow-sm' 
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-200'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clean seat grid layout - Screenshot 13 */}
              <div className="mb-4">
                <span className="text-[11px] font-extrabold text-neutral-600 uppercase tracking-widest block mb-1 font-sans">
                  오염 위치 선택
                </span>
                <span className="text-[10px] text-neutral-400 block mb-3 leading-relaxed">
                  오염 된 영역을 확인한 후 모두 선택해주세요.
                </span>

                {/* Grid model box styling */}
                <div className="w-full py-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col items-center">
                  <div className="w-10/12 max-w-[170px] border border-neutral-200 rounded-[32px] p-4 bg-white relative shadow-sm">
                    {/* Dashboard indicator tab */}
                    <div className="h-1 w-1/3 bg-neutral-200 mx-auto rounded-b mb-4 text-center text-[7px] text-neutral-400 tracking-wider font-mono uppercase">
                      FRONT
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                      {dirtySeats.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat.id)}
                          className={`aspect-[4/5] rounded-xl border flex flex-col items-center justify-center p-1.5 cursor-pointer transition-all active:scale-95
                            ${seat.selected
                              ? 'bg-[#EAFF20] border-[#EAFF20] text-black font-extrabold shadow-md'
                              : 'bg-neutral-50 border-neutral-250 text-neutral-500'
                            }`}
                        >
                          <span className="text-[9px] uppercase tracking-tight block text-center leading-tight font-sans">{seat.name}</span>
                          {seat.selected && <Check size={11} className="text-black mt-1 stroke-[3.5]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pollution slider controller - Screenshot 13 */}
              <div className="p-4 rounded-2xl bg-neutral-100/80 border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-[11px] text-neutral-600 uppercase tracking-wider font-sans">
                    오염 정도
                  </span>
                  <span className="text-xs font-extrabold text-[#76A035]">
                    {dirtSeverity < 33 ? '가벼움' : dirtSeverity < 66 ? '보통' : '심한 상태'}
                  </span>
                </div>
                
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={dirtSeverity}
                  onChange={(e) => setDirtSeverity(Number(e.target.value))}
                  className="w-full accent-black bg-neutral-200 h-1.5 rounded-full appearance-none cursor-pointer"
                />

                <div className="flex justify-between text-[9px] text-neutral-400 font-bold mt-2 font-sans">
                  <span>가벼움</span>
                  <span>보통</span>
                  <span>심한 상태</span>
                </div>
              </div>

            </div>
          )}
        </div>


        {/* =================== OPTION 4: Ect. Card =================== */}
        <div 
          className="rounded-[32px] overflow-hidden border border-neutral-900 bg-neutral-900 text-white transition-all duration-300 shadow-sm"
        >
          {/* Header */}
          <div 
            onClick={() => {
              setExpandedSection(expandedSection === 'ect' ? null : 'ect');
              if (!activeCategories.includes('ect')) {
                toggleCategory('ect');
              }
            }}
            className="p-5 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all 
                ${expandedSection === 'ect' 
                  ? 'border-white bg-[#EAFF20] text-black' 
                  : (activeCategories.includes('ect') ? 'border-neutral-800 bg-neutral-800 text-white' : 'border-neutral-300')}`}
              >
                {(expandedSection === 'ect' || activeCategories.includes('ect')) && <Check size={14} strokeWidth={3} />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold font-sans">ect.</span>
              </div>
            </div>
            {expandedSection === 'ect' ? <ChevronUp size={18} className="text-white" /> : <ChevronDown size={18} />}
          </div>

          {/* Content */}
          {expandedSection === 'ect' && (
            <div className="px-5 pb-5 pt-1 text-xs border-t border-neutral-800">
              <p className="text-neutral-300 leading-relaxed leading-normal">
                그 외 전자기기 오동작, 브레이크 계통 이상, 기타 외부 요인 등을 다음 단계 "사고 상세"란에 적을 수 있습니다.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Floating Lower Navigation Stickies - Screenshot 9 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] p-5 border-t border-neutral-200 bg-white/95 backdrop-blur-md rounded-b-[40px] z-50 flex gap-2">
        <button
          onClick={onBack}
          className="px-5 py-4 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-bold transition-colors shadow-sm"
        >
          이전으로
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-full bg-[#EAFF20] text-black text-xs font-bold hover:bg-[#DFFF00] transition-colors shadow-md text-center flex items-center justify-center gap-1.5"
        >
          선택 완료 <span className="font-mono">→</span>
        </button>
      </div>

    </div>
  );
}