import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../core/models/task.model';

/**
 * Pipe para formatear la prioridad de una tarea
 * Convierte 'low' | 'medium' | 'high' a texto legible en español
 */
@Pipe({
  name: 'priority',
  standalone: true
})
export class PriorityPipe implements PipeTransform {
  transform(value: TaskPriority): string {
    const translations: Record<TaskPriority, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta'
    };
    return translations[value] || value;
  }
}

