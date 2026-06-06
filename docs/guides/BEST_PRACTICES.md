# 🎯 Mejores Prácticas y Convenciones de Código

## Objetivo

Mantener principios SOLID y buenas prácticas en todo el código del proyecto

---

## 1. 📁 Estructura de Archivos

### Por Feature (Recomendado)

```
features/
  ├── users/
  │   ├── api.ts                 # RTK Query endpoints (READ-ONLY)
  │   ├── repository.ts          # Interfaz de acceso a datos (DIP)
  │   ├── hooks.ts              # Hooks personalizados (abstracción)
  │   ├── types.ts              # Tipos específicos de feature
  │   ├── validators.ts         # Validadores de negocio
  │   ├── constants.ts          # Constantes (permisos, estados, etc.)
  │   ├── pages/
  │   │   ├── UserPage.tsx     # Página principal
  │   │   ├── UserCreate.tsx   # Página de creación
  │   │   └── UserEdit.tsx     # Página de edición
  │   ├── components/
  │   │   ├── UserTable.tsx    # Tabla de usuarios
  │   │   ├── UserForm.tsx     # Formulario
  │   │   ├── UserModal.tsx    # Modal
  │   │   └── UserCard.tsx     # Tarjeta de usuario
  │   ├── __tests__/
  │   │   ├── api.test.ts
  │   │   ├── repository.test.ts
  │   │   └── hooks.test.ts
  │   └── index.ts             # Exporta públicamente
```

### Estructura de Carpetas Raíz

```
src/
├── core/                       # Lógica compartida y abstracciones
│   ├── types/                 # Tipos centralizados
│   ├── hooks/                 # Hooks reutilizables
│   ├── utils/                 # Utilidades (helpers, formateos, etc.)
│   └── middleware/            # Middleware personalizado
│
├── shared/                     # Componentes UI reutilizables
│   ├── ui/                    # Componentes visuales
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Form/
│   │   └── Layout/
│   └── hooks/                 # Hooks de UI (useForm, usePagination, etc.)
│
├── features/                   # Funcionalidades de negocio
│   ├── auth/
│   ├── users/
│   ├── assignments/
│   └── ...
│
├── app/                        # Configuración de app
│   ├── store.ts               # Redux setup
│   ├── router.tsx             # Rutas
│   └── App.tsx
│
├── auth/                       # Componentes de autenticación
│   ├── ProtectedRoute.tsx
│   ├── GuestRoute.tsx
│   └── AuthContext.tsx        # DEPRECATED
│
├── hooks/                      # Hooks globales (reduxHooks, etc.)
│   └── reduxHooks.ts
│
├── main.tsx
└── vite-env.d.ts
```

---

## 2. 📏 Principios de Nombrado

### Archivos y Directorios

```typescript
// ✅ BIEN
features / users / api.ts; // endpoints
features / users / repository.ts; // abstracción
features / users / hooks.ts; // hooks personalizados
features / users / types.ts; // tipos
features / users / validators.ts; // validadores

// ❌ EVITAR
features / users / User.ts; // Ambiguo
features / users / utils.ts; // Muy genérico
features / users / helpers.ts; // Ambiguo
features / users / service.ts; // Ya existe "api.ts"
```

### Funciones y Hooks

```typescript
// ✅ BIEN - Prefijo "use" para hooks
export const useAuth = () => {};
export const usePermissions = () => {};
export const useNotification = () => {};
export const useUserRepository = () => {};

// ✅ BIEN - Prefijo "get" para getters
export const getUsersFromState = () => {};
export const getErrorMessage = () => {};

// ✅ BIEN - Prefijo "is/has" para booleanos
export const isValidEmail = () => {};
export const hasPermission = () => {};

// ❌ EVITAR
export const getUserData = () => {}; // No es hook (no tiene "use")
export const auth = () => {}; // Confuso, parece variable
export const checkPermission = () => {}; // Usar "has" o "can" mejor
```

### Tipos y Interfaces

```typescript
// ✅ BIEN
export interface User {}
export interface CreateUserInput {}
export interface UpdateUserInput {}
export interface UserRepository {}
export type UserRole = "ADMIN" | "USER";

// ❌ EVITAR
export interface IUser {} // "I" prefix es outdated
export interface UserData {} // Ambiguo
export type User = string | null; // Type para valor simple
export class UserService {} // Usar hooks/functions, no clases
```

### Acciones Redux

```typescript
// ✅ BIEN
export const loginSuccess = createAction(...);
export const loginFailure = createAction(...);
export const setLoading = createAction(...);
export const logout = createAction(...);

// ❌ EVITAR
export const LOGIN_SUCCESS = createAction(...);   // Mayúscula
export const onLoginSuccess = createAction(...);  // Prefijo "on"
export const handleLoginSuccess = createAction(...); // Prefijo "handle"
```

---

## 3. 🏗️ Importes y Dependencias

### Orden de Importes (Convención)

```typescript
// 1. Librerías externas
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 2. Redux/State
import { useAppSelector, useAppDispatch } from "@/hooks/reduxHooks";
import { loginSuccess } from "@/features/auth/authSlice";

// 3. Core (tipos, hooks, utils)
import { useAuth, usePermissions } from "@/core/hooks";
import { handleApiError } from "@/core/utils";
import type { User } from "@/core/types";

// 4. Features (APIs, repositorios)
import { useGetUsersQuery } from "@/features/users/api";
import { useUserRepository } from "@/features/users/repository";

// 5. Componentes compartidos
import { Button, Modal } from "@/shared/ui";

// 6. Componentes locales
import { UserForm } from "./UserForm";
import { UserTable } from "./UserTable";

// 7. Estilos (si existen)
import styles from "./UserPage.module.css";
```

### Importes a Evitar

```typescript
// ❌ EVITAR: Importar de archivos internos de feature
import { loginSuccess } from "@/features/auth/authSlice";
import { userReducer } from "@/features/users/userSlice";
// (Los reducers deben ser internos del store)

// ❌ EVITAR: Rutas relativas profundas
import { Button } from "../../../shared/ui/Button";
// (Usa alias @/shared/ui)

// ❌ EVITAR: Importar archivos deprecated
import { useAuth } from "@/auth/AuthContext"; // Use @/core/hooks
import { api } from "@/services/api"; // Use RTK Query
```

### Alias de Rutas (@/)

```typescript
// En vite.config.ts o tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

// Luego usar:
import { useAuth } from '@/core/hooks';        // ✅
import Button from '@/shared/ui/Button';       // ✅
import UserPage from '@/features/users/pages'; // ✅
```

---

## 4. ✅ Patrones de Código

### Componentes React

```typescript
/**
 * Componente bien estructurado
 *
 * Principios:
 * - SRP: Una responsabilidad
 * - Hooks en orden (useAuth → usePermissions → estado → efectos)
 * - Props mínimas (usar hooks para estado global)
 */

import { FC, useState } from 'react';
import { useAuth, usePermissions } from '@/core/hooks';

interface UserListProps {
  onUserSelect?: (userId: string) => void;
}

export const UserList: FC<UserListProps> = ({ onUserSelect }) => {
  // 1. Hooks primero
  const { user } = useAuth();
  const { isAdmin } = usePermissions();
  const [page, setPage] = useState(1);

  // 2. Condicionales de renderizado
  if (!user) {
    return <div>No estás autenticado</div>;
  }

  // 3. JSX
  return (
    <div>
      {/* Contenido */}
    </div>
  );
};

// 4. Export con displayName para debugging
UserList.displayName = 'UserList';
```

### Hooks Personalizados

```typescript
/**
 * Hook bien estructurado
 *
 * Principios:
 * - DIP: Retorna interfaz, no implementación
 * - Una responsabilidad
 * - Nombrado con "use"
 */

export const useUserForm = (onSuccess?: () => void) => {
  const { success, error } = useNotification();
  const userRepo = useUserRepository();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (data: CreateUserInput) => {
    setIsLoading(true);
    try {
      await userRepo.create(data);
      success("Usuario creado");
      setErrors({});
      onSuccess?.();
    } catch (err) {
      const appError = handleApiError(err);
      setErrors(getValidationErrorMessages(appError));
      error(getUserFriendlyErrorMessage(appError));
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, errors };
};
```

### Validadores

```typescript
/**
 * Validadores de negocio
 *
 * Principios:
 * - Funciones puras (sin efectos secundarios)
 * - Retornan boolean o objeto de error
 * - Reutilizables en componentes y tests
 */

// features/users/validators.ts
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email requerido";
  if (!isValidEmail(email)) return "Email inválido";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Contraseña requerida";
  if (!isStrongPassword(password)) {
    return "Mín. 8 caracteres, mayúscula, número, especial";
  }
  return null;
};

export const validateUserInput = (
  data: CreateUserInput,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if ((emailError = validateEmail(data.email))) {
    errors.email = emailError;
  }

  if ((passwordError = validatePassword(data.password))) {
    errors.password = passwordError;
  }

  return errors;
};

// En componente
const errors = validateUserInput(formData);
if (Object.keys(errors).length > 0) {
  return; // Mostrar errores
}
```

---

## 5. 🧪 Testing

### Estructura de Tests

```typescript
// features/users/__tests__/repository.test.ts

import { renderHook, act } from "@testing-library/react";
import { useUserRepository } from "../repository";

describe("UserRepository", () => {
  it("should fetch users", async () => {
    const { result } = renderHook(() => useUserRepository());

    const users = await act(async () => {
      return await result.current.getAll({ page: 1, limit: 10 });
    });

    expect(users).toHaveLength(10);
  });

  it("should create user", async () => {
    const { result } = renderHook(() => useUserRepository());

    const newUser = await act(async () => {
      return await result.current.create({
        name: "Test",
        lastname: "User",
        email: "test@example.com",
      });
    });

    expect(newUser.id).toBeDefined();
  });
});
```

---

## 6. 📝 Documentación

### Comentarios JSDoc

````typescript
/**
 * Hook para obtener datos del usuario actual autenticado
 *
 * @returns {UseAuthReturn} Objeto con user, token, isAuthenticated, etc.
 *
 * @example
 * ```typescript
 * const { user, isAuthenticated } = useAuth();
 *
 * if (!isAuthenticated) {
 *   return <Navigate to="/login" />;
 * }
 * ```
 *
 * @see https://docs.example.com/auth
 */
export const useAuth = (): UseAuthReturn => {
  // ...
};
````

### README en Features

```markdown
# Feature: Usuarios

## Overview

Gestión completa de usuarios (CRUD)

## Estructura

- `api.ts` - RTK Query endpoints
- `repository.ts` - Interfaz de acceso a datos
- `hooks.ts` - Hooks personalizados
- `types.ts` - Tipos TypeScript
- `validators.ts` - Validadores de negocio

## Uso Básico

\`\`\`typescript
import { useUserRepository } from '@/features/users/repository';

const MyComponent = () => {
const userRepo = useUserRepository();
const users = await userRepo.getAll({ page: 1 });
};
\`\`\`

## Principios SOLID Aplicados

- **S**RP: Cada archivo una responsabilidad
- **O**CP: Extensible con nuevos roles/permisos
- **L**SP: Interfaz consistente
- **I**SP: Hooks segregados por responsabilidad
- **D**IP: Depende de repositorio, no de RTK Query
```

---

## 7. 🚀 Checklist de Code Review

Antes de hacer merge:

- [ ] Código sigue estructura de carpetas
- [ ] Importes usan alias @/
- [ ] Nuevas features tienen `repository.ts`
- [ ] Types centralizados en `core/types` o feature `types.ts`
- [ ] No hay localStorage manual (usar redux-persist)
- [ ] Errores manejados con `handleApiError`
- [ ] Componentes usan hooks, no RTK Query directo
- [ ] RTK Query solo en `api.ts`
- [ ] Notificaciones usan `useNotification`
- [ ] Sin `AuthContext`, usa `useAuth`
- [ ] Permisos validados con `usePermissions`
- [ ] Código comentado con JSDoc
- [ ] Tests básicos incluidos
- [ ] Sin console.log en producción

---

## 8. 📞 Ayuda y Referencias

- **¿Duda sobre SOLID?** → Revisa `SOLID_GUIDE.md`
- **¿Cómo usar hooks?** → Revisa `IMPLEMENTATION_GUIDE.md`
- **¿Ejemplo de feature?** → Mira `features/users/`
- **¿Tipos disponibles?** → Revisa `core/types/`
- **¿Error no resuelto?** → Usa `handleApiError`
