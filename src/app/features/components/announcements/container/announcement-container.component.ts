import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "../../../../shared/components/header/header.component";
import {NotificationComponent} from "../../../../standalone/components/notification/notification.component";

@Component({
  selector: 'app-announcement-container',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NotificationComponent],
  template: `
    <app-header></app-header>
    <main class="container mx-auto px-4 py-8">
      <app-notification></app-notification>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class AnnouncementContainerComponent {}
