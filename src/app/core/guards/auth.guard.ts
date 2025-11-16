import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Redirige a /register si no hay usuarios, o a /login si hay usuarios pero no hay sesión
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Verificar si hay usuarios en el sistema
  const users = storageService.getUsers();
  
  if (users.length === 0) {
    // No hay usuarios, redirigir a registro
    router.navigate(['/register'], { queryParams: { returnUrl: state.url } });
  } else {
    // Hay usuarios pero no hay sesión, redirigir a login
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  }
  
  return false;
};

