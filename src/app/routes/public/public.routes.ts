import { Routes } from '@angular/router';
import {ItemsComponent} from "./component/items/items.component";
import {AuthComponent} from "../auth/container/auth/auth.component";
import {PublicComponent} from "./container/public/public.component";

export const publicRoutes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./component/items/items.component').then(
            (c) => c.ItemsComponent,
          ),
        title: 'home',
      },
      {
        path: 'announcement/:id',
        loadComponent: () =>
          import('./component/details-items/details-item.component').then(
            (c) => c.DetailsItemComponent,
          ),
        title: "detail d'annonce",
      },
      {
        path: '**',
        redirectTo: '/',
      }
    ]
  },
];
