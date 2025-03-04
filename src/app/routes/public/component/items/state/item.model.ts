export interface ItemDto {
  id: string;
  title: string;
  image: string[];
  location: string;
  date: Date;
  description: string;
  category: string;
  postalCode: number;
  state: string;
  color: string;
  material: string;
  status: string;
  isFavorite: boolean;
  author: {
    id: string ;
    name : string
  };
}
export interface AnnouncementFiltersDto{
  location: string;
  category: string;
}

export interface GetItemsPaginatedDto {
  meta: PaginationMetaDto;
  items: ItemDto[];
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
  userId: number;
  files?: string[];
  averageRating?: RatingResponse;
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
  size: number;
}


export interface AnnouncementRequest {
  localisation?: string | null;
  category?: string | null;
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

