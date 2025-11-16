import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

/**
 * Componente de encabezado
 * Muestra el buscador, botón de crear tarea y logout
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() createTaskClick = new EventEmitter<void>();

  currentUser: User | null = null;
  searchText: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.searchChange.emit(value);
  }

  onCreateTaskClick(): void {
    this.createTaskClick.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

