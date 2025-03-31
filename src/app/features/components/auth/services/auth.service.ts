import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User, RegisterRequest, CompanyRequestDto, CompanyRequestResponse, CompanyDetailsDto, ResetPasswordDto, NewPasswordDto } from '../models/auth.model';
import {AuthStore} from "../store/auth.store";
import {environment} from "../../../../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  authStore= inject(AuthStore);
  isAuthenticated$ = this.authStore.getToken;


  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/users/authentication`
      , credentials
    )
  }

  register(credentials: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, credentials)
  }

  submitCompanyRequest(credentials : CompanyRequestDto): Observable<CompanyRequestResponse> {
    return this.http.post<CompanyRequestResponse>(`${this.apiUrl}/company/submitRequest`, credentials)
  }

  getCompanyInfoBySiret(siret: string): Observable<CompanyDetailsDto> {
    return this.http.get<CompanyDetailsDto>(`${this.apiUrl}/company/getCompanyInfo/${siret}`)
  }

  requestPasswordReset(resetPasswordDto: ResetPasswordDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/reset-password/init`, resetPasswordDto);
  }

  verifyPasswordReset(key: number): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/users/reset-password/verify/${key}`);
  }

  finishPasswordReset(newPasswordDto: NewPasswordDto): Observable<void> {
    console.log(newPasswordDto);
    return this.http.post<void>(`${this.apiUrl}/users/reset-password/finish`, newPasswordDto);
  }

}
