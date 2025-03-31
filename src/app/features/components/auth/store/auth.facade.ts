import { AuthService } from '../services/auth.service';
import { LoginRequest, LoginResponse, CompanyRequestDto, CompanyRequestResponse, CompanyDetailsDto, NewPasswordDto,User , RegisterRequest, ResetPasswordDto } from '../models/auth.model';
import { AuthStore } from './auth.store';
import { inject, Injectable} from '@angular/core';
import { Observable, tap } from 'rxjs';
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  authStore = inject(AuthStore);
  authService = inject(AuthService);
  router= inject(Router);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.authService.login(credentials).pipe(
      tap((response) => {
        this.authStore.setToken(response.token);
        this.authStore.setProfile(response.profile);
      }))
  }

  register(credentials: RegisterRequest): Observable<User> {
    return this.authService.register(credentials).pipe(
      tap(() => {
        this.router.navigateByUrl('/auth/login')
      }))
  }

  submitCompanyRequest(credentials: CompanyRequestDto): Observable<CompanyRequestResponse> {
    return this.authService.submitCompanyRequest(credentials).pipe(
      tap(() => {
        this.router.navigateByUrl('/auth/login');
      }))
  }

  getCompanyInfoBySiret(siret: string): Observable<CompanyDetailsDto> {
    return this.authService.getCompanyInfoBySiret(siret).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }

  submitRequestPasswordReset(resetPasswordDto: ResetPasswordDto): Observable<void> {
    console.log(resetPasswordDto);
    return this.authService.requestPasswordReset(resetPasswordDto);
  }

  verifyPasswordReset(key: number): Observable<void> {
    return this.authService.verifyPasswordReset(key);
  }

  finishPasswordReset(newPasswordDto: NewPasswordDto): Observable<void> {
    console.log(newPasswordDto);
    return this.authService.finishPasswordReset(newPasswordDto).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }
}
