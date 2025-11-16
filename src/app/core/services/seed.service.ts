import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { TaskService } from './task.service';
import { User } from '../models/user.model';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';

/**
 * Servicio para inicializar datos demo/semilla
 * Crea un usuario demo y tareas de ejemplo
 */
@Injectable({
  providedIn: 'root'
})
export class SeedService {
  private readonly DEMO_EMAIL = 'demo@demo.com';
  private readonly DEMO_PASSWORD = 'Demo1234';

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  /**
   * Inicializa los datos demo si no existen
   */
  async initializeDemoData(): Promise<void> {
    const users = this.storageService.getUsers();
    
    // Verificar si ya existe el usuario demo
    const demoUserExists = users.some(u => u.email === this.DEMO_EMAIL);
    
    if (!demoUserExists) {
      await this.createDemoUser();
      await this.createDemoTasks();
    }
  }

  /**
   * Crea el usuario demo
   */
  private async createDemoUser(): Promise<void> {
    const result = await this.authService.register(
      'Usuario Demo',
      this.DEMO_EMAIL,
      this.DEMO_PASSWORD
    );

    if (!result.success) {
      console.error('Error al crear usuario demo:', result.message);
    }
  }

  /**
   * Crea tareas demo
   */
  private async createDemoTasks(): Promise<void> {
    const users = this.storageService.getUsers();
    const demoUser = users.find(u => u.email === this.DEMO_EMAIL);
    
    if (!demoUser) {
      console.error('Usuario demo no encontrado');
      return;
    }

    const now = new Date();
    const tasks: Partial<Task>[] = [
      {
        title: 'Revisar documentación del proyecto',
        description: 'Revisar la documentación técnica y actualizar si es necesario',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() // +2 días
      },
      {
        title: 'Preparar presentación para el cliente',
        description: 'Crear slides y preparar demo del producto',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() // +5 días
      },
      {
        title: 'Actualizar dependencias del proyecto',
        description: 'Revisar y actualizar las dependencias de npm',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() // +7 días
      },
      {
        title: 'Escribir tests unitarios',
        description: 'Aumentar la cobertura de tests al 80%',
        priority: 'medium',
        status: 'in-progress',
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString() // +10 días
      },
      {
        title: 'Revisar código de compañeros',
        description: 'Revisar pull requests pendientes',
        priority: 'low',
        status: 'pending',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() // +3 días
      },
      {
        title: 'Organizar reunión de equipo',
        description: 'Coordinar horarios y preparar agenda',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() // -2 días (pasada)
      },
      {
        title: 'Optimizar consultas de base de datos',
        description: 'Revisar y optimizar queries lentas',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() // -1 día (vencida)
      },
      {
        title: 'Configurar CI/CD pipeline',
        description: 'Configurar integración continua y despliegue automático',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() // -5 días (pasada)
      },
      {
        title: 'Crear documentación de API',
        description: 'Documentar endpoints y ejemplos de uso',
        priority: 'low',
        status: 'pending',
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString() // +14 días
      },
      {
        title: 'Implementar sistema de notificaciones',
        description: 'Agregar notificaciones push para eventos importantes',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString() // +6 días
      }
    ];

    // Crear las tareas
    for (const taskData of tasks) {
      const task: Task = {
        id: this.generateId(),
        userId: demoUser.id,
        title: taskData.title!,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority!,
        status: taskData.status!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.storageService.saveTask(task);
    }
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

