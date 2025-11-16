import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task, TaskPriority } from '../../core/models/task.model';

/**
 * Componente de formulario de tarea
 * Permite crear y editar tareas
 */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit {
  @Input() task?: Task;
  @Input() show: boolean = false;
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;
  priorities: TaskPriority[] = ['low', 'medium', 'high'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario
   */
  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.task?.description || ''],
      dueDate: [this.task?.dueDate ? this.task.dueDate.split('T')[0] : ''],
      priority: [this.task?.priority || 'medium', Validators.required]
    });

    // Validación personalizada para fecha
    this.taskForm.get('dueDate')?.valueChanges.subscribe(value => {
      if (value && value < today) {
        this.taskForm.get('dueDate')?.setErrors({ pastDate: true });
      }
    });
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskData: Partial<Task> = {
        title: formValue.title,
        description: formValue.description || undefined,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString() : undefined,
        priority: formValue.priority
      };

      if (this.task) {
        taskData.id = this.task.id;
      }

      this.save.emit(taskData);
      this.taskForm.reset();
    }
  }

  /**
   * Cancela el formulario
   */
  onCancel(): void {
    this.cancel.emit();
    this.taskForm.reset();
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName === 'title' ? 'Título' : 'Campo'} es requerido`;
    }
    if (field?.hasError('minlength')) {
      return 'El título debe tener al menos 3 caracteres';
    }
    if (field?.hasError('pastDate')) {
      return 'La fecha no puede ser anterior al día actual';
    }
    return '';
  }

  /**
   * Verifica si un campo tiene error
   */
  hasError(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtiene la fecha mínima para el input de fecha (hoy)
   */
  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}

