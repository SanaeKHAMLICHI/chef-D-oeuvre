import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {ThemeService} from "../../../features/components/auth/services/theme.service";
import {ButtonComponent} from "../../../standalone/components/button/button.component";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HostListener, signal } from '@angular/core';
import {AnnouncementStore} from "../../../features/components/announcements/store/announcements.store";
import {AuthStore} from "../../../features/components/auth/store/auth.store";



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    ButtonComponent,
    NgOptimizedImage,
    NgClass,
    FormsModule,
    RouterLink,
    NgIf
  ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  announcementStore= inject(AnnouncementStore);
  router = inject(Router);
  themeService = inject(ThemeService);
  store = inject(AuthStore);
  isMenuOpen = false;
  isAuthenticated = computed(() => !!this.store.getToken());
  user$ = this.store.getProfile;
  isProfileMenuOpen = signal(false);
  searchValue = signal(''); // signal local

  constructor() {
    const isEco = this.router.url.startsWith('/eco-construction');
    const initialSearch = isEco
      ? this.announcementStore.getSearchEcoFilter()
      : this.announcementStore.getSearchFilter();

    this.searchValue.set(initialSearch);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout(): void {
    this.store.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isProfileMenuOpen.set(false);
    }
  }
  toggleProfileMenu() {
    this.isProfileMenuOpen.update(value => !value);
  }

  onSearchSubmit() {
    const search = this.searchValue().trim();
    const isEco = this.router.url.startsWith('/eco-construction');


    if (search) {
      if (isEco) {
        this.announcementStore.addFilterSearchEco(search);
        this.announcementStore.setEcoCurrentPage(1);
      } else {
        this.announcementStore.addFilterSearch(search);
        this.announcementStore.setCurrentPage(1);
      }

      this.router.navigate([isEco ? '/eco-construction' : '/'], {
        queryParams: { search },
      });
    } else {
      this.resetAll();
    }
  }



  resetAll() {
    const isEco = this.router.url.startsWith('/eco-construction');

    this.searchValue.set('');
    isEco
      ? this.announcementStore.clearEcoFilters()
      : this.announcementStore.clearFilters();

    this.router.navigate([isEco ? '/eco-construction' : '/']);
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
  }
  navigateToEco() {
    this.router.navigateByUrl('/eco-construction');
  }


}
