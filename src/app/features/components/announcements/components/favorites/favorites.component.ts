import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import {Router} from "@angular/router";
import {AnnouncementDto} from "../../models/announcement.model";
import {AnnouncementFacade} from "../../store/announcements.facade";
import {CustomDatePipe} from "../../../../../standalone/pipe/custom-date.pipe";
@Component({
  selector: 'app-favorites',
  standalone: true,
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  imports: [CustomDatePipe]
})
export class FavoritesComponent implements OnInit {
  announcementFacade = inject(AnnouncementFacade);
  router= inject(Router);
  favorites: AnnouncementDto[] = [];

  ngOnInit() {
    this.announcementFacade.getFavorites().subscribe((favorites: AnnouncementDto[]) => {
       this.favorites = favorites;
    });
  }

  goToAnnouncement(id: number) {
    this.router.navigate([`/announcement/${id}`]);
  }

  toggleFavorite(announcementId: number) {
    this.announcementFacade.toggleFavoriteAnnouncement(announcementId , false).subscribe({
      next: () => {
        this.announcementFacade.getFavorites().subscribe((favorites: AnnouncementDto[]) => {
            this.favorites = favorites;
         });
      },
      error: () => {
      }
    });
}
}
