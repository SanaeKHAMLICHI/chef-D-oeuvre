import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../../environments/environment";
import {UserWithAnnouncementDto} from "../models/user.model";
import { AuthStore } from '../../auth/store/auth.store';
import {User} from "../../auth/models/auth.model";



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  authStore= inject(AuthStore);
  isAuthenticated$ = this.authStore.getToken;


  updateUsername(newUsername: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/profile`, { username: newUsername });
  }


  updateProfileImage(file?: File, deleteImage = false): Observable<User> {
    const formData = new FormData();

    if (file instanceof File) {
      formData.append('file', file);

      console.log('📤 Envoi image avec fichier');
      return this.http.put<User>(
        `${this.apiUrl}/users/image?deleteImage=${deleteImage}`,
        formData
      );
    }

    // 🔁 Aucun fichier, juste un paramètre URL
    console.log('🗑 Envoi suppression sans fichier');
    return this.http.put<User>(
      `${this.apiUrl}/users/image?deleteImage=${deleteImage}`,
      formData
    )
  }

  getUserById(id: number): Observable<UserWithAnnouncementDto> {
    return this.http.get<UserWithAnnouncementDto>(`${this.apiUrl}/users/${id}`);
  }

  rateUser(userId: number, rating: number){
    return this.http.post(`${this.apiUrl}/users/${userId}/rate?rating=${rating}`, null);
  }

  hasUserRated(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/${userId}/has-rated`);
  }


}
