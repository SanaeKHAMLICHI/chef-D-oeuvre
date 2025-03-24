import { Routes } from '@angular/router';
import { authGuard } from '../../../../core/guards/auth.guard';
 import {UserContainerComponent} from "../container/user.container";

export const userRoutes: Routes = [
  {
    path: '',
    component: UserContainerComponent,
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('../components/profile/profile.component').then((c) => c.ProfileComponent),
        canActivate: [authGuard],
        title: 'Profil utilisateur',
      },
      {
        path: '',
        loadComponent: () =>
          import('../components/profile/profile.component').then((c) => c.ProfileComponent),
        canActivate: [authGuard],
        title: 'Mon profil',
      },
    ]
  },
];
