import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let authService: AuthService;
  let storageService: StorageService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
    authService = TestBed.inject(AuthService);
    storageService = TestBed.inject(StorageService);
    
    // Limpiar y crear usuario de prueba
    storageService.clearAll();
    await authService.register('Test User', 'test@test.com', 'password123');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a task', () => {
    const task = service.createTask(
      'Test Task',
      'Test Description',
      undefined,
      'medium'
    );
    
    expect(task).toBeTruthy();
    expect(task?.title).toBe('Test Task');
    expect(task?.status).toBe('pending');
  });

  it('should get tasks by status', () => {
    service.createTask('Task 1', undefined, undefined, 'low');
    service.createTask('Task 2', undefined, undefined, 'medium');
    
    const pendingTasks = service.getTasksByStatus('pending');
    expect(pendingTasks.length).toBe(2);
  });

  it('should update a task', () => {
    const task = service.createTask('Test Task', 'Description', undefined, 'low');
    expect(task).toBeTruthy();
    
    if (task) {
      task.title = 'Updated Task';
      service.updateTask(task);
      
      const tasks = service.getTasks();
      const updatedTask = tasks.find(t => t.id === task.id);
      expect(updatedTask?.title).toBe('Updated Task');
    }
  });

  it('should delete a task', () => {
    const task = service.createTask('Test Task', undefined, undefined, 'low');
    expect(task).toBeTruthy();
    
    if (task) {
      service.deleteTask(task.id);
      const tasks = service.getTasks();
      expect(tasks.find(t => t.id === task.id)).toBeUndefined();
    }
  });

  it('should change task status', () => {
    const task = service.createTask('Test Task', undefined, undefined, 'low');
    expect(task).toBeTruthy();
    
    if (task) {
      service.changeTaskStatus(task.id, 'in-progress');
      const tasks = service.getTasks();
      const updatedTask = tasks.find(t => t.id === task.id);
      expect(updatedTask?.status).toBe('in-progress');
    }
  });

  it('should filter tasks by text', () => {
    service.createTask('Task One', 'Description one', undefined, 'low');
    service.createTask('Task Two', 'Description two', undefined, 'medium');
    
    const filtered = service.filterTasksByText(service.getTasks(), 'One');
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Task One');
  });

  it('should filter tasks by priority', () => {
    service.createTask('Task 1', undefined, undefined, 'low');
    service.createTask('Task 2', undefined, undefined, 'high');
    service.createTask('Task 3', undefined, undefined, 'high');
    
    const highPriorityTasks = service.filterTasksByPriority(service.getTasks(), 'high');
    expect(highPriorityTasks.length).toBe(2);
  });

  it('should detect overdue tasks', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    const task: Task = {
      id: 'test-id',
      userId: authService.getCurrentUser()?.id || '',
      title: 'Overdue Task',
      priority: 'medium',
      status: 'pending',
      dueDate: pastDate.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    service.updateTask(task);
    expect(service.isTaskOverdue(task)).toBe(true);
  });
});

