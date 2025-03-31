import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {NotificationComponent} from "../../../../standalone/components/notification/notification.component";

@Component({
  selector: 'app-profile-container',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NotificationComponent],
  template: `
    <app-header></app-header>
    <app-notification></app-notification>
    <main class="container mx-auto px-4 py-8">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class UserContainerComponent {}
