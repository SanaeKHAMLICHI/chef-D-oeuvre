import {Component, Input} from '@angular/core';
import {AnnouncementDto} from "../../../routes/public/component/items/state/item.model";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-criteria',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './criteria.component.html',
  styleUrl: './criteria.component.css'
})
export class CriteriaComponent {
  @Input() announcement!: AnnouncementDto
}
