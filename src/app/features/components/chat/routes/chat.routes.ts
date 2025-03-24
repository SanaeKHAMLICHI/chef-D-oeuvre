import { Routes } from '@angular/router';
import {authGuard} from "../../../../core/guards/auth.guard";
import {ChatContainer} from "../container/chat.container";

export const chatRoutes: Routes = [
  {
    path: '',
    component: ChatContainer,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../components/chat.component').then(
            (c) => c.ChatComponent
          ),
        canActivate: [authGuard],
        title: 'Chat',
      }
    ]

  },
];
