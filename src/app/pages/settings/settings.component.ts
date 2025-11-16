import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';
import { HeaderComponent } from '../../components/header/header.component';

/**
 * Componente de configuración
 * Permite gestionar la cuenta y limpiar datos
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Limpia todos los datos del localStorage
   */
  clearAllData(): void {
    if (confirm('¿Estás seguro de que deseas eliminar todos los datos? Esta acción no se puede deshacer.')) {
      this.storageService.clearAll();
      this.authService.logout();
      this.notificationService.info('Todos los datos han sido eliminados');
      this.router.navigate(['/login']);
    }
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Maneja el cambio de búsqueda (no usado en settings)
   */
  onSearchChange(searchText: string): void {
    // No implementado en settings
  }

  /**
   * Maneja el click en crear tarea (no usado en settings)
   */
  onCreateTaskClick(): void {
    // No implementado en settings
  }
}

