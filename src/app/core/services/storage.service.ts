import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';

/**
 * Servicio para gestionar el almacenamiento en localStorage
 * Maneja usuarios, tareas y sesiones de forma segura
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly USERS_KEY = 'todo_app_users';
  private readonly TASKS_KEY = 'todo_app_tasks';
  private readonly SESSION_KEY = 'todo_app_session';

  /**
   * Obtiene todos los usuarios almacenados
   */
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer usuarios:', error);
      return [];
    }
  }

  /**
   * Guarda un nuevo usuario o actualiza uno existente
   */
  saveUser(user: User): void {
    try {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  }

  /**
   * Obtiene todas las tareas de un usuario específico
   */
  getTasksByUser(userId: string): Task[] {
    try {
      const data = localStorage.getItem(this.TASKS_KEY);
      const allTasks: Task[] = data ? JSON.parse(data) : [];
      return allTasks.filter(task => task.userId === userId);
    } catch (error) {
      console.error('Error al leer tareas:', error);
      return [];
    }
  }

  /**
   * Guarda una nueva tarea o actualiza una existente
   */
  saveTask(task: Task): void {
    try {
      const tasks = this.getAllTasks();
      const index = tasks.findIndex(t => t.id === task.id);
      if (index >= 0) {
        tasks[index] = task;
      } else {
        tasks.push(task);
      }
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error al guardar tarea:', error);
    }
  }

  /**
   * Actualiza una tarea existente
   */
  updateTask(task: Task): void {
    this.saveTask(task);
  }

  /**
   * Elimina una tarea
   */
  deleteTask(taskId: string): void {
    try {
      const tasks = this.getAllTasks();
      const filtered = tasks.filter(t => t.id !== taskId);
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  }

  /**
   * Obtiene todas las tareas (sin filtrar por usuario)
   */
  private getAllTasks(): Task[] {
    try {
      const data = localStorage.getItem(this.TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer todas las tareas:', error);
      return [];
    }
  }

  /**
   * Guarda la sesión del usuario actual
   */
  saveSession(userId: string): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({ userId, timestamp: Date.now() }));
    } catch (error) {
      console.error('Error al guardar sesión:', error);
    }
  }

  /**
   * Obtiene la sesión actual
   */
  getSession(): { userId: string; timestamp: number } | null {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error al leer sesión:', error);
      return null;
    }
  }

  /**
   * Limpia la sesión actual
   */
  clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Error al limpiar sesión:', error);
    }
  }

  /**
   * Limpia todos los datos (útil para desarrollo/testing)
   */
  clearAll(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.TASKS_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }
}

