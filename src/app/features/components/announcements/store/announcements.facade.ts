import {inject, Injectable} from '@angular/core';
import { AnnouncementStore } from './announcements.store';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { AnnouncementService } from '../services/announcements.service';
import {
  AnnouncementDto,
  AnnouncementEcoRequest,
  AnnouncementRequest,
  AnnouncementResponse, CategoryDto,
  CreateOrUpdateAnnouncementDto
} from "../models/announcement.model";

@Injectable({
  providedIn: 'root'
})
export class AnnouncementFacade {
  announcementStore = inject(AnnouncementStore);
  announcementService = inject(AnnouncementService);
  constructor() { }

  getAnnouncementsPaginated(announcementRequest: AnnouncementRequest) {
    // Remplace les valeurs vides par null
    const adjustedRequest = {
        ...announcementRequest,
        page: announcementRequest.page || 0,
        size: announcementRequest.size || 8,
        category: announcementRequest.category || null,
        localisation: announcementRequest.localisation || null,
        search: announcementRequest.search || null
    };

    this.announcementService.getAnnouncements(adjustedRequest).subscribe((announcements) => {
      console.log(announcements);
      this.announcementStore.setAnnouncementsPaginated(announcements);
    });
  }

  getAnnouncementsEcoPaginated(announcementRequest: AnnouncementEcoRequest) {
    const adjustedRequest = {
      ...announcementRequest,
      page: announcementRequest.page || 1,
      size: announcementRequest.size || 8,
      localisation: announcementRequest.localisation || null,
      search: announcementRequest.search || null
    };

    this.announcementService.getEcoAnnouncements(adjustedRequest).subscribe((announcements) => {
      console.log(announcements);
      this.announcementStore.setEcoAnnouncementsPaginated(announcements);
    });
  }

    toggleFavoriteAnnouncement(announcementId: number, isFavorite: boolean) : Observable<void> {
      return this.announcementService.toggleFavorite(announcementId , isFavorite).pipe(
        tap(() => {
          console.log('Favori modifié avec succès');
        }),
        catchError((error) => {
          console.error('Erreur lors de la modification du favori:', error);
          return EMPTY;
        })
      );
    }


    checkFavoriteStatus(announcementId: number): Observable<boolean> {
      return this.announcementService.checkFavoriteStatus(announcementId).pipe(
        tap((status) => {
          console.log('Statut du favori:', status);
        }),
          catchError((error) => {
          console.error('Erreur lors de la vérification du statut favori:', error);
          return EMPTY;
        })
      );
    }

    getCategories(): Observable<CategoryDto[]> {
      return this.announcementService.getCatogories().pipe(
        tap((categories) => {
          this.announcementStore.setCategories(categories);
        })
      );
    }

    createAnnouncement(announcement: CreateOrUpdateAnnouncementDto, files: (File | null)[]): Observable<AnnouncementDto> {
      const validFiles: File[] = files.filter((file): file is File => file !== null);

      return this.announcementService.createAnnouncement(announcement , validFiles).pipe(
        tap((announcement) => {
          console.log('Announcement created:', announcement);
        })
      )
  }
  updateAnnouncement( id :number, announcement: CreateOrUpdateAnnouncementDto, files: File [] , existingFiles: string[]): Observable<AnnouncementDto> {

    return this.announcementService.updateAnnouncement(id , announcement , files , existingFiles).pipe(
      tap((announcement) => {
        console.log('Announcement created:', announcement);
      })
    )
  }

  getFavorites(): Observable<AnnouncementDto[]> {
    return this.announcementService.getFavorites().pipe(
      tap((favorites) => {
        console.log('Favoris récupérés:', favorites);
      })
    );
  }
  getAnnouncementByUser(): Observable<AnnouncementResponse> {
    return this.announcementService.getAnnouncementByUser().pipe(
      tap((annonces) => {
        console.log('Annonces récupérés:', annonces.annonces);
      })
    );
  }

  deleteAnnouncement(announcementId: number) {
    console.log('Announcement delete:', announcementId);
    return this.announcementService.deleteAnnouncement(announcementId).pipe(
      tap(() => {
      }),
    catchError((error) => {
      console.error('Erreur lors de la suppression de annonce :', error);
      return EMPTY;
    })
    )

  }
}
