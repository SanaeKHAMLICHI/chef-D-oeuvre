import {MatCardModule} from "@angular/material/card";
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgClass, NgForOf, NgOptimizedImage} from "@angular/common";
import {CardComponent} from "../../../../standalone/components/card/card.component";
import {ButtonComponent} from "../../../../standalone/components/button/button.component";
import {AnnouncementStore,} from "./state/items.store";
import { Router } from '@angular/router';
import { PaginationMetaDto } from './state/item.model';
import { AnnouncementFacade } from './state/items.facade';
import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
} from '@angular/core';

@Component({
  selector: 'app-items',
  standalone: true,
    imports: [
        MatCardModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        NgForOf,
        NgOptimizedImage,
        NgClass,
        CardComponent,
        ButtonComponent,
    ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {
  private router = inject(Router);
  announcementFacade = inject(AnnouncementFacade);
  announcementStore = inject(AnnouncementStore);
  announcements$ = this.announcementStore.announcements;
  meta$: Signal<PaginationMetaDto> = this.announcementStore.pagination;
  searchFilter$: Signal<string> = this.announcementStore.searchField;


  ngOnInit() {
    this.loadAnnouncements();
  }

  loadAnnouncements(page: number = 1) {
    this.announcementFacade.getAnnouncementsPaginated({
      page: page,
      size: this.meta$().size,
      search: this.searchFilter$(),
      localisation: this.announcementStore.getFilters().location,
      category: this.announcementStore.getFilters().category
    });
  }

  onPageChange(page: number) {
    this.loadAnnouncements(page);
  }

  getPages(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  navigateToAnnouncement(id: number) {
    this.router.navigate(['/announcement', id]).then(success => {
      if (success) {
        console.log('Navigation réussie vers l\'annonce', id);
      } else {
        console.error('Échec de la navigation.');
      }
    });
  }
}
