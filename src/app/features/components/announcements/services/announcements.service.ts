import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {catchError, EMPTY, Observable, of} from "rxjs";
import {
  AnnouncementDto,
  AnnouncementRequest,
  AnnouncementResponse,
  FavoriteRequest,
  CategoryDto,
  CreateOrUpdateAnnouncementDto,
  AnnouncementEcoRequest
} from "../models/announcement.model";
import { tap } from "rxjs/operators";
import {AuthStore} from "../../auth/store/auth.store";
import {environment} from "../../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  authStore= inject(AuthStore);
  isAuthenticated$ = this.authStore.getToken;


  getAnnouncements(request: AnnouncementRequest): Observable<AnnouncementResponse> {
    const params = new HttpParams()
      .set('localisation', request.localisation || '')
      .set('category', request.category || '')
      .set('search', request.search || '')
      .set('page', request.page || 1)
      .set('size', request.size || 10);

    return this.http.get<AnnouncementResponse>(
      `${this.apiUrl}/announcements`,
      {
        params,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    )
  }

  getEcoAnnouncements(request: AnnouncementEcoRequest): Observable<AnnouncementResponse> {
    const params = new HttpParams()
      .set('localisation', request.localisation || '')
      .set('search', request.search || '')
      .set('page', request.page || 1)
      .set('size', request.size || 10);

    return this.http.get<AnnouncementResponse>(
      `${this.apiUrl}/announcements/eco-construction`,
      {
        params,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    )
  }

  checkFavoriteStatus(announcementId: number): Observable<boolean> {
    if (this.isAuthenticated$()) {
      return this.http.get<boolean>(`${this.apiUrl}/announcements/check-favorite/${announcementId}`);
    } else {
      console.log("User is not authenticated. Returning false.");
      return of(false);
    }
  }


  toggleFavorite(announcementId: number, isFavorite: boolean): Observable<void> {
    console.log(isFavorite)
    const request: FavoriteRequest = { favorite: isFavorite };
    return this.http.put<void>(`${this.apiUrl}/announcements/favorite/${announcementId}`, request);
  }

  getCatogories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.apiUrl}/announcements/categories`);
  }

  createAnnouncement(announcement: CreateOrUpdateAnnouncementDto, files: File[]): Observable<AnnouncementDto> {
    const formData = new FormData();

    // Ajout des données de l'annonce
    formData.append('announcement', new Blob([JSON.stringify(announcement)], {
      type: 'application/json'
    }));

    // Ajout des fichiers
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.http.post<AnnouncementDto>(`${this.apiUrl}/announcements`, formData);
  }

  updateAnnouncement(id: number, announcement: CreateOrUpdateAnnouncementDto, files: File[] , existingFiles: string[]): Observable<AnnouncementDto> {
    const formData = new FormData();

    // Ajout des données de l'annonce
    formData.append('announcement', new Blob([JSON.stringify(announcement)], {
      type: 'application/json'
    }));

    // Ajout des fichiers
    files.forEach(file => {
      formData.append('files', file);
    });

    // Ajout des fichiers
    formData.append('existingFiles', new Blob([JSON.stringify(existingFiles)], { type: 'application/json' }));


    return this.http.put<AnnouncementDto>(`${this.apiUrl}/announcements/${id}`, formData);
  }

  getFavorites(): Observable<AnnouncementDto[]> {
    return this.http.get<AnnouncementDto[]>(`${this.apiUrl}/announcements/favorites`);
  }

  getAnnouncementByUser(): Observable<AnnouncementResponse> {
    return this.http.get<AnnouncementResponse>(`${this.apiUrl}/announcements/user`);
  }

  deleteAnnouncement(id: number):Observable<void>{
    console.log("Attempting to delete announcement with ID:", id);
    return this.http.delete<void>(`http://localhost:8080/api/v1/announcements/${id}`).pipe(
      tap(() => {
        console.log("Announcement deleted");
      }),
      catchError((error) => {
        console.error('Erreur lors de la suppression de l\'annonce:', error);
        return EMPTY;
      })
    );
  }


}


