import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatSuffix} from "@angular/material/form-field";
import {ThemeService} from "../../services/theme.service";
import {RouterLink} from "@angular/router";
import {HeaderService} from "./header.service";
import {ButtonComponent} from "../button/button.component";
import {NgClass, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../routes/auth/state/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../../../routes/auth/state/auth.store';
import { computed } from '@angular/core';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatSuffix,
    RouterLink,
    ButtonComponent,
    NgOptimizedImage,
    NgClass,
    NgIf,
    NgStyle,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);
  store = inject(AuthStore);
  isMenuOpen = false;
  isAuthenticated = computed(() => !!this.store.getToken());


  ngOnInit() {
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
  
}
