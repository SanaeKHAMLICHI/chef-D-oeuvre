import {Component, Input, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {AnnouncementDto} from "../../../features/components/announcements/models/announcement.model";

@Component({
    selector: 'app-criteria',
    standalone: true,
    imports: [
        NgOptimizedImage
    ],
    templateUrl: './criteria.component.html',
    styleUrl: './criteria.component.css'
})
export class CriteriaComponent implements OnInit {
  @Input() announcement!: AnnouncementDto
  isEcoPage = false;

  ngOnInit() {
    const currentUrl = window.location.pathname;
    this.isEcoPage = currentUrl.startsWith('/eco-announcement');
  }
}
