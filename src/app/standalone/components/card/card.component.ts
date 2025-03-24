import { Component, Input , Output, EventEmitter, inject} from '@angular/core';
import { CustomDatePipe } from "../../pipe/custom-date.pipe";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";
import {AnnouncementDto} from "../../../features/components/announcements/models/announcement.model";
@Component({
    selector: 'app-card',
    standalone: true,
    imports: [
        CustomDatePipe,
        NgIf,
    ],
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent {
  router = inject(Router);
  @Input() announcement!: AnnouncementDto;
  @Output() clickEvent = new EventEmitter<number>();

  onCardClick() {
      this.clickEvent.emit(this.announcement.id)
    }
}
