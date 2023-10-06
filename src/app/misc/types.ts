export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  meta: any;
  apartmentId?: string;
}

export interface Apartment {
  apartmentId: string;
  name: string;
  picture?: string;
  members: string[];
  payload:any;
  createDate: Date;
}
