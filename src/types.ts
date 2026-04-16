export const UserRole = {
  ADMIN: 'ADMIN',
  COUNSELOR: 'COUNSELOR',
  EXTERNAL_COUNSELOR: 'EXTERNAL_COUNSELOR',
  UNREGISTERED: 'UNREGISTERED',
  RESIGNED: 'RESIGNED',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department: string;
}

// history 객체 타입에서 wcsmLink를 선택적으로 변경
export interface HistoryItem {
  date: string;
  status: string;
  content: string;
  author: string;
  wcsmLink?: string;  // undefined 허용하도록 변경
  images: string[];
}

// 또는 Inquiry 타입의 history 필드를 다음과 같이 수정
export interface Inquiry {
  // ...existing fields...
  history: {
    date: string;
    status: string;
    content: string;
    author: string;
    wcsmLink?: string;  // 선택적으로 변경
    images: string[];
  }[];
}