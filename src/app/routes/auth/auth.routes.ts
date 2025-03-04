import { Routes } from '@angular/router';
import {AuthComponent} from "./container/auth/auth.component";
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./component/login/login.component').then(
            (c) => c.LoginComponent,
          ),
        title: 'Se connecter',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./component/register/register.component').then(
            (c) => c.RegisterComponent,
          ),
        title: 'S\'inscrire',
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./component/reset-password/reset-password.component').then(
            (c) => c.ResetPasswordComponent,
          ),
        title: 'Mot de passe oublié',
      },
      {
        path: 'verification-code',
        loadComponent: () =>
          import('./component/verification-code/verification-code.component').then(
            (c) => c.VerificationCodeComponent,
          ),
        title: 'Verification de code',
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./component/change-password/change-password.component').then(
            (c) => c.ChangePasswordComponent,
          ),
        canActivate: [() => inject(Router).getCurrentNavigation()?.previousNavigation?.finalUrl?.toString().includes('verification-code') ?? false],
        title: 'Changer mot de passe',
      },
      {
        path: 'form',
        loadComponent: () =>
          import('../authenticated/component/item-form/item-form.component').then(
            (c) => c.ItemFormComponent
          ),
        title: 'Formulaire d\'ajout d\'article'
      },
      {
        path: '**',
        redirectTo: 'login',
      }
    ]
  },
];
