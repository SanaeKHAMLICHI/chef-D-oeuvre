import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import {AuthService} from "../../features/components/auth/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    const isAuthenticated = this.authService.isAuthenticated$()
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated$()) {
    return true;
  }

  localStorage.setItem('redirectUrl', router.url);

  return router.createUrlTree(['/auth/login']);
};
