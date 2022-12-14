export interface User {
  id: Number;
  name: String;
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  enabled: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reserva {
  id: Number;
  guestName: String;
  guestID: String;
  price: number;
  units: Number;
  numGuest: Number;
  status: Status;
  dateIn: Date;
  dateOut: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  HOST = 'HOST',
  GUEST = 'GUEST',
}

export enum Status {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  CONFIRMED = 'CONFIRMED',
}

export interface header {
  access_token: string;
}

export interface DateRange {
  dateIn: Date;
  dateOut: Date;
}
