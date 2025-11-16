import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../../core/models/task.model';

/**
 * Pipe para formatear el estado de una tarea
 * Convierte 'pending' | 'in-progress' | 'completed' a texto legible en español
 */
@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {
  transform(value: TaskStatus): string {
    const translations: Record<TaskStatus, string> = {
      'pending': 'Pendiente',
      'in-progress': 'En progreso',
      'completed': 'Completada'
    };
    return translations[value] || value;
  }
}

