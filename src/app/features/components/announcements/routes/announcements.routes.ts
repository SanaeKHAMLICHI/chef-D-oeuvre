import { Routes } from '@angular/router';
import {AnnouncementContainerComponent} from "../container/announcement-container.component";
import {authGuard} from "../../../../core/guards/auth.guard";

export const announcementsRoutes: Routes = [
  {
    path: '',
    component: AnnouncementContainerComponent,
    children: [
      {
        path: 'announcement/:id',
        loadComponent: () =>
          import('../components/details-announcement/details-announcement.component').then(
            (c) => c.DetailsAnnouncementComponent,
          ),
        title: "détail d'annonce",
      },
      {
        path: 'eco-announcement/:id',
        loadComponent: () =>
          import('../components/details-announcement/details-announcement.component').then(
            (c) => c.DetailsAnnouncementComponent,
          ),
        title: "détail d'annonce",
      },
      {
        path: 'create',
        loadComponent: () =>
          import('../components/announcement-form/announcement-form.component').then(
            (c) => c.AnnouncementFormComponent
          ),
        canActivate: [authGuard],
        title: 'Formulaire d\'ajout d\'article'
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('../components/favorites/favorites.component').then(
            (c) => c.FavoritesComponent
          ),
        canActivate: [authGuard],
        title: 'Mes favoris'
      },
      {
        path: 'eco-construction',
        loadComponent: () =>
          import('../components/announcements/announcements.component').then(
            (c) => c.AnnouncementsComponent
          ),
        title: 'Éco-construction'
      },
      {
        path: '',
        loadComponent: () =>
          import('../components/announcements/announcements.component').then(
            (c) => c.AnnouncementsComponent,
          ),
        title: 'Accueil',
      },
      {
        path: '**',
        redirectTo: '',
      }
    ]
  },
];
