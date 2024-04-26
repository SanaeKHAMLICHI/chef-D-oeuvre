import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {devTools} from "@ngneat/elf-devtools";

bootstrapApplication(AppComponent, appConfig)
  .then(() => devTools())
  .catch((err) => console.error(err));
