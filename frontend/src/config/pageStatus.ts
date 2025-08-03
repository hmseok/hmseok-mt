export interface PageStatus {
  working: boolean;    // 공사중
  disabled: boolean;   // 접근금지
  order: number;       // 메뉴 순서
}

export const pageStatus: Record<string, PageStatus> = {
  '/': {
    working: false,
    disabled: false,
    order: 1
  },
  '/customers': {
    working: false,
    disabled: false,
    order: 2
  },
  '/cars': {
    working: false,
    disabled: false,
    order: 3
  },
  '/accidents': {
    working: false,
    disabled: false,
    order: 4
  },
  '/estimates': {
    working: false,
    disabled: false,
    order: 5
  },
  '/repairs': {
    working: false,
    disabled: false,
    order: 6
  },
  '/accountings': {
    working: false,
    disabled: false,
    order: 7
  },
  '/users': {
    working: false,
    disabled: false,
    order: 8
  },
  '/schedule': {
    working: false,
    disabled: false,
    order: 9
  },
  // 빈 페이지들 (접근금지)
  '/vehicle-info': {
    working: false,
    disabled: true,
    order: 10
  },
  '/contracts': {
    working: false,
    disabled: true,
    order: 11
  },
  '/deposits': {
    working: false,
    disabled: true,
    order: 12
  },
  '/payments': {
    working: false,
    disabled: true,
    order: 13
  },
  '/withdrawals': {
    working: false,
    disabled: true,
    order: 14
  },
  '/parts': {
    working: false,
    disabled: true,
    order: 15
  },
  '/partners': {
    working: false,
    disabled: true,
    order: 16
  },
  '/staff': {
    working: false,
    disabled: true,
    order: 17
  },
  '/rental-cars': {
    working: false,
    disabled: true,
    order: 18
  },
  '/todos': {
    working: false,
    disabled: true,
    order: 19
  },
  // 공사중인 페이지들
  '/reports': {
    working: true,
    disabled: false,
    order: 20
  },
  '/analytics': {
    working: true,
    disabled: false,
    order: 21
  },
  '/settings': {
    working: true,
    disabled: false,
    order: 22
  }
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