import { User, UserType } from "../models/auth.model";
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
  } from '@ngrx/signals';
  import {
    withDevtools,
    withStorageSync,
  } from '@angular-architects/ngrx-toolkit';
  import { computed } from '@angular/core';

const initialUserState: {
    token: String;
    profile: User;
  } = {
    token: '',
    profile: {
        id: 0,
        username: '',
        email: '',
        image:'',
        isCompany: false,
        userType: UserType.USER,
        averageRating:0,
        announcementCount:0
    },
  };
  export const AuthStore = signalStore(
    { providedIn: 'root' },
    withDevtools('user'),
    withStorageSync('user'),
    withState(initialUserState),
    withComputed((state) => ({
      getToken: computed(() => state.token()),
      getProfile: computed(() => state.profile()),
    })),
    withMethods((state) => ({
        setToken: (token: string) => patchState(state, { token }),
        setProfile: (profile: User) => patchState(state, { profile }),
        logout: () => patchState(state, {
            token: '',
            profile: {
            id: 0,
            username: '',
            email: '',
            isCompany: false,
            userType: UserType.USER,
            averageRating:0,
            announcementCount:0
            }
        })
    })
  )
)
