import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AnnouncementStore} from "../../store/announcements.store";
import {AnnouncementFacade} from "../../store/announcements.facade";
import {AnnouncementDto} from "../../models/announcement.model";
import {ContactComponent} from "../../../../../standalone/components/contact/contact.component";
import {CustomDatePipe} from "../../../../../standalone/pipe/custom-date.pipe";
import {CriteriaComponent} from "../../../../../standalone/components/criteria/criteria.component";

@Component({
  selector: 'app-details-item',
  standalone: true,
  imports: [
    CriteriaComponent,
    NgOptimizedImage,
    ContactComponent,
    CustomDatePipe,
    NgForOf,
    FormsModule,
  ],
    templateUrl: './details-announcement.component.html',
    styleUrls: ['./details-announcement.component.css']
})
export class DetailsAnnouncementComponent implements OnInit {
  itemsStore = inject(AnnouncementStore);
  route = inject(ActivatedRoute);
  announcementFacade = inject(AnnouncementFacade);
  router= inject(Router) ;

  announcementId =Number(this.route.snapshot.paramMap.get('id'))
  announcement: AnnouncementDto | undefined;
  isFavorite = false;
  isEcoPage = false;


  constructor(){
    this.checkFavoriteStatus()
  }

  ngOnInit() {
    const currentUrl = window.location.pathname;
    this.isEcoPage = currentUrl.startsWith('/eco-announcement');
    console.log("ecopage ", this.isEcoPage)

    this.announcementId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.announcementId) {
      this.announcement = this.isEcoPage?
        this.itemsStore.getEcoAnnouncement().find((announcement) =>
          announcement.id === this.announcementId)
        : this.itemsStore.getAnnouncement().find((announcement) =>
        announcement.id === this.announcementId);
    }

  }
  checkFavoriteStatus() {
    this.announcementFacade.checkFavoriteStatus(this.announcementId).subscribe({
      next: (status) => {
        this.isFavorite = status;
        console.log("status", this.isFavorite);
      },
      error: () => {
        console.error('Erreur lors de la vérification du statut favori:');
      }
    });
  }

  toggleFavorite() {
      this.announcementFacade.toggleFavoriteAnnouncement(this.announcementId , !this.isFavorite).subscribe({
        next: () => {
          console.log("toggleFavorite", this.isFavorite)
          this.isFavorite = !this.isFavorite;
        },
        error: () => {
          console.error('Erreur lors de la suppression du favori:');
        }
      });
  }
}
