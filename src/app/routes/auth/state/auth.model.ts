export enum UserType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  COMPANY = 'COMPANY'
}

export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  image?: string;
  companyId?: number;
  isCompany: boolean;
  siret?: string;
  userType: UserType;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  profile: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  user: User;
}

export interface AuthState {
  token: string;
  profile: User;
}

export interface CompanyRequestDto {
  companyName: string;
  siret: string;
  kbis: File;
  address: string;
  city: string;
  postalCode: number;
  description: string;
  username: string;
  email: string;
  password: string;
}

export interface CompanyRequestResponse {
  id: number,
  companyName: string,
  siret: string,
  kbis: string,
  address: string,
  city: string,
  postalCode: number,
  description: string,
  username: string,
  email: string,
  status: Status,
}

export interface  CompanyDetailsDto{
  companyName: string,
  numeroVoie: string,
  typeVoie: string,
  libelleVoie: string,
  postalCode: string,
  city: string
}

export interface ResetPasswordDto{
  email: string;
}

export interface NewPasswordDto{
  newPassword: string;
  resetKey: number;
}