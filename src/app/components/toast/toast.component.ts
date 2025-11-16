import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';

/**
 * Componente de notificaciones toast
 * Muestra notificaciones en la esquina superior derecha
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  remove(id: string): void {
    this.notificationService.remove(id);
  }

  getNotificationClass(type: string): string {
    const baseClasses = 'px-6 py-4 rounded-lg shadow-lg mb-4 flex items-center justify-between min-w-[300px] max-w-md';
    const typeClasses: Record<string, string> = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
      warning: 'bg-yellow-500 text-white'
    };
    return `${baseClasses} ${typeClasses[type] || typeClasses['info']}`;
  }
}

