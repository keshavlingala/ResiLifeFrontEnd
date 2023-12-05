export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  meta?: Meta;
  apartmentId?: string;
}

export interface Meta {
  splitwiseApiKey?: string;
  canvasApiKey?: string;
  picture?: string;
}

export interface Apartment {
  apartmentId: string;
  name: string;
  picture?: string;
  members: string[];
  payload: Payload;
  createDate: string;
}

export interface MemberDetails {
  email: string;
  name: string;
  picture?: string;
  balance?: number;
}

export interface Payload {
  owner: string;
  notes: Note[];
  memberDetails?: MemberDetails[];
  // expenses?: Expense[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
}

export interface SplitwiseExpenseItem {
  id: number;
  payment: boolean;
  cost: string;
  users: SplitwiseExpenseUser[];
  category: Category;
  description: string;
  group_id: number;
  friendship_id: number;
  date: Date;
}

export interface Category {
  id: number;
  name: string;
}

export interface SplitwiseExpenseUser {
  user: SplitwiseUser;
  paid_share: string;
  owed_share: string;
  net_balance: string;
}

export interface SplitwiseUser {
  id: number;
  first_name: string;
  last_name: string;
  picture: {
    small: string;
    medium: string;
    large: string;
  }
}

export interface CanvasCalendarEvent {
  id: string;
  title: string;
  description: string;
  all_day: boolean;
  all_day_date: string;
  type: string;
  assignment: {
    due_at: string;
  }
}
