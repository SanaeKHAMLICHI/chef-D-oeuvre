import {Component, inject, Input} from '@angular/core';
import {ButtonComponent} from "../button/button.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {ChatFacade} from "../../../features/components/chat/store/chat.facade";
import {AuthStore} from "../../../features/components/auth/store/auth.store";
import {AnnouncementDto} from "../../../features/components/announcements/models/announcement.model";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ButtonComponent,
    NgOptimizedImage,
    FormsModule,
    NgIf,
    MatIcon,
    NgForOf
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  chatFacade = inject(ChatFacade);
  router = inject(Router);
  authStore = inject(AuthStore);
  isAuthenticated(): boolean {
    return !!this.authStore.getToken();
  }


  @Input() announcement!: AnnouncementDto;

  isModalOpen: boolean = false;
  messageContent: string = '';
  selectedUserId: number | null = null;

  openMessageModal(userId: number) {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.selectedUserId = userId;
    this.messageContent = '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  sendFirstMessage() {
    if (!this.messageContent.trim() || !this.selectedUserId) return;

    this.chatFacade.sendFirstMessage(this.selectedUserId, this.messageContent, 'sent').subscribe(() => {
      this.closeModal();
      this.router.navigate(['/chat']);
    });
  }
  goToUserProfile(userId: number) {
    this.router.navigate(['/user', userId]);
  }

}

