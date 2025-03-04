import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "../../../standalone/components/header/header.component";
@Component({
  selector: 'app-authenticated',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './authenticated.component.html',
})
export class AuthenticatedComponent {} 