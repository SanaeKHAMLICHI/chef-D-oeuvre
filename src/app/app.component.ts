import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ThemeService} from "./features/components/auth/services/theme.service";
import { NgClass} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent  {
  constructor(protected themeService: ThemeService) {}
}


