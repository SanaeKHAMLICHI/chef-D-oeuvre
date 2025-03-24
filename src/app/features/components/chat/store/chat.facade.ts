import { Injectable, signal } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import {Conversation , Message} from "../models/chat.model";

@Injectable({
  providedIn: 'root'
})
export class ChatFacade {
  private messages = signal<Message[]>([]);
  private conversations = signal<Conversation[]>([]);

  constructor(private chatService: ChatService) {}

  loadConversations() {
    this.chatService.getConversations().subscribe((data) => {
      this.conversations.set(data);
    });
  }

  loadMessages(userId: number) {
    this.chatService.getMessagesBetweenUsers(userId).subscribe((data) => {
      this.messages.set(data);
      console.log("Messages loaded" , this.messages());
    });
  }

  sendMessage(receiverId: number, content: string, status: string) {
    this.chatService.sendMessage(receiverId, content, status).subscribe((message) => {

      // Mettre à jour les messages affichés
      this.messages.update((messages) => [...messages, message]);

      // Mettre à jour le lastMessageContent dans la liste des conversations
      this.conversations.update((conversations) => {
        return conversations.map(conv =>
          conv.userId === receiverId
            ? { ...conv, lastMessageContent: content } // Mise à jour du dernier message
            : conv
        );
      });
    });
  }

  sendFirstMessage(receiverId: number, content: string, status: string): Observable<Message> {
    return this.chatService.sendMessage(receiverId, content, status)
  }

  getConversations() {
    return this.conversations;
  }

  getMessages() {
    return this.messages;
  }
}
