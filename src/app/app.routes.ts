import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/components/auth/routes/auth.routes').then((r) => r.authRoutes)
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./features/components/user/routes/user.routes').then((r) => r.userRoutes)
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./features/components/chat/routes/chat.routes').then((r) => r.chatRoutes)
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/components/announcements/routes/announcements.routes').then((r) => r.announcementsRoutes)

  },
  {
    path: '**',
    redirectTo: 'announcements',
  },
];
