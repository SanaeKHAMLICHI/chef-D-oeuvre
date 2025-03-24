import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import {AuthStore} from "../../features/components/auth/store/auth.store";

@Injectable({
  providedIn: 'root'
})
export class CheckNotAuthenticatedGuard implements CanActivate {
  private router = inject(Router);
  private authStore = inject(AuthStore);

  canActivate(): boolean {
    const token = this.authStore.getToken();

    if (token) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}

