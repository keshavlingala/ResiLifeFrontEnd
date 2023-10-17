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
