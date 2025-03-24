
import { inject, Injectable } from '@angular/core';
import {UserService} from "../services/user.service";
import {Observable, tap} from "rxjs";
import {UserWithAnnouncementDto} from "../models/user.model";
import {AuthStore} from "../../auth/store/auth.store";



@Injectable({
  providedIn: 'root'
})
export class UserFacade {
  userService = inject(UserService);
  authStore = inject(AuthStore);

  updateUsername(newUsername: string) {
    return this.userService.updateUsername(newUsername).pipe(
      tap((updatedUser) => this.authStore.setProfile(updatedUser))
    );
  }

  updateProfileImage(file?: File, deleteImage: boolean = false) {
    return  this.userService.updateProfileImage(file, deleteImage).pipe(
      tap((response) => {
        console.log("user",response);
        this.authStore.setProfile(response);
      }))
  }

  getUserById(id: number): Observable<UserWithAnnouncementDto> {
    return this.userService.getUserById(id).pipe(
      tap((user: UserWithAnnouncementDto) => {
        console.log("user",user);
      })
    );
  }
  rateUser(userId: number, rating: number) {
    return this.userService.rateUser(userId, rating);
  }
  checkIfUserHasRated(userId: number) {
    return this.userService.hasUserRated(userId)
  }





}
