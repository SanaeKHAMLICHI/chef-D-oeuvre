import { Component, Input , Output, EventEmitter, inject} from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AnnouncementDto } from "../../../routes/public/component/items/state/item.model";
import { CustomDatePipe } from "../../pipe/custom-date.pipe";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    MatIcon,
    NgOptimizedImage,
    RouterLink,
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
