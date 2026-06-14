import React, { useState, useEffect } from 'react';
import { Sparkles, Wrench, Shield, FileText, Home, Download, ArrowUpDown, ChevronDown, Check, X } from 'lucide-react';
import { UploadedPhoto, IncidentDetails, DamagePart, SeatStatus, SimilarCase } from '../types';
import { SIMILAR_CASES } from '../data';

interface ReportViewProps {
  lightMode: boolean;
  onGoHome: () => void;
  photos: UploadedPhoto[];
  damageParts: DamagePart[];
  damageSeverity: number;
  dirtySeats: SeatStatus[];
  dirtSeverity: number;
  details: IncidentDetails;
  activeCategories: string[];
}

export default function ReportView({
  lightMode,
  onGoHome,
  photos,
  damageParts,
  damageSeverity,
  dirtySeats,
  dirtSeverity,
  details,
  activeCategories
}: ReportViewProps) {
  const [activeTab, setActiveTab] = useState<'result' | 'similar'>('result');
  const [sortBy, setSortBy] = useState<'similarity' | 'cost' | 'newest'>('similarity');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedCase, setSelectedCase] = useState<SimilarCase | null>(null);

  // PDF simulator modal popup
  const [showPdfView, setShowPdfView] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Core values mapped visually based on selection results or Screenshot 16
  const [repairCost, setRepairCost] = useState(320);
  const [insuranceCost, setInsuranceCost] = useState(100);
  const [idleCost, setIdleCost] = useState(65);
  const [totalCost, setTotalCost] = useState(485);
  const [minCost, setMinCost] = useState(420);
  const [maxCost, setMaxCost] = useState(550);
  const [daysCount, setDaysCount] = useState(2);

  // Sync calculation parameters to keep experience fully responsive.
  // The default scenario (no specific parts selected) intentionally resolves
  // to the canonical mockup figures: 320 / 100 / 65 = 485만원.
  useEffect(() => {
    const partsCount = damageParts.filter(p => p.selected).length;
    const seatsCount = dirtySeats.filter(s => s.selected).length;

    // 1) 예상 수리비 — base + parts + severity + cleaning add-on
    const baseRepair = partsCount === 0 ? 320 : 220 + partsCount * 45;
    const severityAdj = Math.round((damageSeverity - 35) * 1.2); // 0 at default severity
    const cleanAdd = seatsCount * 15 + (seatsCount > 0 ? Math.round(dirtSeverity * 0.2) : 0);
    const computedRepair = Math.max(50, baseRepair + severityAdj + cleanAdd);

    // 2) 자차 면책금 — fixed self-pay deductible (consistent with all similar cases)
    const computedSelfPay = 100;

    // 3) 휴차료 — driven by repair days
    const computedDays = Math.max(1, 2 + Math.round((damageSeverity - 35) / 30) + Math.floor(partsCount / 2));
    const computedIdle = partsCount === 0 && computedDays === 2 ? 65 : computedDays * 32;

    const calculatedSum = computedRepair + computedSelfPay + computedIdle;

    setRepairCost(computedRepair);
    setInsuranceCost(computedSelfPay);
    setIdleCost(computedIdle);
    setDaysCount(computedDays);
    setTotalCost(calculatedSum);

    setMinCost(Math.round(calculatedSum * 0.87));
    setMaxCost(Math.round(calculatedSum * 1.13));
  }, [damageParts, dirtySeats, damageSeverity, dirtSeverity, details, activeCategories]);

  // Similar-case average + AI prediction gap (computed, not hard-coded)
  const similarAvg = Math.round(
    SIMILAR_CASES.reduce((sum, c) => sum + c.totalCost, 0) / SIMILAR_CASES.length
  );
  const diffPct = ((totalCost - similarAvg) / similarAvg) * 100;

  // Sorting logics
  const getSortedCases = () => {
    let list = [...SIMILAR_CASES];
    if (sortBy === 'similarity') {
      return list.sort((a, b) => b.similarity - a.similarity);
    }
    if (sortBy === 'cost') {
      return list.sort((a, b) => b.totalCost - a.totalCost);
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.date.replace(/\./g, '-')).getTime() - new Date(a.date.replace(/\./g, '-')).getTime());
    }
    return list;
  };

  const sortedCases = getSortedCases();

  // Fake download pdf trigger
  const handleDownloadPdf = () => {
    setIsPdfGenerating(true);
    setTimeout(() => {
      setIsPdfGenerating(false);
      setShowPdfView(true);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col relative select-none bg-transparent">
      
      {/* 1. TWO-BUTTON SLIDING TAB SELECTOR CAPSULE - Screenshot 16 */}
      <div className="mx-5 my-4 p-1.5 rounded-full bg-[#1A1A1A] flex gap-1 z-10 shadow-inner">
        <button
          onClick={() => {
            setActiveTab('result');
            setShowPdfView(false);
          }}
          className={`flex-1 py-3 text-xs font-extrabold rounded-full transition-all text-center cursor-pointer
            ${activeTab === 'result'
              ? 'bg-white text-black shadow-md scale-[1.02]'
              : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          견적 결과
        </button>
        <button
          onClick={() => {
            setActiveTab('similar');
            setShowPdfView(false);
          }}
          className={`flex-1 py-3 text-xs font-extrabold rounded-full transition-all text-center cursor-pointer
            ${activeTab === 'similar'
              ? 'bg-white text-black shadow-md scale-[1.02]'
              : 'text-neutral-500 hover:text-neutral-300'}`}
        >
          유사 사례
        </button>
      </div>

      {showPdfView ? (
        /* Simulated full printed report PDF viewer */
        <div className="px-5 pb-32 overflow-y-auto flex-1 animate-fade-in font-sans">
          <div className="flex items-center justify-between mb-4 mt-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <Check size={14} className="text-green-500 stroke-[3.5]" /> PDF REPORT ACCREDITED
            </span>
            <button 
              onClick={() => setShowPdfView(false)}
              className="text-xs font-bold text-[#EAFF20] hover:underline"
            >
              닫기 ✕
            </button>
          </div>

          <div id="pdf-view" className="w-full bg-white text-neutral-900 rounded-[32px] p-6 border border-neutral-200 shadow-2xl flex flex-col gap-4 font-sans text-xs">
            {/* Header branding logo */}
            <div className="flex justify-between items-start border-b pb-4 border-neutral-100">
              <div>
                <h4 className="text-base font-black tracking-tight text-neutral-950">LOTTE G-CAR Predict.AI</h4>
                <p className="text-[9px] font-mono text-neutral-400 mt-0.5 uppercase tracking-wide">Accident Invoice Report</p>
              </div>
              <div className="text-right font-mono text-[8px] text-neutral-400 leading-relaxed">
                REF_NO: gc_{Date.now().toString().slice(-6)}<br />
                GEN_DATE: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s?/g, '.').replace(/\.$/, '')}
              </div>
            </div>

            {/* User details */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="font-extrabold text-[10px] text-neutral-400 block mb-2 uppercase tracking-wide">1. Driver specifications</span>
              <div className="grid grid-cols-2 gap-y-2 font-bold text-[11px] text-neutral-800">
                <div>• 고객명: 김*우 님 (우수회원)</div>
                <div>• 차종: 테슬라 모델 S (2022)</div>
                <div>• 이력 등급 : 우수 / 무사고</div>
                <div>• 가입 면책: 자차 {insuranceCost}만원</div>
              </div>
            </div>

            {/* Inputs summary */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="font-extrabold text-[10px] text-neutral-400 block mb-2 uppercase tracking-wide">2. Registered Incidents</span>
              <div className="flex flex-col gap-2 font-bold text-[11px] text-neutral-800">
                <div>• 저촉 대상: {details.involvedParties.join(', ').toUpperCase() || 'CAR.'}</div>
                <div>• 파손 부위: {damageParts.filter(p => p.selected).map(p => p.name).join(', ') || '전방 범퍼'}</div>
                <div>• 오염 좌석: {dirtySeats.filter(p => p.selected).map(s => s.name).join(', ') || '없음'}</div>
                <div className="italic text-[10px] text-neutral-500 font-medium border-t pt-1.5 mt-1 leading-relaxed">
                  "{details.accidentDetailsText || '오후 3시경, 주차장에서 미세 후진 접촉 사고 접수'}"
                </div>
              </div>
            </div>

            {/* Breakdown item table */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="font-extrabold text-[10px] text-neutral-400 block mb-3 uppercase tracking-wide">3. Dynamic calculated quotes</span>
              <div className="flex flex-col gap-2.5 font-bold text-[11px] text-neutral-800">
                <div className="flex justify-between items-center py-1 border-b border-neutral-200">
                  <span className="font-medium text-neutral-500">예상 부품 수리공임비</span>
                  <span>{repairCost}만원</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-200">
                  <span className="font-medium text-neutral-500">자차 보험 면책 자기부담금</span>
                  <span>{insuranceCost}만원</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-200">
                  <span className="font-medium text-neutral-500">대여중지 휴차료 ({daysCount}일분)</span>
                  <span>{idleCost}만원</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5 text-neutral-900">
                  <span className="font-extrabold">합계 예상 청구액</span>
                  <span className="font-black text-blue-600">{totalCost}만원</span>
                </div>
              </div>
            </div>

            <div className="text-[7.5px] leading-relaxed text-neutral-400 mt-2 text-center border-t border-neutral-100 pt-3">
              본 분석 문서는 롯데 G-CAR 전용 Predict.AI 자율 사정 모델에 의한 가상 시뮬레이션 예측치입니다. 실제 교체 자재 재고 상황 및 시중 공임 가동 한계율에 따라 일부 최종 수리 청구 금액과 다소 차이가 있을 수 있습니다.
            </div>
          </div>

          {/* Quick PDF action button prints */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => {
                const w = window.open('', '_blank');
                if (w) {
                  w.document.write(`
                    <html>
                      <head><title>Predict.AI PDF Print</title></head>
                      <body style="margin:40px; font-family:sans-serif; background:#FAFAFA; display:flex; justify-content:center;">
                        <div style="width:600px; background:white; padding:40px; border-radius:16px; border:1px solid #eee; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
                          ${document.getElementById('pdf-view')?.innerHTML || ''}
                        </div>
                        <script>setTimeout(() => { window.print(); }, 400);</script>
                      </body>
                    </html>
                  `);
                  w.document.close();
                }
              }}
              className="py-3.5 bg-neutral-900 text-[#EAFF20] hover:bg-black font-extrabold text-xs rounded-full shadow cursor-pointer text-center"
            >
              인쇄 및 다운로드
            </button>
            <button
              onClick={() => setShowPdfView(false)}
              className="py-3.5 bg-neutral-200 text-neutral-800 hover:bg-neutral-300 font-extrabold text-xs rounded-full cursor-pointer text-center"
            >
              결과 대시보드로 복귀
            </button>
          </div>
        </div>
      ) : activeTab === 'result' ? (
        /* ==================== TAB A: 견적 결과 (Screenshot 16) ==================== */
        <div className="px-5 pb-32 overflow-y-auto flex-1 animate-fade-in font-sans">
          
          {/* Card 1: Giant Neon Yellow Summary Card - Screenshot 16 */}
          <div className="p-6 rounded-[36px] bg-[#EAFF20] text-black shadow-md flex flex-col relative overflow-hidden mb-4">
            {/* Spark icon top left */}
            <div className="flex justify-between items-start mb-4">
              <Sparkles size={18} className="text-black stroke-[2.5]" />
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/10 select-none">
                Predict.AI Active
              </span>
            </div>

            {/* Total labels centered - Screenshot 16 */}
            <div className="flex flex-col items-center justify-center text-center py-2">
              <span className="text-xs font-semibold text-neutral-800 tracking-wide">총 예상 금액</span>
              <span className="text-4xl font-black tracking-tight mt-1 mb-4 leading-none select-text">
                {totalCost}만원
              </span>
            </div>

            {/* Interactive chart slider range bar under price */}
            <div className="border-t border-black/10 pt-4 mt-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-neutral-800 mb-2">
                <span>최소 {minCost}만원</span>
                <span>최대 {maxCost}만원</span>
              </div>
              
              {/* Range horizontal trail track */}
              <div className="h-2 w-full bg-black/10 rounded-full relative">
                {/* Active marker pill span in center */}
                <div className="absolute top-0 bottom-0 left-[24%] right-[24%] bg-black/15 rounded-full"></div>
                {/* Thumb pointer bubble */}
                <div className="absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-black border-2 border-[#EAFF20] shadow-md"></div>
              </div>
            </div>
          </div>

          {/* Card 2: 2 Days 소요 Black Card - Screenshot 16 */}
          <div className="p-5 rounded-[28px] bg-neutral-950 border border-neutral-850 text-white flex flex-col gap-2 mb-4 shadow-sm select-none">
            <span className="text-xs text-neutral-400 font-semibold">최종 견적 확정까지</span>
            <span className="text-2xl font-black text-[#EAFF20] tracking-tight leading-none">
              약 {daysCount}일 소요
            </span>
          </div>

          {/* Card 3: 상세 내역 Table List - Screenshot 16 */}
          <div className="p-6 rounded-[34px] bg-neutral-950 border border-neutral-850 text-white shadow-md flex flex-col mb-4">
            <h3 className="text-sm font-extrabold text-neutral-300 uppercase tracking-wider mb-4 border-b border-neutral-850 pb-3">
              상세 내역
            </h3>

            <div className="flex flex-col gap-4 text-xs font-bold font-sans">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 flex items-center gap-2.5 font-medium">
                  <span className="w-7 h-7 rounded-full bg-[#EAFF20] text-black flex items-center justify-center">
                    <Wrench size={13} className="stroke-[2.5]" />
                  </span>
                  예상 수리비
                </span>
                <span className="font-mono">{repairCost}만원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 flex items-center gap-2.5 font-medium">
                  <span className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center">
                    <Shield size={13} className="stroke-[2.5]" />
                  </span>
                  자차 면책금
                </span>
                <span className="font-mono">{insuranceCost}만원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 flex items-center gap-2.5 font-medium">
                  <span className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center">
                    <FileText size={13} className="stroke-[2.5]" />
                  </span>
                  휴차료
                </span>
                <span className="font-mono">{idleCost}만원</span>
              </div>

              {/* Thin line divider */}
              <div className="h-[1px] bg-neutral-850 w-full my-1"></div>

              {/* 합계 neon row */}
              <div className="flex justify-between items-center text-sm font-extrabold">
                <span>합계</span>
                <span className="text-[#EAFF20] font-sans font-black text-base">{totalCost}만원</span>
              </div>
            </div>
          </div>

          {/* Card 4: AI 분석 Details description - Screenshot 16 */}
          <div className="p-6 rounded-[34px] bg-neutral-950 border border-neutral-850 text-white shadow-md flex flex-col leading-relaxed mb-6">
            <h3 className="text-sm font-extrabold text-[#EAFF20] uppercase tracking-wider mb-2 font-sans">
              AI 분석
            </h3>
            <p className="text-xs text-neutral-300 font-semibold font-sans">
              차량의 손상 부위를 정밀 분석하여 예상 수리비를 산출했습니다. 총 {damageParts.filter(p => p.selected).length > 0 ? damageParts.filter(p => p.selected).length : 3}개 부위에서 손상이 감지되었습니다.
            </p>
          </div>

          {/* Fixed bottom controls - Screenshot 16 */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] p-5 border-t border-neutral-200 bg-white/95 backdrop-blur-md rounded-b-[40px] z-50 flex gap-2">
            {/* Home round button */}
            <button
              onClick={onGoHome}
              className="w-12 h-12 rounded-full bg-black text-white hover:bg-neutral-900 flex items-center justify-center transition-all shadow active:scale-95"
              title="홈으로 가기"
            >
              <Home size={18} />
            </button>

            {/* PDF wide capsule button */}
            <button
              onClick={handleDownloadPdf}
              className="flex-1 py-4 rounded-full bg-black hover:bg-neutral-900 text-white text-xs font-bold transition-all shadow text-center flex items-center justify-center gap-2 active:scale-98"
            >
              <Download size={14} className="text-[#EAFF20]" />
              PDF 리포트 저장해두기
            </button>
          </div>

        </div>
      ) : (
        /* ==================== TAB B: 유사 사례 (Screenshot 17) ==================== */
        <div className="px-5 pb-32 overflow-y-auto flex-1 animate-fade-in font-sans">
          
          {/* Comparison Card panel - Screenshot 17 */}
          <div className="p-5 rounded-[30px] bg-neutral-950 border border-neutral-850 text-white mb-4 shadow-sm">
            <span className="text-[10px] font-bold text-neutral-500 block mb-3 uppercase tracking-widest font-mono">
              AI 예측 vs 유사 사례
            </span>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-neutral-850">
              <div>
                <p className="text-[10px] text-neutral-400 font-bold">AI 예측</p>
                <span className="text-lg font-black text-[#EAFF20] font-sans mt-0.5 block">{totalCost}만원</span>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 font-bold">유사 사례 평균</p>
                <span className="text-lg font-black text-white font-sans mt-0.5 block">{similarAvg}만원</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block font-bold">예측 차이</span>
                <span className="text-xs text-neutral-200 mt-1 block font-bold">
                  AI 예측이 유사 사례 평균보다 <span className="text-[#EAFF20]">{Math.abs(diffPct).toFixed(1)}% {diffPct <= 0 ? '낮습니다' : '높습니다'}</span>
                </span>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10.5px] font-mono font-extrabold tracking-tight border
                ${diffPct <= 0
                  ? 'bg-[#1A331E] border-green-800 text-green-400'
                  : 'bg-[#331A1A] border-red-800 text-red-400'}`}>
                {diffPct <= 0 ? '' : '+'}{diffPct.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Sort Dropdown select pill indicator - Screenshot 17 */}
          <div className="flex items-center justify-between mb-3 relative">
            <span className="text-[10px] font-extrabold uppercase text-neutral-500 font-mono tracking-wider">
              사례 리스트 ({sortedCases.length}건)
            </span>

            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="py-1.5 px-4 rounded-full bg-[#EAFF20] text-black font-extrabold text-[10px] flex items-center gap-1 cursor-pointer shadow hover:scale-103 transition-transform"
            >
              <ArrowUpDown size={10} />
              {sortBy === 'similarity' && '유사도 높은 순'}
              {sortBy === 'cost' && '청구금액 순'}
              {sortBy === 'newest' && '최신 등록순'}
              <ChevronDown size={10} className="ml-0.5" />
            </button>

            {/* Dropdown flyout */}
            {showSortDropdown && (
              <div className="absolute right-0 top-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-1.5 shadow-2xl z-55 flex flex-col w-36 gap-0.5">
                {[
                  { id: 'similarity', label: '유사도 높은 순' },
                  { id: 'cost', label: '청구금액 순' },
                  { id: 'newest', label: '최신 등록순' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortBy(opt.id as any);
                      setShowSortDropdown(false);
                    }}
                    className={`text-left px-3 py-2 text-[10px] font-bold rounded-xl transition-colors
                      ${sortBy === opt.id ? 'bg-[#EAFF20] text-black font-extrabold' : 'text-neutral-300 hover:bg-neutral-850'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Beautiful scrollable Cases list - Screenshot 17 */}
          <div className="flex flex-col gap-3">
            {sortedCases.map((cs) => (
              <div 
                key={cs.id}
                onClick={() => setSelectedCase(cs)}
                className="p-5 rounded-[28px] bg-neutral-950 border border-neutral-850 hover:border-neutral-700 cursor-pointer shadow-sm flex items-center justify-between active:scale-99 transition-all text-white"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-neutral-100 font-sans">{cs.carModel}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-neutral-800 text-neutral-400 text-[8px] font-mono font-bold">
                      {cs.date}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-sans tracking-wide leading-relaxed">
                    {cs.year} • {cs.damageType}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Similarity</div>
                    <div className="text-xs font-black text-[#EAFF20] mt-0.5">{cs.similarity}%</div>
                  </div>
                  <div className="h-8 w-[1px] bg-neutral-850"></div>
                  <div className="text-right">
                    <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Invoice</div>
                    <div className="text-xs font-black text-white mt-0.5">{cs.totalCost}만원</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom actions on Case List */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] p-5 border-t border-neutral-200 bg-white/95 backdrop-blur-md rounded-b-[40px] z-50 flex gap-2">
            <button
              onClick={onGoHome}
              className="flex-1 py-4 rounded-full bg-black hover:bg-neutral-900 text-white text-xs font-bold transition-all shadow text-center"
            >
              시뮬레이터 처음부터 다시 시작
            </button>
          </div>

        </div>
      )}

      {/* SELECTED CASE PREVIEW FLYOUT DIALOG */}
      {selectedCase && (
        <div className="absolute inset-0 bg-black/85 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0" onClick={() => setSelectedCase(null)}></div>
          
          <div className="w-full max-h-[85%] rounded-t-[36px] bg-neutral-950 p-6 border-t border-neutral-800 text-white z-10 flex flex-col animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-850 mb-4">
              <h3 className="text-sm font-black text-neutral-100 uppercase tracking-widest font-sans">
                유사 사례 상세 정보
              </h3>
              <button 
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-full bg-neutral-900 text-neutral-400 flex items-center justify-center hover:bg-neutral-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto pb-8 pr-1 font-sans flex flex-col gap-4">
              {/* Cover picture */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-850">
                <img 
                  src={selectedCase.images[0] || "https://images.unsplash.com/photo-1617469767053-d3b508a0d822?auto=format&fit=crop&q=80&w=600"} 
                  alt="case demo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2.5 left-2.5 px-3 py-1 bg-black/60 text-[#EAFF20] text-[9px] font-mono font-bold rounded-full border border-[#EAFF20]/20">
                  유사도 {selectedCase.similarity}% 매칭
                </span>
              </div>

              {/* Case Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl">
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase tracking-wider font-mono">Vehicle Model</span>
                  <p className="font-extrabold text-neutral-200 mt-0.5">{selectedCase.carModel}</p>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase tracking-wider font-mono">Date / Location</span>
                  <p className="font-extrabold text-neutral-200 mt-0.5">{selectedCase.date} • {selectedCase.location}</p>
                </div>
                <div className="mt-1">
                  <span className="text-neutral-500 block text-[9px] uppercase tracking-wider font-mono">Accident Type</span>
                  <p className="font-extrabold text-[#EAFF20] mt-0.5">{selectedCase.damageType}</p>
                </div>
                <div className="mt-1">
                  <span className="text-neutral-500 block text-[9px] uppercase tracking-wider font-mono">Total Damage Cost</span>
                  <p className="font-extrabold text-neutral-200 mt-0.5">{selectedCase.totalCost}만원</p>
                </div>
              </div>

              {/* Case Descriptions */}
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold block mb-1">
                  사고 상황 및 조치 내역
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed leading-normal bg-neutral-900/20 border border-neutral-850 p-4 rounded-2xl font-sans">
                  {selectedCase.damageDetail}
                </p>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="w-full py-4 mt-2 bg-[#EAFF20] hover:bg-[#DFFF00] text-black font-extrabold text-xs rounded-full text-center tracking-wide"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}