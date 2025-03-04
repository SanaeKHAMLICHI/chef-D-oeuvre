import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./routes/public/public.routes').then((r) => r.publicRoutes)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./routes/auth/auth.routes').then((r) => r.authRoutes)
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./routes/authenticated/authenticated.routes').then((r) => r.authenticatedRoutes)
  },
  {
    path: '**',
    redirectTo: '',
  },
];
