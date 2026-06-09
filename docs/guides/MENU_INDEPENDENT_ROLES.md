# 📋 Menús Independientes por Rol

## ¿Qué es esto?

Cada rol tiene su **propio menú completamente independiente** con items, orden y estructura propios.

## 🎯 Menús disponibles

### 1️⃣ Super Admin

```
- Dashboard
- Administradores
- Entrenadores
- Atletas
- Tutores
- Asignaciones
- Reportes
```

### 2️⃣ Administrador

```
- Dashboard
- Entrenadores
- Atletas
- Tutores
- Asignaciones
```

### 3️⃣ Asistente

```
- Dashboard
- Atletas
- Asignaciones
```

### 4️⃣ Entrenador

```
- Dashboard
- Mis Atletas (ruta diferente)
- Mis Asignaciones (ruta diferente)
- Mi Equipo
```

### 5️⃣ Tutor

```
- Dashboard
- Mis Hijos
- Asignaciones
```

### 6️⃣ Atleta

```
- Dashboard
- Mis Asignaciones
- Mi Progreso
```

## 📁 Estructura de archivos

### `src/components/menuConfig.ts`

Contiene 6 arrays independientes:

- `superAdminMenu` - Menú de Super Admin
- `adminMenu` - Menú de Administrador
- `assistantMenu` - Menú de Asistente
- `coachMenu` - Menú de Entrenador
- `parentMenu` - Menú de Tutor
- `athleteMenu` - Menú de Atleta

### `src/components/Sidenav.tsx`

Lee el menú del rol activo y lo renderiza.

## 🔧 Cómo personalizar un menú

### Agregar un item a un rol específico

En `menuConfig.ts`, encuentra el array del rol y añade un item:

```typescript
export const entrenadorMenu: MenuItem[] = [
  // items existentes...
  {
    id: "my-statistics",
    route: "/my-statistics",
    icon: "fa fa-chart-pie",
    name: "Mis Estadísticas",
  },
];
```

### Cambiar el orden de items

Los items se muestran en el orden que estén en el array:

```typescript
export const adminMenu: MenuItem[] = [
  // Primero aparecerá esto
  {
    id: "priority",
    route: "/priority",
    icon: "fa fa-star",
    name: "Prioritario",
  },
  // Después esto
  {
    id: "coaches",
    route: "/coaches",
    icon: "fa fa-person",
    name: "Entrenadores",
  },
];
```

### Eliminar un item de un rol

Simplemente elimina el objeto del array correspondiente.

### Cambiar nombre o icono de un item

```typescript
{
  id: "athletes",
  route: "/athletes",
  icon: "fa fa-dumbbell", // Cambié el icono
  name: "Deportistas", // Cambié el nombre
}
```

## 📌 Estructura de MenuItem

```typescript
interface MenuItem {
  id: string; // ID único para identificarlo
  route: string; // Ruta donde navega
  icon: string; // Clase de Font Awesome
  name: string; // Texto que se muestra
  subItems?: SubMenuItem[]; // (Opcional) Items anidados
}
```

## 🚀 Flujo de funcionamiento

```
Usuario cambia de rol
    ↓
ActiveRoleContext se actualiza
    ↓
Sidenav re-renderiza
    ↓
useActiveRole() obtiene el rol activo
    ↓
getMenuByRole(rol) retorna el menú específico
    ↓
Se muestran solo los items de ese rol
```

## ✏️ Ejemplo real: Agregar "Mi Reporte" solo para Entrenadores

**Antes:**

```typescript
export const coachMenu: MenuItem[] = [
  {
    id: "dashboard",
    route: "/dashboard",
    icon: "th-large",
    name: "Dashboard",
  },
  {
    id: "my-athletes",
    route: "/my-athletes",
    icon: "fa fa-running",
    name: "Mis Atletas",
  },
  {
    id: "my-assignments",
    route: "/my-assignments",
    icon: "fa fa-tasks",
    name: "Mis Asignaciones",
  },
  {
    id: "my-team",
    route: "/my-team",
    icon: "fa fa-users",
    name: "Mi Equipo",
  },
];
```

**Después:**

```typescript
export const coachMenu: MenuItem[] = [
  {
    id: "dashboard",
    route: "/dashboard",
    icon: "th-large",
    name: "Dashboard",
  },
  {
    id: "my-athletes",
    route: "/my-athletes",
    icon: "fa fa-running",
    name: "Mis Atletas",
  },
  {
    id: "my-assignments",
    route: "/my-assignments",
    icon: "fa fa-tasks",
    name: "Mis Asignaciones",
  },
  {
    id: "my-team",
    route: "/my-team",
    icon: "fa fa-users",
    name: "Mi Equipo",
  },
  // ✨ NUEVO
  {
    id: "my-reports",
    route: "/my-reports",
    icon: "fa fa-file-pdf",
    name: "Mi Reporte",
  },
];
```

## 🎨 Iconos recomendados por tipo

| Tipo              | Icono          | Código             |
| ----------------- | -------------- | ------------------ |
| Dashboard         | Dashboard      | `th-large`         |
| Personas/Usuarios | Usuarios       | `users`            |
| Tareas            | Tareas         | `fa fa-tasks`      |
| Reportes          | Gráfico        | `fa fa-chart-bar`  |
| Mi cuenta         | Usuario        | `user`             |
| Progreso          | Gráfico lineal | `fa fa-chart-line` |
| Niños             | Niño           | `fa fa-child`      |
| Equipo            | Grupo          | `fa fa-users`      |
| Deportistas       | Corredor       | `fa fa-running`    |

Ver más en: https://fontawesome.com/icons
