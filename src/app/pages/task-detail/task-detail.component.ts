import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { PriorityPipe } from '../../shared/pipes/priority.pipe';
import { StatusPipe } from '../../shared/pipes/status.pipe';

/**
 * Componente de detalle de tarea
 * Muestra la información completa de una tarea
 */
@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PriorityPipe, StatusPipe],
  templateUrl: './task-detail.component.html',
})
export class TaskDetailComponent implements OnInit {
  task?: Task;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      const tasks = this.taskService.getTasks();
      this.task = tasks.find(t => t.id === taskId);
      
      if (!this.task) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isOverdue(): boolean {
    return this.task ? this.taskService.isTaskOverdue(this.task) : false;
  }
}

