import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'header',
    loadComponent: () =>
      import('./header/header.component').then(
        (c) => c.HeaderComponent,
      ),
    title: 'Accueil',
  },
];
