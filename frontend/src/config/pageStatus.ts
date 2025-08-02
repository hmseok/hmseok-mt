// 페이지 상태 관리 설정
// working: true = 공사중 (상단으로 이동, 밝은 색)
// disabled: true = 비활성화 (어두운 색, 접근금지)
// order: 숫자 = 정렬 순서 (낮은 숫자가 상단)

export const pageStatus = {
  '/': { 
    working: false, 
    disabled: false, 
    order: 1,
    description: '대시보드'
  },
  '/customers': { 
    working: false, 
    disabled: false, 
    order: 2,
    description: '고객 관리'
  },
  '/vehicle-info': { 
    working: false, 
    disabled: false, 
    order: 3,
    description: '차량정보 - 장기렌터카 실행데이터'
  },
  '/accidents': { 
    working: false, 
    disabled: false, 
    order: 4,
    description: '사고 관리'
  },
  '/estimates': { 
    working: false, 
    disabled: false, 
    order: 5,
    description: '견적 관리'
  },
  '/repairs': { 
    working: false, 
    disabled: false, 
    order: 6,
    description: '정비 관리'
  },
  '/accounting': { 
    working: false, 
    disabled: false, 
    order: 7,
    description: '회계 관리'
  },
  '/user-management': { 
    working: false, 
    disabled: false, 
    order: 8,
    description: '사용자 관리'
  },
  '/my-schedule': { 
    working: false, 
    disabled: false, 
    order: 9,
    description: '나의 스케줄'
  },
};

// 페이지 상태 변경 함수 (향후 사용)
export const updatePageStatus = (path: string, status: {
  working?: boolean;
  disabled?: boolean;
  order?: number;
}) => {
  if (pageStatus[path as keyof typeof pageStatus]) {
    Object.assign(pageStatus[path as keyof typeof pageStatus], status);
  }
};

// 작업 중인 페이지 가져오기
export const getWorkingPages = () => {
  return Object.entries(pageStatus)
    .filter(([_, status]) => status.working)
    .map(([path, status]) => ({ path, ...status }));
};

// 비활성화된 페이지 가져오기
export const getDisabledPages = () => {
  return Object.entries(pageStatus)
    .filter(([_, status]) => status.disabled)
    .map(([path, status]) => ({ path, ...status }));
}; 