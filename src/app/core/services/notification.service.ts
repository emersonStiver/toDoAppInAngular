import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Tipo de notificación
 */
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

/**
 * Interfaz de notificación
 */
export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

/**
 * Servicio de notificaciones
 * Gestiona las notificaciones toast de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  /**
   * Muestra una notificación
   */
  show(message: string, type: NotificationType = 'info', duration: number = 3000): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);

    // Auto-eliminar después de la duración especificada
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  /**
   * Muestra una notificación de información
   */
  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Elimina una notificación
   */
  remove(id: string): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(current.filter(n => n.id !== id));
  }

  /**
   * Limpia todas las notificaciones
   */
  clear(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

