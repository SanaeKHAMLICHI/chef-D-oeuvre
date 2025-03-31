import {MatCardModule} from "@angular/material/card";
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, Router} from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
  OnDestroy
} from '@angular/core';
import {AnnouncementFacade} from "../../store/announcements.facade";
import {AnnouncementStore} from "../../store/announcements.store";
import {CategoryDto, PaginationMetaDto} from "../../models/announcement.model";
import {CardComponent} from "../../../../../standalone/components/card/card.component";
import {ButtonComponent} from "../../../../../standalone/components/button/button.component";
import {SeoService} from "../../../../../core/services/seo.service";
@Component({
    selector: 'app-announcements',
    standalone: true,
    imports: [
        MatCardModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        NgForOf,
        CardComponent,
        ButtonComponent,
    ],
    templateUrl: './announcements.component.html',
    styleUrl: './announcements.component.css'
})
export class AnnouncementsComponent implements OnInit , OnDestroy {
  router = inject(Router);
  seoService = inject(SeoService);
  route= inject(ActivatedRoute);
  locationSubject = new Subject<string>();
  announcementFacade = inject(AnnouncementFacade);
  announcementStore = inject(AnnouncementStore);
  announcements$ = computed(() =>
    this.isEco()
      ? this.announcementStore.getEcoAnnouncement()
      : this.announcementStore.getAnnouncement()
  );
  meta$ = computed(() =>
    this.isEco() ? this.announcementStore.getEcoPagination() : this.announcementStore.getPagination()
  );
  searchFilter$ = computed(() =>
    this.isEco() ? this.announcementStore.searchFieldEco() : this.announcementStore.searchField()
  );
  ecoMeta$: Signal<PaginationMetaDto> = this.announcementStore.ecoPagination;
  ecoSearchFilter$: Signal<string> = this.announcementStore.searchFieldEco;
  categories$: Signal<CategoryDto[]> = this.announcementStore.categories;
  destroy$ = new Subject<void>();
  isEco = signal(false);
  locationFilter$ = this.announcementStore.getLocationFilter;
  categoryFilter$ = this.announcementStore.getCategoryFilter;
  ecoLocationFilter$ = this.announcementStore.getEcoLocationFilter;

  locationValue = signal('');



  constructor() {
    const initialLocation = this.isEco()
      ? this.ecoLocationFilter$()
      : this.locationFilter$();

    this.locationValue.set(initialLocation);
    console.log("location", this.locationValue());
    this.locationSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(location => {
      if(this.isEco()
      ){
        this.announcementStore.addEcoFilter(
          location as "",
        );
        this.announcementStore.setEcoCurrentPage(1)
      }else {
        this.announcementStore.addFilter(
          location as "",
          this.categoryFilter$()
        );
        this.announcementStore.setCurrentPage(1)
      }

    });
    let previousParams: any = null;

    effect(() => {
      const isEco = this.isEco();
      const meta = this.meta$();
      const search = this.searchFilter$();
      const location = isEco ? this.ecoLocationFilter$() : this.locationFilter$();
      const category = this.categoryFilter$();

      const currentParams = {
        isEco,
        page: meta.currentPage,
        size: meta.size,
        search,
        location,
        category
      };

      if (JSON.stringify(previousParams) === JSON.stringify(currentParams)) {
        return; // ✅ empêche l'appel inutile
      }

      previousParams = currentParams;

      console.log('🚨 EFFECT TRIGGERED', {
        location: this.isEco() ? this.ecoLocationFilter$() : this.locationFilter$(),
      });
      if (this.isEco()) {
        this.announcementFacade.getAnnouncementsEcoPaginated({
          page: this.meta$().currentPage,
          size: this.meta$().size,
          search: this.searchFilter$(),
          localisation: this.ecoLocationFilter$(),
        });
      } else {
        this.announcementFacade.getAnnouncementsPaginated({
          page: this.meta$().currentPage,
          size: this.meta$().size,
          search: this.searchFilter$(),
          localisation: this.locationFilter$(),
          category: this.categoryFilter$()
          ,
        });
      }
    });

  }

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'Greenswap - Accueil',
      description: 'Découvrez notre plateforme d\'échange et de vente d\'objets',
      type: 'website'
    });
    const currentRoute = this.route.snapshot.routeConfig?.path;
    this.isEco.set(currentRoute === 'eco-construction'); // ✅ signal.set()

    this.route.queryParams.subscribe(params => {
      const searchValue = params['search'] || '';
      this.isEco()
        ? this.announcementStore.addFilterSearchEco(searchValue)
        : this.announcementStore.addFilterSearch(searchValue);
    });

    this.announcementFacade.getCategories().subscribe();
  }



  loadAnnouncements() {
    if(this.isEco()){
      console.log("eco");
      this.announcementFacade.getAnnouncementsEcoPaginated({
        page: this.meta$().currentPage,
        size: this.ecoMeta$().size,
        search: this.ecoSearchFilter$(),
        localisation: this.ecoLocationFilter$(),
      });
    }else {
      this.announcementFacade.getAnnouncementsPaginated({
        page: this.meta$().currentPage,
        size: this.meta$().size,
        search: this.searchFilter$(),
        localisation: this.locationFilter$(),
        category: this.categoryFilter$()
      });
    }
  }

  onPageChange(page: number) {
   this.isEco()? this.announcementStore.setEcoCurrentPage(page) : this.announcementStore.setCurrentPage(page);
  }

  getPages(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  navigateToAnnouncement(id: number) {
    if(this.isEco()){
      this.router.navigate([`/eco-announcement/${id}`]);
    }else {
      this.router.navigate(['/announcement', id]);
    }
  }

  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const categoryId = select.value;
    const location = this.locationFilter$() as "";

    this.announcementStore.addFilter(
      location,
      categoryId
    );
    this.announcementStore.setCurrentPage(1)
    this.loadAnnouncements();
  }

  onLocationInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.locationSubject.next(input.value);
  }

  ngOnDestroy() {
    this.seoService.resetMetaTags();
  }

}
