import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

/**
 * Servicio de autenticación
 * Gestiona el registro, login y logout de usuarios
 * Usa Web Crypto API para hashear contraseñas
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private storageService: StorageService) {
    // Restaurar sesión al iniciar
    this.restoreSession();
  }

  /**
   * Restaura la sesión del usuario si existe
   */
  private restoreSession(): void {
    const session = this.storageService.getSession();
    if (session) {
      const users = this.storageService.getUsers();
      const user = users.find(u => u.id === session.userId);
      if (user) {
        this.currentUserSubject.next(user);
      } else {
        this.storageService.clearSession();
      }
    }
  }

  /**
   * Hashea una contraseña usando Web Crypto API
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Registra un nuevo usuario
   */
  async register(name: string, email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const users = this.storageService.getUsers();
      
      // Verificar si el email ya existe
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'El email ya está registrado' };
      }

      // Hashear contraseña
      const passwordHash = await this.hashPassword(password);

      // Crear nuevo usuario
      const newUser: User = {
        id: this.generateId(),
        name,
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString()
      };

      // Guardar usuario
      this.storageService.saveUser(newUser);

      // Iniciar sesión automáticamente
      this.storageService.saveSession(newUser.id);
      this.currentUserSubject.next(newUser);

      return { success: true, message: 'Registro exitoso' };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, message: 'Error al registrar usuario' };
    }
  }

  /**
   * Inicia sesión con email y contraseña
   */
  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const users = this.storageService.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return { success: false, message: 'Email o contraseña incorrectos' };
      }

      // Verificar contraseña
      const passwordHash = await this.hashPassword(password);
      if (user.passwordHash !== passwordHash) {
        return { success: false, message: 'Email o contraseña incorrectos' };
      }

      // Guardar sesión
      this.storageService.saveSession(user.id);
      this.currentUserSubject.next(user);

      return { success: true, message: 'Login exitoso' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error al iniciar sesión' };
    }
  }

  /**
   * Cierra la sesión actual
   */
  logout(): void {
    this.storageService.clearSession();
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

