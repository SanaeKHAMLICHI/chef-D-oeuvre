import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "../../../../shared/components/header/header.component";

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="container mx-auto px-4 py-8">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class ChatContainer {}
