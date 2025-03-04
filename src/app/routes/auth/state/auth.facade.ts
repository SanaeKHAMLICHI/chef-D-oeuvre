import { AuthService } from './auth.service'; 
import { LoginRequest, LoginResponse, CompanyRequestDto, CompanyRequestResponse, CompanyDetailsDto, NewPasswordDto } from './auth.model'; 
import { AuthStore } from './auth.store';
import { User } from './auth.model';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { RegisterRequest, ResetPasswordDto } from './auth.model';


@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  authStore = inject(AuthStore);
  authService = inject(AuthService);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.authService.login(credentials).pipe(
      tap((response) => {
        this.authStore.setToken(response.token);
        this.authStore.setProfile(response.profile);
      }))
  }

  register(credentials: RegisterRequest): Observable<User> {
    return this.authService.register(credentials).pipe(
      tap((response) => {
        console.log(response);

      }))
  }

  submitCompanyRequest(credentials: CompanyRequestDto): Observable<CompanyRequestResponse> {
    return this.authService.submitCompanyRequest(credentials).pipe(
      tap((response) => {
        console.log(response);
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
    return this.authService.finishPasswordReset(newPasswordDto);
  }
}