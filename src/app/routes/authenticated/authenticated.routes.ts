import { Routes } from '@angular/router';
import { AuthenticatedComponent } from './container/authenticated.component';

export const authenticatedRoutes: Routes = [
  {
    path: '',
    component: AuthenticatedComponent,
    children: [
      {
        path: 'form',
        loadComponent: () =>
          import('./component/item-form/item-form.component').then(
            (c) => c.ItemFormComponent
          ),
        title: 'Formulaire d\'ajout d\'article'
      }
    ]
  }
];