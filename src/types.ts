export enum UserRole {
  ADMIN = 'ADMIN',
  COUNSELOR = 'COUNSELOR',
  USER = 'USER',
  RESIGNED = 'RESIGNED',
  UNREGISTERED = 'UNREGISTERED',
  EXTERNAL_COUNSELOR = 'EXTERNAL_COUNSELOR'

}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  roles?: string[];
  label?: string;
  department?: string;
}

export interface HistoryItem {
  date: string;
  status: string;
  content: string;
  author: string;
  wcsmLink?: string;
  images: string[];
}

export interface CustomerHistoryItem {
  date: string;
  content: string;
  author: string;
  images: string[];
  isEdited?: boolean;
  editDate?: string;
}

export interface Inquiry {
  id: string;
  category: string;
  emrType: string;
  chart: string;
  hospital: string;
  time: string;
  initialStatus: string;
  followUpStatus: string;
  author: string;
  assignee: string;
  source: string;
  customerResponse: string;
  urgent: boolean;
  isReentry: boolean;
  waitingTime: string;
  processingResult: string;
  history: HistoryItem[];
  customerHistory: CustomerHistoryItem[];
}