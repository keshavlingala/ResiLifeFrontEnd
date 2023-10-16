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
}

export interface Apartment {
  apartmentId: string;
  name: string;
  picture?: string;
  members: string[];
  payload: Payload;
  createDate: string;
}

export interface Payload {
  owner: string;
  notes: Note[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
}
