import {inject, Injectable} from '@angular/core';
import { ItemService } from './items.service';
import { AnnouncementStore } from './items.store';
import { AnnouncementRequest } from './item.model';
@Injectable({
  providedIn: 'root'
})
export class AnnouncementFacade {
  announcementStore = inject(AnnouncementStore);
  announcementService = inject(ItemService);
  constructor() { }

  getAnnouncementsPaginated(announcementRequest: AnnouncementRequest) {
    console.log('announcementRequest', announcementRequest.size);
    // Remplace les valeurs vides par null
    const adjustedRequest = {
        ...announcementRequest,
        page: announcementRequest.page || 0,
        size: announcementRequest.size || 10,
        category: announcementRequest.category || null,
        localisation: announcementRequest.localisation || null,
        search: announcementRequest.search || null
    };

    console.log('announcementRequest', adjustedRequest);
    this.announcementService.getAnnouncements(adjustedRequest).subscribe((announcements) => {
      console.log('announcements', announcements);
      this.announcementStore.setAnnouncementsPaginated(announcements);
    });
}

}
