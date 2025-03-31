import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="container mx-auto px-4 py-8">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class AuthContainer {} 
