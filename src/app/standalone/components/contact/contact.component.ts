import {Component, Input} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import {NgOptimizedImage} from "@angular/common";
import {AnnouncementDto} from "../../../routes/public/component/items/state/item.model";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ButtonComponent,
    NgOptimizedImage
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  @Input() announcement! : AnnouncementDto;
} 
