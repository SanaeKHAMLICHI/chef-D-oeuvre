import {Component, Input , Output, EventEmitter} from '@angular/core';
import {NgClass} from "@angular/common";
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() label: string = 'Button';
  @Input() class: string = '';
  @Input() customClass: string = '';
  @Output() click = new EventEmitter<void>();
  @Input() routerLink: string = '';

  constructor(private router: Router) {}

  onClick() {
    
    if (this.routerLink) {
      console.log('Tentative de navigation vers:', this.routerLink);
      const fullPath = `/${this.routerLink}`;
      console.log('Chemin complet:', fullPath);
      
      this.router.navigateByUrl(fullPath)
        .then(() => {
          console.log('Navigation réussie vers:', fullPath);
          console.log('URL actuelle:', this.router.url);
        })
        .catch(error => {
          console.error('Erreur de navigation:', error);
          console.error('État actuel du router:', this.router.url);
        });
    }
    
    this.click.emit();
  }
}
