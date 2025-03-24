import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Conversation , Message} from "../models/chat.model";


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/v1/chat';

  constructor(private http: HttpClient) {}

  sendMessage(receiverId: number, content: string, status: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, { receiverId, content, status });
  }

  getMessages(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${userId}`);
  }

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`);
  }

  getMessagesBetweenUsers(otherUserId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${otherUserId}`);
  }

  deleteConversation(otherUserId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/conversations/${otherUserId}`);
  }
}
