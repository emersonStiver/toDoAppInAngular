import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

/**
 * Servicio para gestionar tareas
 * Proporciona operaciones CRUD y filtrado de tareas
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private authService: AuthService
  ) {
    // Cargar tareas cuando el usuario cambie
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadTasks(user.id);
      } else {
        this.tasksSubject.next([]);
      }
    });
  }

  /**
   * Carga las tareas del usuario actual
   */
  private loadTasks(userId: string): void {
    const tasks = this.storageService.getTasksByUser(userId);
    this.tasksSubject.next(tasks);
  }

  /**
   * Crea una nueva tarea
   */
  createTask(
    title: string,
    description: string | undefined,
    dueDate: string | undefined,
    priority: TaskPriority
  ): Task | null {
    const user = this.authService.getCurrentUser();
    if (!user) return null;

    const newTask: Task = {
      id: this.generateId(),
      userId: user.id,
      title,
      description,
      dueDate,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.storageService.saveTask(newTask);
    this.loadTasks(user.id);
    return newTask;
  }

  /**
   * Actualiza una tarea existente
   */
  updateTask(task: Task): void {
    const user = this.authService.getCurrentUser();
    if (!user || task.userId !== user.id) return;

    task.updatedAt = new Date().toISOString();
    this.storageService.updateTask(task);
    this.loadTasks(user.id);
  }

  /**
   * Elimina una tarea
   */
  deleteTask(taskId: string): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.storageService.deleteTask(taskId);
    this.loadTasks(user.id);
  }

  /**
   * Cambia el estado de una tarea
   */
  changeTaskStatus(taskId: string, status: TaskStatus): void {
    const tasks = this.tasksSubject.value;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
      this.updateTask(task);
    }
  }

  /**
   * Obtiene todas las tareas del usuario actual
   */
  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  /**
   * Obtiene tareas filtradas por estado
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasksSubject.value.filter(task => task.status === status);
  }

  /**
   * Filtra tareas por texto (título y descripción)
   */
  filterTasksByText(tasks: Task[], searchText: string): Task[] {
    if (!searchText.trim()) return tasks;
    const lowerSearch = searchText.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowerSearch) ||
      (task.description && task.description.toLowerCase().includes(lowerSearch))
    );
  }

  /**
   * Filtra tareas por prioridad
   */
  filterTasksByPriority(tasks: Task[], priority: TaskPriority | 'all'): Task[] {
    if (priority === 'all') return tasks;
    return tasks.filter(task => task.priority === priority);
  }

  /**
   * Ordena tareas por fecha de vencimiento
   */
  sortTasksByDueDate(tasks: Task[], ascending: boolean = true): Task[] {
    return [...tasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Ordena tareas por prioridad
   */
  sortTasksByPriority(tasks: Task[], ascending: boolean = true): Task[] {
    const priorityOrder: Record<TaskPriority, number> = { low: 1, medium: 2, high: 3 };
    return [...tasks].sort((a, b) => {
      const orderA = priorityOrder[a.priority];
      const orderB = priorityOrder[b.priority];
      return ascending ? orderA - orderB : orderB - orderA;
    });
  }

  /**
   * Verifica si una tarea está vencida
   */
  isTaskOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

