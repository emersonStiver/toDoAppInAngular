# 📋 ToDo App - Aplicación de Gestión de Tareas

Aplicación web completa de gestión de tareas desarrollada con Angular 19 y Tailwind CSS 4.1. Incluye autenticación, CRUD completo de tareas, búsqueda, filtrado y ordenamiento.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn

### Instalación

1. Clonar el repositorio (o usar el proyecto existente)
2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
ng serve
# o
npm start
```

4. Abrir el navegador en `http://localhost:4200`

## 📦 Arquitectura del Proyecto

```
src/app/
├── core/
│   ├── models/
│   │   ├── user.model.ts          # Modelo de usuario
│   │   └── task.model.ts          # Modelo de tarea
│   ├── services/
│   │   ├── auth.service.ts        # Autenticación
│   │   ├── task.service.ts        # Gestión de tareas
│   │   ├── storage.service.ts     # localStorage
│   │   ├── notification.service.ts # Notificaciones toast
│   │   └── seed.service.ts        # Datos demo
│   └── guards/
│       └── auth.guard.ts          # Protección de rutas
├── pages/
│   ├── login/                     # Página de login
│   ├── register/                  # Página de registro
│   ├── dashboard/                 # Dashboard principal
│   ├── task-detail/               # Detalle de tarea
│   └── settings/                  # Configuración
├── components/
│   ├── header/                    # Encabezado con búsqueda
│   ├── task-card/                 # Tarjeta de tarea
│   ├── task-form/                 # Formulario de tarea
│   ├── confirm-dialog/            # Diálogo de confirmación
│   ├── search-bar/                # Barra de búsqueda
│   └── toast/                     # Notificaciones
└── shared/
    └── pipes/
        ├── priority.pipe.ts       # Pipe de prioridad
        └── status.pipe.ts         # Pipe de estado
```

## 📊 Modelos de Datos

### User

```typescript
{
  id: string;
  name: string;
  email: string;
  passwordHash: string;  // Hash SHA-256
  createdAt: string;     // ISO string
}
```

### Task

```typescript
{
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;      // ISO string
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;     // ISO string
  updatedAt: string;    // ISO string
}
```

## 💾 Persistencia

La aplicación usa **localStorage** para persistir datos. Las claves utilizadas son:

- `todo_app_users`: Lista de usuarios registrados
- `todo_app_tasks`: Lista de todas las tareas
- `todo_app_session`: Sesión del usuario actual

### Limpiar Datos

Para limpiar todos los datos almacenados:

1. **Desde la aplicación**: Ir a Configuración → Eliminar todos los datos
2. **Desde el navegador**: Abrir DevTools (F12) → Application → Local Storage → Eliminar las claves `todo_app_*`
3. **Desde código**: Ejecutar en la consola del navegador:
   ```javascript
   localStorage.removeItem('todo_app_users');
   localStorage.removeItem('todo_app_tasks');
   localStorage.removeItem('todo_app_session');
   ```

## 🔐 Autenticación

### Registro

Los usuarios pueden registrarse proporcionando:
- Nombre (mínimo 3 caracteres)
- Email (formato válido)
- Contraseña (mínimo 6 caracteres)
- Confirmación de contraseña

Las contraseñas se hashean usando **Web Crypto API** (SHA-256) antes de almacenarse.

### Login

Los usuarios pueden iniciar sesión con su email y contraseña. La sesión se mantiene en localStorage.

### Usuario Demo

Al iniciar la aplicación por primera vez, se crea automáticamente un usuario demo:

- **Email**: `demo@demo.com`
- **Password**: `Demo1234`

Este usuario incluye ~10 tareas de ejemplo con diferentes estados, prioridades y fechas.

## ✨ Funcionalidades

### Gestión de Tareas (CRUD)

- ✅ **Crear tareas**: Formulario modal con validación
- ✅ **Editar tareas**: Actualizar título, descripción, fecha y prioridad
- ✅ **Eliminar tareas**: Con diálogo de confirmación
- ✅ **Cambiar estado**: Pendiente → En progreso → Completada
- ✅ **Marcar como completada**: Botón rápido en cada tarjeta

### Visualización

- 📊 **Dashboard con 3 columnas**: Organizadas por estado (Pendiente, En progreso, Completada)
- 🎨 **Indicadores visuales**: 
  - Tareas vencidas: Borde rojo y etiqueta
  - Prioridades: Colores diferenciados (verde/amarillo/rojo)
- 📱 **Responsive**: Columnas apiladas en móvil

### Búsqueda y Filtrado

- 🔍 **Búsqueda en tiempo real**: Por título y descripción (debounce 300ms)
- 🎯 **Filtro por prioridad**: Baja, Media, Alta, Todas
- 📅 **Ordenamiento**:
  - Por fecha de vencimiento (ascendente/descendente)
  - Por prioridad (ascendente/descendente)

### Validaciones

- ✅ Título requerido (mínimo 3 caracteres)
- ✅ Fecha de vencimiento no puede ser anterior al día actual
- ✅ Email válido en registro/login
- ✅ Contraseñas coinciden en registro

## 🎨 UI/UX

### Diseño

- **Framework**: Tailwind CSS 4.1
- **Colores**: Paleta moderna con gradientes
- **Componentes**: Modales, toasts, diálogos de confirmación
- **Accesibilidad**: Roles ARIA, labels, focus visible

### Componentes Principales

1. **Header**: Búsqueda, botón crear tarea, logout
2. **Task Card**: Información completa, acciones rápidas
3. **Task Form**: Modal para crear/editar tareas
4. **Toast**: Notificaciones no intrusivas
5. **Confirm Dialog**: Confirmación para acciones críticas

## 🧪 Testing

Ejecutar tests unitarios:

```bash
ng test
```

Los tests incluyen:
- `auth.service.spec.ts`: Tests de autenticación
- `task.service.spec.ts`: Tests de gestión de tareas

## 🛠️ Desarrollo

### Comandos Disponibles

```bash
# Servidor de desarrollo
ng serve

# Build de producción
ng build

# Tests
ng test

# Linting
ng lint
```

### Estructura de Servicios

- **AuthService**: Maneja registro, login, logout y sesión
- **TaskService**: CRUD de tareas, filtrado y ordenamiento
- **StorageService**: Abstracción de localStorage
- **NotificationService**: Sistema de notificaciones toast
- **SeedService**: Inicialización de datos demo

## 📝 Notas Técnicas

### Tecnologías

- **Angular 19**: Framework principal (standalone components)
- **Tailwind CSS 4.1**: Estilos y diseño
- **RxJS**: Programación reactiva (Observables, BehaviorSubject)
- **Web Crypto API**: Hash de contraseñas
- **localStorage**: Persistencia de datos

### Características

- ✅ Standalone components (sin módulos)
- ✅ Lazy loading de rutas
- ✅ Guards para protección de rutas
- ✅ Reactive forms con validación
- ✅ Pipes personalizados
- ✅ TypeScript estricto

## 🐛 Solución de Problemas

### Los datos no persisten

Verificar que localStorage esté habilitado en el navegador.

### No puedo iniciar sesión

1. Verificar que el usuario exista
2. Limpiar localStorage y recrear usuario demo
3. Verificar la consola del navegador para errores

### Las tareas no se muestran

1. Verificar que hay un usuario autenticado
2. Verificar que las tareas pertenecen al usuario actual
3. Revisar filtros aplicados

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y personal.

## 👨‍💻 Autor

Desarrollado como aplicación de demostración de Angular con Tailwind CSS.

---

**¡Disfruta gestionando tus tareas!** 🎉
