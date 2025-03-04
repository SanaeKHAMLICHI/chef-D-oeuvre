import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CriteriaComponent } from "../../../../standalone/components/criteria/criteria.component";
import {ItemDto} from "../items/state/item.model";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ButtonComponent} from "../../../../standalone/components/button/button.component";
import {ContactComponent} from "../../../../standalone/components/contact/contact.component";
import { AnnouncementStore } from '../items/state/items.store';
import { AnnouncementDto } from '../items/state/item.model';

@Component({
  selector: 'app-details-item',
  standalone: true,
  imports: [
    CriteriaComponent,
    NgOptimizedImage,
    ButtonComponent,
    ContactComponent,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './details-item.component.html',
  styleUrls: ['./details-item.component.css']
})
export class DetailsItemComponent implements OnInit {
  itemsStore = inject(AnnouncementStore);
  route = inject(ActivatedRoute);

  announcementId: number | null = null;
  announcement: AnnouncementDto | undefined;
  // @ts-ignore
  isCarousel(): boolean {
    if (this.announcement?.files){
      return this.announcement.files.length > 2;
    }
  }
  ngOnInit() {
    this.announcementId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("itemId",this.route.snapshot.paramMap.get('id') )
    if (this.announcementId) {
      this.announcement = this.itemsStore.getAnnouncement().find((announcement) =>
        announcement.id === this.announcementId
        
      );
    }
  }
}
