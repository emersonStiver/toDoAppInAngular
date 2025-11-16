/**
 * Modelo de Usuario
 * Representa un usuario en el sistema de gestión de tareas
 */
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

