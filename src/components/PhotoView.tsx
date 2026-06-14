import React, { useState, useRef } from 'react';
import { Camera, Trash2, X, Plus, Image as ImageIcon, ChevronLeft, ChevronRight, Upload, Check } from 'lucide-react';
import { UploadedPhoto } from '../types';
import { MOCK_CRASH_SCENES } from '../data';

interface PhotoViewProps {
  photos: UploadedPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<UploadedPhoto[]>>;
  lightMode: boolean;
  onNext: () => void;
  onCancel: () => void;
}

export default function PhotoView({ photos, setPhotos, lightMode, onNext, onCancel }: PhotoViewProps) {
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedPreviewIdx, setSelectedPreviewIdx] = useState<number | null>(null);
  const [cameraFlash, setCameraFlash] = useState(false);
  
  // Carousel active image state
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  // Native input for real PC files
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSystemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newUrls: UploadedPhoto[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const url = URL.createObjectURL(file);
        newUrls.push({
          id: `custom_${Date.now()}_${i}`,
          url,
          isCustom: true
        });
      }
      const updated = [...photos, ...newUrls].slice(0, 8);
      setPhotos(updated);
      setActiveSlideIdx(updated.length - 1);
      setShowGalleryModal(false);
    }
  };

  const toggleMockPhotoSelection = (url: string) => {
    const idx = photos.findIndex(p => p.url === url);
    if (idx > -1) {
      const filtered = photos.filter(p => p.url !== url);
      setPhotos(filtered);
      setActiveSlideIdx(Math.max(0, filtered.length - 1));
    } else {
      if (photos.length >= 8) return;
      const updated = [...photos, { id: `mock_${url.slice(-15)}`, url }];
      setPhotos(updated);
      setActiveSlideIdx(updated.length - 1);
    }
  };

  const handleTriggerShutter = () => {
    if (photos.length >= 8) return;
    setCameraFlash(true);
    setTimeout(() => setCameraFlash(false), 200);
    
    // Pick an unsplash scene based on photos length
    const crashImg = MOCK_CRASH_SCENES[photos.length % MOCK_CRASH_SCENES.length];
    const updated = [...photos, { id: `camera_${Date.now()}`, url: crashImg }];
    setPhotos(updated);
    setActiveSlideIdx(updated.length - 1);
  };

  const handleDeletePhoto = (id: string) => {
    const filtered = photos.filter(p => p.id !== id);
    setPhotos(filtered);
    setActiveSlideIdx(Math.max(0, filtered.length - 1));
    if (selectedPreviewIdx !== null) {
      setSelectedPreviewIdx(null);
    }
  };

  const triggerClickInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex-1 flex flex-col relative bg-transparent overflow-y-auto pb-4">
      
      {/* 1. Header Progress bar capsule matching Screenshot 1 */}
      <div className="mx-5 my-3 px-5 py-3 rounded-[24px] bg-black text-white flex flex-col gap-1.5 shadow-md justify-center">
        {/* Progress track */}
        <div className="relative h-1.5 w-full bg-neutral-800 rounded-full mt-1">
          {/* Lime progress indicator line */}
          <div className="absolute top-0 left-0 h-full w-[12%] bg-[#EAFF20] rounded-full"></div>
          {/* Progress dots */}
          <div className="absolute top-1/2 left-[12%] -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#EAFF20] ring-4 ring-black"></div>
          <div className="absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-neutral-600 ring-4 ring-black"></div>
          <div className="absolute top-1/2 left-[88%] -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-neutral-600 ring-4 ring-black"></div>
        </div>
        <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold font-sans">
          <span className="text-[#EAFF20]">사진</span>
          <span className="text-neutral-500 translate-x-1">유형</span>
          <span className="text-neutral-500">상세</span>
        </div>
      </div>

      <div className="px-5 flex flex-col flex-1">
        {/* 2. Photo Selection Pill Indicator block */}
        <div className="flex justify-start mb-3">
          <div className="px-3 py-1 rounded-full border border-neutral-300 bg-white/90 text-neutral-800 text-xs font-semibold font-mono shadow-sm">
            {photos.length}/8
          </div>
        </div>

        {/* Caption guidelines */}
        <p className="text-sm font-medium text-neutral-400 mb-4 leading-relaxed font-sans">
          여러 각도에서 촬영한 사진이 정확한 예측에 도움이됩니다!
        </p>

        {/* 3. Main photo preview or empty container */}
        <div className="flex-1 flex flex-col min-h-[280px]">
          {photos.length === 0 ? (
            /* Empty Card - Screenshot 1 */
            <div 
              onClick={() => setShowGalleryModal(true)}
              className="w-full flex-1 rounded-[32px] border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center cursor-pointer transition-colors shadow-inner"
            >
              <div className="flex flex-col items-center gap-3">
                <Plus size={44} className="text-neutral-300 stroke-[1.2]" />
              </div>
            </div>
          ) : (
            /* Photo swiper - Page 3 style */
            <div className="w-full flex-1 rounded-[32px] bg-neutral-100 overflow-hidden relative flex flex-col justify-between group shadow-md border border-neutral-200">
              {/* Image slide view */}
              <div 
                onClick={() => setSelectedPreviewIdx(activeSlideIdx)}
                className="w-full h-full absolute inset-0 cursor-pointer"
              >
                <img 
                  src={photos[activeSlideIdx].url} 
                  alt="selected preview" 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-101"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Navigation arrows overlay inside swiper */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIdx(prev => (prev > 0 ? prev - 1 : photos.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 z-10"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIdx(prev => (prev < photos.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 z-10"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Slider Dots Indicator - Screenshot 3 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIdx(i);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeSlideIdx ? 'bg-neutral-800 scale-125' : 'bg-neutral-300'}`}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Bottom Button Trigger */}
        <div className="mt-5 pb-2">
          {photos.length === 0 ? (
            /* Gray deactivated button - Screenshot 1 */
            <button
              onClick={() => setShowGalleryModal(true)}
              className="w-full py-4 rounded-full bg-slate-200/90 text-[#A0A0A0] text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors shadow-sm"
            >
              <Upload size={16} className="text-[#A0A0A0]" />
              사진 업로드
            </button>
          ) : (
            /* Vibrant neon button - Screenshot 3 */
            <button
              onClick={onNext}
              className="w-full py-4 rounded-full bg-[#EAFF20] text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#DFFF00] transition-colors shadow-md"
            >
              <Upload size={16} className="text-black" />
              사진 업로드
            </button>
          )}
        </div>
      </div>

      {/* GALLERY / IMAGES SLIDE-UP SHEET MODAL - Screenshot 2 */}
      {showGalleryModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end transition-opacity duration-300">
          {/* Modal Overlay Background Dismiss click */}
          <div className="absolute inset-0 z-10" onClick={() => setShowGalleryModal(false)}></div>
          
          <div className={`w-full max-h-[85%] rounded-t-[36px] bg-white border-t border-neutral-100 p-6 flex flex-col z-20 shadow-2xl animate-slide-up`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-50 mb-4">
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              >
                <ChevronLeft size={18} className="text-neutral-700" />
              </button>
              <span className="text-sm font-bold text-neutral-800">사진 추가</span>
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="px-4 py-1.5 rounded-full bg-[#EAFF20] text-black text-xs font-bold shadow-sm hover:scale-102 transition-transform"
              >
                완 료
              </button>
            </div>

            {/* Quick real PC storage option inside sheet */}
            <div className="mb-4">
              <button
                onClick={triggerClickInput}
                className="w-full py-3 px-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 flex items-center justify-center gap-2 transition-colors text-xs font-bold text-neutral-700"
              >
                <ImageIcon size={16} className="text-blue-500" />
                현장 실제 사진 선택하기 (내 PC 파일 업로드)
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSystemUpload} 
                multiple 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Selection Grid Header */}
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 font-mono block">
              가상 현장 사진 라이브러리
            </span>

            {/* Selection grid */}
            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[300px] pb-6 pr-1 feedback-scroll">
              {/* Column 1: Camera click trigger */}
              <button
                onClick={() => {
                  setShowCamera(true);
                  setShowGalleryModal(false);
                }}
                className="aspect-square rounded-2xl bg-neutral-100 hover:bg-neutral-100 border border-neutral-200 flex flex-col items-center justify-center gap-1.5 transition-colors text-neutral-500"
              >
                <Camera size={26} className="text-neutral-500 stroke-[1.5]" />
                <span className="text-[10px] font-bold">카메라 촬영</span>
              </button>

              {/* Rest of items: Mock local scenes */}
              {MOCK_CRASH_SCENES.map((imgUrl, i) => {
                const selIdx = photos.findIndex(p => p.url === imgUrl);
                const isSelected = selIdx > -1;
                return (
                  <div 
                    key={i}
                    onClick={() => toggleMockPhotoSelection(imgUrl)}
                    className="aspect-square rounded-2xl bg-neutral-50 overflow-hidden relative border border-transparent cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  >
                    <img 
                      src={imgUrl} 
                      alt="Crash source" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Corner badge checklist - Screenshot 2 */}
                    <div className="absolute top-2 right-2 z-10">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#EAFF20] text-black font-extrabold text-[10px] flex items-center justify-center shadow">
                          {selIdx + 1}
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-black/20 border border-white/50 backdrop-blur-sm"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CAMERA SCREEN VIEWFINDER OVERLAY - Screenshot 5-7 */}
      {showCamera && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col justify-between overflow-hidden text-white font-sans select-none animate-fade-in">
          {/* Live camera background */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1617469767053-d3b508a0d822?auto=format&fit=crop&q=80&w=600"
              alt="camera background view"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Flash screen layer */}
          <div className={`absolute inset-0 bg-white z-[60] pointer-events-none transition-opacity duration-150 ${cameraFlash ? 'opacity-100' : 'opacity-0'}`}></div>

          {/* Top banner pill - Screenshot 5-7 */}
          <div className="pt-12 px-6 z-10 flex justify-center">
            <div className="px-5 py-3 rounded-full bg-black/55 backdrop-blur-md text-center">
              <span className="text-[12px] font-bold text-white block tracking-tight">
                파손 부위는 가까이에서 선명하게 촬영해주세요!
              </span>
            </div>
          </div>

          {/* Center corner brackets - white, turn neon once a shot is taken (Screenshot 7) */}
          <div className="flex-1 relative flex items-center justify-center px-10 z-10">
            <div className="relative w-full max-w-[280px] aspect-[1.5]">
              {(() => {
                const c = photos.length > 0 ? 'border-[#EAFF20]' : 'border-white';
                return (
                  <>
                    <div className={`absolute top-0 left-0 w-10 h-10 border-t-[5px] border-l-[5px] rounded-tl-[20px] ${c}`}></div>
                    <div className={`absolute top-0 right-0 w-10 h-10 border-t-[5px] border-r-[5px] rounded-tr-[20px] ${c}`}></div>
                    <div className={`absolute bottom-0 left-0 w-10 h-10 border-b-[5px] border-l-[5px] rounded-bl-[20px] ${c}`}></div>
                    <div className={`absolute bottom-0 right-0 w-10 h-10 border-b-[5px] border-r-[5px] rounded-br-[20px] ${c}`}></div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Bottom area */}
          <div className="relative z-10 px-6 pb-8 flex flex-col gap-5">

            {/* "여러 장 찍고 한번에 업로드" card - Screenshot 5-6 */}
            <div className="w-full rounded-[24px] bg-white/85 backdrop-blur-md p-3 flex items-center gap-3 shadow-lg">
              {/* Thumbnail with count badge */}
              <div className="relative w-16 h-16 rounded-2xl bg-neutral-300 overflow-hidden flex items-center justify-center flex-shrink-0">
                {photos.length > 0 ? (
                  <img src={photos[photos.length - 1].url} alt="last shot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <ImageIcon size={28} className="text-neutral-400" />
                )}
                {photos.length > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#EAFF20] text-black text-[10px] font-extrabold flex items-center justify-center shadow">
                    {photos.length}
                  </span>
                )}
              </div>

              <div className="flex-1 leading-tight">
                <p className="text-sm font-extrabold text-neutral-900">여러 장 찍고</p>
                <p className="text-sm font-extrabold text-neutral-900">한번에 업로드</p>
              </div>

              {/* Confirm check square - grey when empty, black when ready */}
              <button
                onClick={() => {
                  if (photos.length === 0) return;
                  setShowCamera(false);
                  setShowGalleryModal(false);
                }}
                disabled={photos.length === 0}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95
                  ${photos.length > 0 ? 'bg-black text-white' : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'}`}
              >
                <Check size={24} className="stroke-[3]" />
              </button>
            </div>

            {/* Camera controls row - Screenshot 7 */}
            <div className="flex items-center justify-between px-2">
              {/* Back to library */}
              <button
                onClick={() => {
                  setShowCamera(false);
                  setShowGalleryModal(true);
                }}
                className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center active:scale-95 transition-transform shadow"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Shutter */}
              <button
                onClick={handleTriggerShutter}
                className="w-20 h-20 rounded-full border-4 border-white/70 flex items-center justify-center active:scale-[0.9] transition-all bg-white/10"
              >
                <div className="w-16 h-16 rounded-full bg-white"></div>
              </button>

              {/* Next arrow - appears neon once a photo exists (Screenshot 7) */}
              {photos.length > 0 ? (
                <button
                  onClick={() => {
                    setShowCamera(false);
                    setShowGalleryModal(false);
                  }}
                  className="w-14 h-14 rounded-full bg-[#EAFF20] text-black flex items-center justify-center active:scale-95 transition-transform shadow"
                >
                  <ChevronRight size={26} className="stroke-[2.5]" />
                </button>
              ) : (
                <div className="w-14 h-14"></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN PHOTO DETAIL / TRASH OUTLINES MODAL - Screenshot 4 */}
      {selectedPreviewIdx !== null && (
        <div className="absolute inset-0 bg-black z-[100] flex flex-col justify-between p-6 select-none animate-fade-in text-white">
          {/* Header */}
          <div className="flex items-center justify-between pt-6">
            <button 
              onClick={() => setSelectedPreviewIdx(null)}
              className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-transform"
            >
              <ChevronLeft size={22} />
            </button>
            <span className="text-xs font-semibold tracking-wider font-mono text-neutral-400">
              미리보기 ({selectedPreviewIdx + 1}/{photos.length})
            </span>
            <button 
              onClick={() => handleDeletePhoto(photos[selectedPreviewIdx].id)}
              className="w-10 h-10 rounded-full bg-white/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 active:scale-95 transition-transform"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Main preview */}
          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden rounded-3xl relative">
            <img 
              src={photos[selectedPreviewIdx].url} 
              alt="big preview" 
              className="max-h-[75%] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails strip at bottom - Screenshot 4 */}
          <div className="flex items-center gap-2 justify-center overflow-x-auto pb-4 pt-2 feedback-scroll">
            {photos.map((pt, i) => (
              <div 
                key={pt.id} 
                onClick={() => setSelectedPreviewIdx(i)}
                className={`relative w-12 h-12 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 transition-all ${i === selectedPreviewIdx ? 'scale-110 border-2 border-[#EAFF20]' : 'opacity-45 hover:opacity-75'}`}
              >
                <img 
                  src={pt.url} 
                  className="w-full h-full object-cover" 
                  alt="strip selection" 
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setSelectedPreviewIdx(null)}
            className="w-full py-4 rounded-full bg-white/10 hover:bg-white/20 font-bold text-sm text-center transition-colors mb-2"
          >
            뒤로 가기
          </button>
        </div>
      )}

    </div>
  );
}