export type ScreenType = 'landing' | 'photo' | 'camera' | 'scanning' | 'category' | 'details' | 'analysing' | 'success' | 'report';

export type AccidentType = 'undrivable' | 'damaged' | 'condition' | 'ect';

export interface UploadedPhoto {
  id: string;
  url: string;
  isCustom?: boolean;
}

export interface InsuranceOption {
  value: number; // e.g. 50000, 300000, 700000
  label: string; // e.g. '5만원', '30만원', '70만원'
}

export interface DamagePart {
  id: string;
  name: string;
  selected: boolean;
  x: number; // percentage coordinate on car image
  y: number; // percentage coordinate on car image
}

export interface SeatStatus {
  id: string;
  name: string;
  selected: boolean;
}

export interface IncidentDetails {
  involvedParties: string[]; // 'person', 'car', 'facility', 'ect'
  accidentDetailsText: string;
  selectedInsurance: number; // index of insurance
}

export interface SimilarCase {
  id: string;
  carModel: string;
  year: string;
  similarity: number;
  similarityGrade: '매우 유사' | '유사' | '보통';
  repairCost: number; // in 만원
  insuranceCost: number; // in 만원
  idleCost: number; // in 만원
  totalCost: number; // in 만원
  date: string;
  location: string;
  damageType: string;
  damageDetail: string;
  images: string[];
}