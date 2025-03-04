import { User, UserType } from "./auth.model";
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
        password: '',
        isCompany: false,
        userType: UserType.USER,
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
            password: '',
            isCompany: false,
            userType: UserType.USER,
            }
        })
    })
  )
)