# 🏗️ GUÍA SOLID PARA CLUBS-SAAS-FRONTEND

## 📋 Índice

1. [Principios SOLID](#principios-solid)
2. [Violaciones Actuales](#violaciones-actuales)
3. [Arquitectura Refactorizada](#arquitectura-refactorizada)
4. [Patrones Recomendados](#patrones-recomendados)
5. [Checklist de Implementación](#checklist)

---

## 1. 🎯 Principios SOLID (Aplicados a React/TypeScript)

### **S - Single Responsibility Principle (SRP)**

> Cada módulo debe tener una sola razón para cambiar

**❌ VIOLACIÓN ACTUAL:**

```typescript
// UserPage.tsx - Hace TODO
// - Renderiza tabla
// - Maneja paginación
// - Maneja modales
// - Valida permisos
// - Prepara data
```

**✅ CORRECTO:**

```typescript
// UserPage.tsx solo renderiza UI
// → useUsers hook (obtiene data)
// → useUserModal hook (control de modal)
// → useUserPermissions hook (validación)
// → <UserTable /> (tabla)
// → <UserModal /> (modal)
```

**Aplicación en tu proyecto:**

- **Componentes**: Renderizar UI
- **Hooks personalizados**: Lógica de negocio y estado
- **APIs**: Comunicación con servidor
- **Utils**: Funciones puras y helpers

---

### **O - Open/Closed Principle (OCP)**

> Abierto para extensión, cerrado para modificación

**❌ VIOLACIÓN ACTUAL:**

```typescript
// Modal.tsx hardcodeado para certas acciones
export const Modal = ({ title, onSubmit, fields }) => {
  // Solo soporta ciertos tipos de campos
  return (
    <>
      {fields.map(f => {
        if (f.type === 'text') return <InputForm />;
        if (f.type === 'select') return <MenuSingleOption />;
        if (f.type === 'date') return <div>NOT IMPLEMENTED</div>;
      })}
    </>
  );
};
```

**✅ CORRECTO:**

```typescript
// Plugin system - extensible sin modificar Modal
const fieldRenderers = {
  'text': TextFieldRenderer,
  'select': SelectFieldRenderer,
  'date': DateFieldRenderer,
  'checkbox': CheckboxFieldRenderer,
  // Usuario puede agregar más sin modificar Modal.tsx
};

export const Modal = ({ title, onSubmit, fields }) => {
  return (
    <>
      {fields.map(f => {
        const Renderer = fieldRenderers[f.type] || TextFieldRenderer;
        return <Renderer key={f.name} {...f} />;
      })}
    </>
  );
};
```

**Aplicación en tu proyecto:**

- Usar props como "plugin" en lugar de hardcode
- Crear registros de componentes extensibles
- Estrategia de componentes con composición

---

### **L - Liskov Substitution Principle (LSP)**

> Subclases deben poder usarse donde se usan las clases base

**❌ VIOLACIÓN ACTUAL:**

```typescript
// ProtectedRoute vs GuestRoute - interfaces inconsistentes
export const ProtectedRoute = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  // Usa Redux
};

export const GuestRoute = () => {
  const { isAuthenticated } = useAuth();
  // Usa AuthContext (dummy)
  // ¡NO son intercambiables!
};
```

**✅ CORRECTO:**

```typescript
// Ambos usan la misma interfaz (Redux)
export const ProtectedRoute = () => {
  const isAuth = useAppSelector(state => state.auth.isAuthenticated);
  if (!isAuth) return <Navigate to="/login" />;
  return <Outlet />;
};

export const GuestRoute = () => {
  const isAuth = useAppSelector(state => state.auth.isAuthenticated);
  if (isAuth) return <Navigate to="/dashboard" />;
  return <Outlet />;
};

// Ambas rutas pueden reemplazarse sin problema
```

**Aplicación en tu proyecto:**

- Eliminar AuthContext, usar Redux everywhere
- Interfaces consistentes en hooks personalizados
- No mezclar patrones (redux-persist + localStorage manual)

---

### **I - Interface Segregation Principle (ISP)**

> Muchas interfaces específicas mejor que una genérica

**❌ VIOLACIÓN ACTUAL:**

```typescript
// api.ts - Un interceptor giant para todo
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Maneja logout, refresh token, todo mezclado
    }
  },
);

// Componentes usan api.get(), api.post() directamente
// RTK Query también lo usa
// ¡Duplicación de lógica!
```

**✅ CORRECTO:**

```typescript
// Segregar por interfaces específicas

// 1. Hook de autenticación
export const useAuth = () => {
  const { user, isAuthenticated } = useAppSelector(s => s.auth);
  const logout = () => { /* ... */ };
  return { user, isAuthenticated, logout };
};

// 2. Hook de permisos
export const usePermissions = () => {
  const user = useAppSelector(s => s.auth.user);
  const can = (permission: string) => user?.permissions.includes(permission);
  return { can };
};

// 3. Hook de notificaciones
export const useNotification = () => {
  const dispatch = useAppDispatch();
  const notify = (message, type) => dispatch(addNotification({ ... }));
  return { notify };
};

// Componentes solo usan lo que necesitan
const UserModal = () => {
  const { notify } = useNotification();
  const { user } = useAuth();
  const { can } = usePermissions();
};
```

**Aplicación en tu proyecto:**

- Hooks pequeños y específicos
- RTK Query como única fuente de datos
- Remover axios duplicado
- Segregar auth, permissions, notifications

---

### **D - Dependency Inversion Principle (DIP)**

> Depender de abstracciones, no de implementaciones concretas

**❌ VIOLACIÓN ACTUAL:**

```typescript
// UserPage.tsx depende de implementación concreta
import { useGetUsersQuery } from "../features/users/userApi";

export const UserPage = () => {
  const { data } = useGetUsersQuery({ page: 1 });
  // Si cambias de API (e.g., GraphQL), reescribes todo
};
```

**✅ CORRECTO:**

```typescript
// Definir abstracta (interfaz)
export interface UserRepository {
  getUsers(params: PaginationParams): Promise<PaginatedResponse<User>>;
  createUser(input: CreateUserInput): Promise<User>;
  updateUser(id: string, input: UpdateUserInput): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

// Implementación concreta (RTK Query)
export const useUserRepository = (): UserRepository => {
  const queryResult = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  // Retorna la abstracta
  return {
    getUsers: async (params) => {
      /* usar RTK Query */
    },
    createUser: async (input) => {
      /* usar RTK Query */
    },
  };
};

// Componentes dependen de la abstracta
export const UserPage = () => {
  const userRepo = useUserRepository();
  const users = userRepo.getUsers({ page: 1 });
  // Si cambias implementación (RTK → REST → GraphQL), UserPage no cambia
};
```

**Aplicación en tu proyecto:**

- Crear interfaces `*Repository` para cada feature
- RTK Query es implementación, no la interfaz
- Hooks personalizados exponen la interfaz
- Componentes dependen de hooks, no de RTK Query

---

## 2. ⚠️ Violaciones SOLID Actuales

### **SRP Violations**

| Archivo           | Responsabilidades                                  | Solución                                 |
| ----------------- | -------------------------------------------------- | ---------------------------------------- |
| `UserPage.tsx`    | Render + Data Fetch + Modal Control + Validation   | Separar en 3 hooks + componentes         |
| `authSlice.ts`    | Redux state + localStorage sync + token storage    | Remover localStorage, usar redux-persist |
| `Modal.tsx`       | Render modal + field type routing + jQuery binding | Plugin system para field types           |
| `services/api.ts` | Axios instance + interceptor + error handling      | Remover, todo en RTK Query               |

### **OCP Violations**

| Componente    | Problema                      | Solución                        |
| ------------- | ----------------------------- | ------------------------------- |
| `Modal.tsx`   | Hardcoded field types         | Field renderer registry         |
| `Sidenav.tsx` | Menu items hardcoded          | Configuration-driven menu       |
| Field inputs  | No soportan custom validators | Custom hook + validation schema |

### **LSP Violations**

| Componente                       | Problema                                         | Solución                    |
| -------------------------------- | ------------------------------------------------ | --------------------------- |
| `ProtectedRoute` vs `GuestRoute` | Different implementations (Redux vs AuthContext) | Unified auth source         |
| `*Api.ts` files                  | Inconsistent response handling                   | Unified response wrapper    |
| Hooks personalizados             | Inconsistent return types                        | Standardized hook interface |

### **ISP Violations**

| Patrón            | Problema                 | Solución                     |
| ----------------- | ------------------------ | ---------------------------- |
| `api.interceptor` | Maneja todo en un lugar  | Segregar por responsabilidad |
| Hooks gigantes    | Muchas responsabilidades | Hooks pequeños + composición |
| RTK Query + axios | Doble código             | RTK Query únicamente         |

### **DIP Violations**

| Componente                            | Problema             | Solución                        |
| ------------------------------------- | -------------------- | ------------------------------- |
| `UserPage` imports `useGetUsersQuery` | Depende de RTK Query | Depender de `useUserRepository` |
| `Modal` imports `RTK queries`         | Tight coupling       | Pasar callbacks como props      |
| `authSlice` imports `localStorage`    | Acoplado a storage   | Usar redux-persist abstraction  |

---

## 3. 🏛️ Arquitectura Refactorizada

### **Nueva Estructura de Carpetas**

```
src/
├── core/                          # Core functionality (nuevo)
│   ├── services/
│   │   ├── apiClient.ts           # RTK Query base setup
│   │   └── authService.ts         # Auth business logic
│   ├── hooks/
│   │   ├── useAuth.ts             # Unified auth hook
│   │   ├── usePermissions.ts       # Role-based access
│   │   └── useNotification.ts      # Toast/alerts
│   ├── types/
│   │   ├── User.ts                # Centralized types
│   │   ├── Error.ts               # Error types
│   │   └── Api.ts                 # Generic API types
│   ├── utils/
│   │   ├── validators.ts          # Form validators
│   │   ├── formatters.ts          # Data formatters
│   │   └── error-handlers.ts      # Error mappers
│   └── middleware/
│       ├── errorHandler.ts        # RTK Query error middleware
│       └── authMiddleware.ts      # Token refresh logic
│
├── shared/                        # Shared components (renombrar from components)
│   ├── ui/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── Button.test.tsx
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   ├── FieldRenderer.tsx  # Plugin registry
│   │   │   └── Modal.test.tsx
│   │   ├── FormFields/
│   │   │   ├── TextInput/
│   │   │   ├── SelectInput/
│   │   │   ├── CheckboxInput/
│   │   │   └── DateInput/
│   │   └── Layout/
│   │       ├── Sidebar/
│   │       ├── Header/
│   │       └── Footer/
│   └── hooks/
│       ├── useForm.ts
│       ├── usePagination.ts
│       └── useModal.ts
│
├── features/                      # Business logic by feature
│   ├── auth/
│   │   ├── api.ts                 # RTK Query endpoints
│   │   ├── slice.ts               # Redux state (REMOVED: localStorage)
│   │   ├── hooks.ts               # Abstraction layer
│   │   ├── types.ts               # Feature types
│   │   ├── types.test.ts
│   │   └── pages/
│   │       └── LoginPage/
│   │           ├── LoginPage.tsx
│   │           ├── LoginForm.tsx
│   │           └── LoginPage.test.tsx
│   │
│   ├── users/
│   │   ├── api.ts                 # RTK Query endpoints
│   │   ├── hooks.ts               # useUsers, useCreateUser, etc.
│   │   ├── repository.ts           # Abstraction layer (NEW)
│   │   ├── types.ts               # Feature types
│   │   ├── constants.ts           # Feature constants
│   │   ├── validators.ts          # Business validators
│   │   ├── pages/
│   │   │   └── UserPage/
│   │   │       ├── UserPage.tsx
│   │   │       ├── UserTable.tsx  # Separated component
│   │   │       ├── UserFilters.tsx# Separated component
│   │   │       └── UserPage.test.tsx
│   │   └── components/
│   │       ├── UserModal/
│   │       │   ├── UserModal.tsx
│   │       │   ├── UserForm.tsx   # Form logic separated
│   │       │   └── UserModal.test.tsx
│   │       └── UserCard.tsx       # Reusable user component
│   │
│   └── assignments/
│       ├── api.ts
│       ├── hooks.ts
│       ├── repository.ts
│       ├── types.ts
│       ├── validators.ts
│       ├── pages/
│       │   └── AssignmentPage/
│       │       ├── AssignmentPage.tsx
│       │       └── AssignmentPage.test.tsx
│       └── components/
│           └── AssignmentModal/
│
├── app/
│   ├── store.ts                   # Redux setup
│   ├── router.tsx                 # React Router config
│   ├── App.tsx
│   └── App.test.tsx
│
└── main.tsx
```

---

## 4. 📚 Patrones Recomendados

### **Patrón 1: Repository Pattern (DIP)**

```typescript
// features/users/repository.ts
export interface IUserRepository {
  getAll(params: PaginationParams): Promise<PaginatedResponse<User>>;
  getById(id: string): Promise<User>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}

export const useUserRepository = (): IUserRepository => {
  const query = useGetUsersQuery;
  const [create] = useCreateUserMutation();
  const [update] = useUpdateUserMutation();
  const [delete_] = useDeleteUserMutation();

  return {
    getAll: async (params) => {
      /* RTK Query implementation */
    },
    getById: async (id) => {
      /* RTK Query implementation */
    },
    create: async (input) => {
      /* RTK Query implementation */
    },
    update: async (id, input) => {
      /* RTK Query implementation */
    },
    delete: async (id) => {
      /* RTK Query implementation */
    },
  };
};

// Componente depende de interfaz, no implementación
export const UserPage = () => {
  const userRepo = useUserRepository();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userRepo.getAll({ page: 1, limit: 10 }).then(setUsers);
  }, []);
};
```

### **Patrón 2: Plugin Registry (OCP)**

```typescript
// shared/ui/Modal/fieldRenderers.ts
export interface FieldRendererConfig {
  type: string;
  component: React.ComponentType<any>;
  validator?: (value: any) => string | null;
}

const renderers: Map<string, FieldRendererConfig> = new Map([
  ["text", { type: "text", component: TextInput }],
  ["email", { type: "email", component: EmailInput }],
  ["select", { type: "select", component: SelectInput }],
  ["date", { type: "date", component: DateInput }],
]);

export const registerFieldRenderer = (config: FieldRendererConfig) => {
  renderers.set(config.type, config);
};

export const getFieldRenderer = (type: string) => {
  return renderers.get(type) || renderers.get("text");
};

// Extensible sin modificar Modal.tsx
registerFieldRenderer({
  type: "currency",
  component: CurrencyInput,
  validator: validateCurrency,
});
```

### **Patrón 3: Unified Error Handling (SRP)**

```typescript
// core/utils/error-handlers.ts
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof RTKQueryError) {
    return {
      code: error.data.code,
      message: error.data.message,
      statusCode: error.status,
    };
  }
  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred",
    statusCode: 500,
  };
};

// En componentes
try {
  await userRepo.create(data);
} catch (error) {
  const apiError = handleApiError(error);
  notify.error(apiError.message);
}
```

### **Patrón 4: Composition Over Inheritance**

```typescript
// ❌ EVITAR: Class inheritance
class BaseHook {
  protected loading = false;
  protected error = null;
  handleError = (e) => {
    /* */
  };
}

class UseUsers extends BaseHook {
  getUsers = async () => {
    /* */
  };
}

// ✅ PREFERIR: Composición de hooks
export const useAsync = <T>(asyncFn: () => Promise<T>) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  });
  const execute = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await asyncFn();
      setState({ loading: false, error: null, data });
    } catch (error) {
      setState({ loading: false, error, data: null });
    }
  }, [asyncFn]);
  return { ...state, execute };
};

export const useUsers = () => {
  const userRepo = useUserRepository();
  const state = useAsync(() => userRepo.getAll());
  return { ...state };
};
```

---

## 5. ✅ Checklist de Implementación

### **FASE 1: Fundamentos (1-2 días)**

- [ ] Centralizar tipos en `core/types/`
- [ ] Unificar autenticación (remover AuthContext)
- [ ] Eliminar axios duplicado
- [ ] Configurar redux-persist correctamente
- [ ] Crear core hooks (`useAuth`, `usePermissions`)

### **FASE 2: Arquitectura (2-3 días)**

- [ ] Crear carpeta `core/` con servicios
- [ ] Implementar Repository Pattern en features
- [ ] Refactorizar Modal con plugin system
- [ ] Crear shared/ui con componentes modulares
- [ ] Implementar error handling centralizado

### **FASE 3: Features (3-5 días)**

- [ ] Refactorizar UserPage (SRP)
- [ ] Refactorizar AssignmentPage (SRP)
- [ ] Mejorar formularios (validación centralizada)
- [ ] Implementar validación de roles
- [ ] Mejorar DashboardPage

### **FASE 4: Polish (1-2 días)**

- [ ] Agregar tests unitarios
- [ ] Documentar componentes
- [ ] Performance optimization
- [ ] Linting rules

---

## 6. 🚀 Próximos Pasos

1. **Lee este documento** - Entiende cada principio
2. **Comienza con FASE 1** - Sienta la base
3. **Implementa ejemplos** - Aplica los patrones
4. **Refactoriza gradualmente** - No todo de una vez
5. **Documenta cambios** - Mantén README actualizado

**Tiempo estimado total:** 10-15 días (trabajando 4-5 horas/día)

---

## 📚 Referencias

- SOLID Principles: https://en.wikipedia.org/wiki/SOLID
- Redux Toolkit: https://redux-toolkit.js.org/
- RTK Query: https://redux-toolkit.js.org/rtk-query/overview
- React Patterns: https://react-patterns.com/
