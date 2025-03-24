import {UserAnnouncement} from "../../auth/models/auth.model";

export interface AnnouncementFiltersDto{
  location: string;
  category: string;
}

export interface AnnouncementDto {
  id: number;
  title: string;
  description: string;
  postalCode: string;
  statut: string;
  material: string;
  state: string;
  color: string;
  categoryId: number;
  user: UserAnnouncement;
  files?: string[];
  createdAt: string;
}

export interface AnnonceResponse {
  annonces: AnnouncementDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface RatingResponse {
  averageRating: number;
  userCount: number;
}
export interface AnnouncementResponse {
  annonces: AnnouncementDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}


export interface AnnouncementRequest {
  localisation?: string | null;
  category?: string | null;
  search?: string | null;
  page: number;
  size: number;
}
export interface AnnouncementEcoRequest {
  localisation?: string | null;
  search?: string | null;
  page: number;
  size: number;
}

export interface PaginationMetaDto {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface FavoriteRequest {
  favorite: boolean;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface CreateOrUpdateAnnouncementDto {
  title: string;
  description: string;
  postalCode: string;
  statut: string;
  material: string;
  state: string;
  color: string;
  categoryId: number;
}

