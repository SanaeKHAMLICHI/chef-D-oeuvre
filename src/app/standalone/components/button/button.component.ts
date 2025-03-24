import {Component, Input , Output, EventEmitter} from '@angular/core';
import {NgClass} from "@angular/common";
import {Router} from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass,
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
      console.log("routerLink", this.routerLink);
      this.router.navigateByUrl(this.routerLink.startsWith('/') ? this.routerLink : '/' + this.routerLink)
        .catch(error => {
          console.error('Navigation error:', error);
        });
    }
    this.click.emit();
  }
}
