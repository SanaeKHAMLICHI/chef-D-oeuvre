import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
