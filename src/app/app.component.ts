import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ThemeService} from "./standalone/services/theme.service";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {HeaderComponent} from "./standalone/components/header/header.component";
import {HeaderService} from "./standalone/components/header/header.service";
import {ItemService} from "./routes/public/component/items/state/items.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, HeaderComponent, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent  {
  constructor(private itemService: ItemService, protected themeService: ThemeService , protected headerService: HeaderService) {}



}


