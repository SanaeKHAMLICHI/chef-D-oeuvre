import {Component, inject, OnInit} from '@angular/core';
import {ChatFacade} from "../store/chat.facade";
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {AuthStore} from "../../auth/store/auth.store";

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    FormsModule,
    MatIconButton,
    NgClass,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  authStore = inject(AuthStore);
  userId: number | null = null;
  message: string = '';
  currentUser=  this.authStore.getProfile().username
  selectedUserName: string = '';
  selectedUserImage:string='';



  // Utilisation des signals
  conversations = this.chatFacade.getConversations();
  messages = this.chatFacade.getMessages();

  constructor(private chatFacade: ChatFacade) {}

  ngOnInit() {
    this.chatFacade.loadConversations();

    // Vérifier si on est sur une version desktop/tablette
    if (window.innerWidth > 768) {  // Exécuter seulement pour les écrans plus larges
      setTimeout(() => {
        const allConversations = this.conversations();
        if (allConversations.length > 0) {
          const lastConversation = allConversations[0];
          this.openChat(lastConversation.userId);
        }
      }, 300);
    }
  }



  openChat(userId: number) {
    this.userId = userId;
    const selectedConversation = this.conversations().find(conv => conv.userId === userId);
    if (selectedConversation) {
      this.selectedUserName = selectedConversation.username;
      this.selectedUserImage = selectedConversation.image;
    }
    this.chatFacade.loadMessages(userId);
  }

  sendMessage(content: string) {
    if (!content.trim() || !this.userId) return;

    console.log("🚀 Message envoyé :", content);
    this.chatFacade.sendMessage(this.userId, content, 'sent');
    this.message = '';
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('hidden');
    }
  }

}

