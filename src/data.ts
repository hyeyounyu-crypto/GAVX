import { SimilarCase } from './types';

export const SIMILAR_CASES: SimilarCase[] = [
  {
    id: 'case_01',
    carModel: '현대 아반떼 CN7',
    year: '2022년식',
    similarity: 94,
    similarityGrade: '매우 유사',
    repairCost: 310,
    insuranceCost: 100,
    idleCost: 60,
    totalCost: 470,
    date: '2024.10.15',
    location: '서울 강남구',
    damageType: '앞범퍼 / 스크래치',
    damageDetail: '후측면 범퍼 파손은 주차장 출차 과정에서 가장 흔한 사고 유형입니다. 앞범퍼 우측 안개등 부근의 깊은 긁힘 및 범퍼 들뜸 현상이 관찰되었습니다. 플라스틱 재질로 경미한 파손 상태여서 완전 교체하지 않고 부분 영접 도색 복원이 가능할 예정입니다.',
    images: [
      'https://images.unsplash.com/photo-1617469767053-d3b508a0d822?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'case_02',
    carModel: '기아 K5 DL3',
    year: '2023년식',
    similarity: 92,
    similarityGrade: '매우 유사',
    repairCost: 340,
    insuranceCost: 100,
    idleCost: 70,
    totalCost: 510,
    date: '2024.09.28',
    location: '경기 성남시',
    damageType: '후미등 / 스크래치',
    damageDetail: '후진하여 주차 중 차선 양보를 받으려다 자차 뒤 범퍼와 테일램프 라이팅 커버 부근이 단단한 기둥 혹은 가드레일에 직접 부딪혀 금이 간 케이스입니다. 램프 쉘 아우터가 파손되어 신품 어셈블리 부분 정비가 필요합니다.',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'case_03',
    carModel: '현대 소나타 DN8',
    year: '2021년식',
    similarity: 89,
    similarityGrade: '유사',
    repairCost: 290,
    insuranceCost: 100,
    idleCost: 55,
    totalCost: 445,
    date: '2024.10.03',
    location: '인천 연수구',
    damageType: '앞범퍼 / 파손',
    damageDetail: '교차로 좌회전 운전 중 연석 침범으로 조수석 사이드 휀더 하단 및 프론트 범퍼 립 부위에 우그러짐과 깊은 찰과상이 일어난 상황입니다. 프레임 변형은 발견되지 않았으며 하부 스커트 교환이 필요합니다.',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'case_04',
    carModel: '기아 셀토스',
    year: '2022년식',
    similarity: 82,
    similarityGrade: '유사',
    repairCost: 330,
    insuranceCost: 100,
    idleCost: 68,
    totalCost: 498,
    date: '2024.08.15',
    location: '부산 해운대구',
    damageType: '도어 / 찌그러짐',
    damageDetail: '복잡한 이면도로 골목길 주행 도중 마주 오던 트럭을 피하기 위해 우측 밀착 회피 중 돌출형 화단 석재 마감 볼라드에 조수석 하단 도어가 심하게 긁히고 패여 일어난 함몰 수리 케이스입니다.',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'case_05',
    carModel: '쌍용 토레스',
    year: '2023년식',
    similarity: 73,
    similarityGrade: '보통',
    repairCost: 360,
    insuranceCost: 100,
    idleCost: 72,
    totalCost: 532,
    date: '2024.07.22',
    location: '대전 유성구',
    damageType: '펜더 / 경미한 손상',
    damageDetail: '국도 공사 구역 혹은 비포장도로 주행 중 전방 덤프트럭에서 낙하 혹은 튄 자갈 파편으로 조수석 프론트 펜더 가니쉬 부착 부분에 자잘한 도색 벗겨짐과 경미한 스크래치 흠집들이 다량 발생했습니다.',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

export const MOCK_CRASH_SCENES = [
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1617469767053-d3b508a0d822?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600'
];