import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  autoClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private notificationId = 0;


  show(message: string, type: Notification['type'] = 'info', duration: number = 3000, autoClose: boolean = true): void {
    const notification: Notification = {
      id: this.notificationId++,
      message,
      type,
      duration,
      autoClose
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, notification]);

    if (autoClose) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  remove(id: number): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next(currentNotifications.filter(notification => notification.id !== id));
  }

  clear(): void {
    this.notifications.next([]);
  }
}
