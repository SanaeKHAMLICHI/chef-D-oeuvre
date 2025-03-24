import { Routes } from '@angular/router';
import {AuthContainer} from "../container/auth.container";
import {inject} from "@angular/core";
import { Router } from '@angular/router';


export const authRoutes: Routes = [
  {
    path: '',
    component: AuthContainer,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('../components/login/login.component').then((c) => c.LoginComponent),
        title: 'Connexion',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../components/register/register.component').then((c) => c.RegisterComponent),
        title: 'Inscription',
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('../components/reset-password/reset-password.component').then(
            (c) => c.ResetPasswordComponent,
          ),
        title: 'Mot de passe oublié',
      },
      {
        path: 'verification-code',
        loadComponent: () =>
          import('../components/verification-code/verification-code.component').then(
            (c) => c.VerificationCodeComponent,
          ),
        title: 'Verification de code',
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('../components/change-password/change-password.component').then(
            (c) => c.ChangePasswordComponent,
          ),
        canActivate: [() => inject(Router).getCurrentNavigation()?.previousNavigation?.finalUrl?.toString().includes('verification-code') ?? false],
        title: 'Changer mot de passe',
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
