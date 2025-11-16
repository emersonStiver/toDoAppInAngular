import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    storageService = TestBed.inject(StorageService);
    
    // Limpiar localStorage antes de cada test
    storageService.clearAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', async () => {
    const result = await service.register('Test User', 'test@test.com', 'password123');
    expect(result.success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should not register duplicate email', async () => {
    await service.register('Test User', 'test@test.com', 'password123');
    service.logout();
    
    const result = await service.register('Another User', 'test@test.com', 'password456');
    expect(result.success).toBe(false);
    expect(result.message).toContain('ya está registrado');
  });

  it('should login with correct credentials', async () => {
    await service.register('Test User', 'test@test.com', 'password123');
    service.logout();
    
    const result = await service.login('test@test.com', 'password123');
    expect(result.success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should not login with incorrect credentials', async () => {
    await service.register('Test User', 'test@test.com', 'password123');
    service.logout();
    
    const result = await service.login('test@test.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should logout user', async () => {
    await service.register('Test User', 'test@test.com', 'password123');
    expect(service.isAuthenticated()).toBe(true);
    
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should restore session on initialization', async () => {
    await service.register('Test User', 'test@test.com', 'password123');
    const userId = service.getCurrentUser()?.id;
    
    // Crear nuevo servicio (simula reinicio de app)
    const newService = new AuthService(storageService);
    expect(newService.isAuthenticated()).toBe(true);
    expect(newService.getCurrentUser()?.id).toBe(userId);
  });
});

