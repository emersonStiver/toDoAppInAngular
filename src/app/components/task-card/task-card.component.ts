import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { PriorityPipe } from '../../shared/pipes/priority.pipe';
import { StatusPipe } from '../../shared/pipes/status.pipe';

/**
 * Componente de tarjeta de tarea
 * Muestra la información de una tarea y permite interactuar con ella
 */
@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, PriorityPipe, StatusPipe],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  constructor(private taskService: TaskService) {}

  /**
   * Obtiene las clases CSS según la prioridad
   */
  getPriorityClasses(priority: string): string {
    const classes: Record<string, string> = {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300'
    };
    return classes[priority] || classes['low'];
  }

  /**
   * Verifica si la tarea está vencida
   */
  isOverdue(): boolean {
    return this.taskService.isTaskOverdue(this.task);
  }

  /**
   * Cambia el estado de la tarea
   */
  changeStatus(newStatus: 'pending' | 'in-progress' | 'completed'): void {
    this.taskService.changeTaskStatus(this.task.id, newStatus);
  }

  /**
   * Emite evento de edición
   */
  onEdit(): void {
    this.edit.emit(this.task);
  }

  /**
   * Emite evento de eliminación
   */
  onDelete(): void {
    this.delete.emit(this.task);
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

