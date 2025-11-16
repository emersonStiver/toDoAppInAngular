import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { NotificationService } from '../../core/services/notification.service';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Subscription } from 'rxjs';

/**
 * Componente de dashboard principal
 * Muestra las tareas organizadas en 3 columnas por estado
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskCardComponent,
    TaskFormComponent,
    ConfirmDialogComponent,
    HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  pendingTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];

  searchText: string = '';
  priorityFilter: TaskPriority | 'all' = 'all';
  sortBy: 'dueDate' | 'priority' | 'none' = 'none';
  sortOrder: 'asc' | 'desc' = 'asc';

  showTaskForm = false;
  showConfirmDialog = false;
  taskToEdit?: Task;
  taskToDelete?: Task;

  private subscriptions: Subscription[] = [];

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en las tareas
    const tasksSub = this.taskService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
      this.applyFilters();
    });
    this.subscriptions.push(tasksSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Aplica todos los filtros y ordenamientos
   */
  applyFilters(): void {
    let tasks = [...this.allTasks];

    // Filtro de búsqueda
    if (this.searchText.trim()) {
      tasks = this.taskService.filterTasksByText(tasks, this.searchText);
    }

    // Filtro de prioridad
    if (this.priorityFilter !== 'all') {
      tasks = this.taskService.filterTasksByPriority(tasks, this.priorityFilter);
    }

    // Ordenamiento
    if (this.sortBy === 'dueDate') {
      tasks = this.taskService.sortTasksByDueDate(tasks, this.sortOrder === 'asc');
    } else if (this.sortBy === 'priority') {
      tasks = this.taskService.sortTasksByPriority(tasks, this.sortOrder === 'asc');
    }

    this.filteredTasks = tasks;
    this.updateTaskColumns();
  }

  /**
   * Actualiza las columnas de tareas según el estado
   */
  updateTaskColumns(): void {
    this.pendingTasks = this.filteredTasks.filter(t => t.status === 'pending');
    this.inProgressTasks = this.filteredTasks.filter(t => t.status === 'in-progress');
    this.completedTasks = this.filteredTasks.filter(t => t.status === 'completed');
  }

  /**
   * Maneja el cambio de búsqueda desde el header
   */
  onSearchChange(searchText: string): void {
    this.searchText = searchText;
    this.applyFilters();
  }

  /**
   * Maneja el click en crear tarea
   */
  onCreateTaskClick(): void {
    this.taskToEdit = undefined;
    this.showTaskForm = true;
  }

  /**
   * Maneja el guardado de tarea
   */
  onTaskSave(taskData: Partial<Task>): void {
    if (this.taskToEdit) {
      // Actualizar tarea existente
      const updatedTask: Task = {
        ...this.taskToEdit,
        ...taskData,
        updatedAt: new Date().toISOString()
      };
      this.taskService.updateTask(updatedTask);
      this.notificationService.success('Tarea actualizada exitosamente');
    } else {
      // Crear nueva tarea
      const newTask = this.taskService.createTask(
        taskData.title!,
        taskData.description,
        taskData.dueDate,
        taskData.priority!
      );
      if (newTask) {
        this.notificationService.success('Tarea creada exitosamente');
      }
    }
    this.showTaskForm = false;
    this.taskToEdit = undefined;
  }

  /**
   * Maneja la cancelación del formulario
   */
  onTaskFormCancel(): void {
    this.showTaskForm = false;
    this.taskToEdit = undefined;
  }

  /**
   * Maneja la edición de tarea
   */
  onTaskEdit(task: Task): void {
    this.taskToEdit = task;
    this.showTaskForm = true;
  }

  /**
   * Maneja la eliminación de tarea
   */
  onTaskDelete(task: Task): void {
    this.taskToDelete = task;
    this.showConfirmDialog = true;
  }

  /**
   * Confirma la eliminación
   */
  onConfirmDelete(): void {
    if (this.taskToDelete) {
      this.taskService.deleteTask(this.taskToDelete.id);
      this.notificationService.success('Tarea eliminada exitosamente');
      this.taskToDelete = undefined;
    }
    this.showConfirmDialog = false;
  }

  /**
   * Cancela la eliminación
   */
  onCancelDelete(): void {
    this.showConfirmDialog = false;
    this.taskToDelete = undefined;
  }

  /**
   * Maneja el cambio de filtro de prioridad
   */
  onPriorityFilterChange(priority: TaskPriority | 'all'): void {
    this.priorityFilter = priority;
    this.applyFilters();
  }

  /**
   * Maneja el cambio de ordenamiento
   */
  onSortChange(sortBy: 'dueDate' | 'priority' | 'none'): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  /**
   * Alterna el orden de ordenamiento
   */
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }
}

