# 📦 Core - Abstracciones y Lógica Compartida

La carpeta `core` contiene tipos, hooks y utilidades centralizadas que implementan los principios SOLID.

## 📁 Estructura

```
core/
├── types/              # Tipos centralizados (única fuente de verdad)
│   ├── User.ts         # Tipos de usuario
│   ├── Api.ts          # Tipos genéricos de API
│   ├── Error.ts        # Tipos de error y ErrorCode
│   ├── Auth.ts         # Tipos de autenticación
│   └── index.ts        # Exporta todo
│
├── hooks/              # Hooks reutilizables (abstracciones)
│   ├── useAuth.ts      # Acceso a autenticación
│   ├── usePermissions.ts  # Validación de permisos
│   ├── useNotification.ts  # Notificaciones
│   └── index.ts        # Exporta todo
│
└── utils/              # Utilidades (funciones puras)
    ├── error-handlers.ts   # Mapeo centralizado de errores
    ├── helpers.ts          # Funciones helpers (validación, formateo, etc.)
    └── index.ts            # Exporta todo
```

## 🎯 Principios SOLID Aplicados

### Single Responsibility Principle

- `types/User.ts` - Solo define tipos User
- `hooks/useAuth.ts` - Solo maneja autenticación
- `utils/error-handlers.ts` - Solo mapea errores

### Open/Closed Principle

- Tipos son extensibles (agregar más campos a User)
- Hooks retornan interfaces (no implementaciones concretas)
- ErrorCode enum permite nuevos códigos

### Liskov Substitution Principle

- `useAuth` tiene interfaz consistente
- ErrorCode se puede extender sin romper código

### Interface Segregation Principle

- `useAuth` - solo auth (no permisos)
- `usePermissions` - solo permisos (no auth)
- `useNotification` - solo notificaciones

### Dependency Inversion Principle

- Componentes dependen de `core/hooks` (abstracción)
- No dependen de Redux directamente
- No dependen de RTK Query directamente

## 📚 Cómo Usar

### Importar tipos

```typescript
import type { User, PaginatedResponse } from "@/core/types";
```

### Importar hooks

```typescript
import { useAuth, usePermissions } from "@/core/hooks";
```

### Importar utilidades

```typescript
import { handleApiError, isValidEmail, formatDate } from "@/core/utils";
```

## 🔍 Referencias Cruzadas

- **Features** dependen de `core/types` (tipos centralizados)
- **Componentes** usan `core/hooks` (no Redux directo)
- **Error handling** usa `core/utils` (manejo centralizado)

## ✨ Beneficios

| Beneficio                           | Impacto                           |
| ----------------------------------- | --------------------------------- |
| **Tipos centralizados**             | Cambiar User una vez, afecta todo |
| **Hooks reutilizables**             | Menos código duplicado            |
| **Abstracciones claras**            | Fácil testear y refactorizar      |
| **Manejo de errores centralizado**  | Consistencia garantizada          |
| **Separación de responsabilidades** | Código más limpio                 |

## 🚀 Próximos Pasos

Una vez entiendas `core/`, pasa a:

1. **Features** - Cómo estructurar features con Repository Pattern
2. **Shared** - Componentes UI reutilizables
3. **Tests** - Cómo testear código SOLID
