// theme.service.ts
import {Injectable, signal} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ThemeService {
  isDarkTheme = signal(this.getInitialTheme());

  toggleTheme(): void {
    const newTheme = !this.isDarkTheme();
    this.isDarkTheme.set(newTheme);
    localStorage.setItem('isDarkTheme', newTheme.toString());
  }

  private getInitialTheme(): boolean {
    const storedTheme = localStorage.getItem('isDarkTheme');
    return storedTheme ? storedTheme === 'true' : false;
  }
}

