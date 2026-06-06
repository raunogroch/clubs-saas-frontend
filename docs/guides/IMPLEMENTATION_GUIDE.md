# 📦 Guía Práctica: Cómo Usar los Nuevos Hooks y Patrones

## 1. 🔐 Autenticación - Hook `useAuth`

### Uso básico

```typescript
import { useAuth } from '@/core/hooks';

export const MyComponent = () => {
  const { user, isAuthenticated, token, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>No estás autenticado</div>;
  }

  return (
    <div>
      <p>Bienvenido, {user?.name}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};
```

### En páginas protegidas

```typescript
import { useAuth } from '@/core/hooks';
import { Navigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Dashboard />;
};
```

---

## 2. 🛡️ Permisos y Roles - Hook `usePermissions`

### Validación de roles

```typescript
import { usePermissions } from '@/core/hooks';

export const UserManagement = () => {
  const { isAdmin, hasRole, can } = usePermissions();

  return (
    <div>
      {isAdmin() && <AdminPanel />}

      {hasRole('MODERATOR') && <ModerationTools />}

      {can('delete:users') && <DeleteButton />}
    </div>
  );
};
```

### Validación múltiple

```typescript
const { hasAnyRole, hasAllRoles } = usePermissions();

// Mostrar si es ADMIN O MODERATOR
if (hasAnyRole(['ADMIN', 'MODERATOR'])) {
  return <AdminSection />;
}

// Mostrar solo si es ADMIN Y tiene permisos especiales
if (hasAllRoles(['ADMIN', 'SUPER_ADMIN'])) {
  return <SuperAdminPanel />;
}
```

---

## 3. 🔔 Notificaciones - Hook `useNotification`

```typescript
import { useNotification } from '@/core/hooks';

export const UserForm = () => {
  const { success, error, warning, info } = useNotification();

  const handleSubmit = async (data) => {
    try {
      await createUser(data);
      success('Usuario creado correctamente');
      // RTK Query invalidará el cache automáticamente
    } catch (err) {
      error('Error al crear usuario');
    }
  };

  return <form onSubmit={handleSubmit}>{/* */}</form>;
};
```

---

## 4. 📊 Manejo de Errores - Utilidades `error-handlers`

### En componentes

```typescript
import { handleApiError, getUserFriendlyErrorMessage } from "@/core/utils";

export const MyComponent = () => {
  const [, executeAsync] = useAsync(async () => {
    try {
      return await userRepo.getUsers();
    } catch (error) {
      const appError = handleApiError(error);
      const message = getUserFriendlyErrorMessage(appError);
      notify.error(message);
      throw appError;
    }
  });
};
```

### Errores de validación en formularios

```typescript
import { getValidationErrorMessages } from "@/core/utils";

export const UserForm = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (data) => {
    try {
      await createUser(data);
    } catch (error) {
      const appError = handleApiError(error);
      if (appError.code === "VALIDATION_ERROR") {
        setValidationErrors(getValidationErrorMessages(appError));
      }
    }
  };
};
```

---

## 5. 🏗️ Patrón Repository - Abstracción de datos

### Crear repositorio para nueva feature

```typescript
// features/posts/repository.ts
import { useGetPostsQuery, useCreatePostMutation } from "./api";

export interface IPostRepository {
  getAll(params: PaginationParams): Promise<PaginatedResponse<Post>>;
  create(input: CreatePostInput): Promise<Post>;
}

export const usePostRepository = (): IPostRepository => {
  const queryResult = useGetPostsQuery;
  const [createMutation] = useCreatePostMutation();

  return {
    getAll: async (params) => {
      // Implementar con RTK Query
    },
    create: async (input) => {
      // Implementar con RTK Query
    },
  };
};
```

### Usar repositorio en componente

```typescript
// features/posts/pages/PostPage.tsx
import { usePostRepository } from '../repository';

export const PostPage = () => {
  const postRepo = usePostRepository();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    postRepo.getAll({ page: 1, limit: 10 })
      .then(setPosts)
      .catch(err => notify.error('Error al cargar posts'));
  }, []);

  return (
    <div>
      {posts.map(post => <PostCard key={post.id} {...post} />)}
    </div>
  );
};
```

---

## 6. 🔌 Plugin System - Componentes extensibles

### Registrar renderer personalizado

```typescript
import { registerFieldRenderer } from '@/shared/ui/Modal/fieldRenderers';

// En un archivo de configuración o módulo
registerFieldRenderer({
  type: 'signature',
  component: SignatureField,
  validator: validateSignature,
});

// Ahora Modal puede renderizar campos de firma
export const MyModal = () => {
  const fields = [
    { name: 'sig', type: 'signature' }, // ✅ Funciona
  ];
  return <Modal fields={fields} />;
};
```

---

## 7. ✅ Helpers y Utilidades

### Validación

```typescript
import { isValidEmail, isStrongPassword } from "@/core/utils";

if (!isValidEmail(email)) {
  setError("Email inválido");
}

if (!isStrongPassword(password)) {
  setError("Contraseña débil (mín. 8 chars, mayús, número, especial)");
}
```

### Formateo de datos

```typescript
import { formatDate, capitalize, truncate } from "@/core/utils";

const createdAt = formatDate("2024-01-15T10:30:00"); // 15/1/2024
const title = capitalize("hello world"); // Hello world
const summary = truncate("Very long text...", 20); // Very long te...
```

### Arrays

```typescript
import { groupBy, uniqueArray, arraysEqual } from "@/core/utils";

const byRole = groupBy(users, "role"); // { ADMIN: [...], USER: [...] }
const unique = uniqueArray([1, 2, 2, 3, 3, 4]); // [1, 2, 3, 4]
const same = arraysEqual([1, 2], [1, 2]); // true
```

---

## 8. 🎯 Checklist para Nuevas Features

Cuando crees una nueva feature, sigue este patrón:

```
features/myfeature/
├── api.ts                 # RTK Query endpoints
├── repository.ts          # Abstracción (DIP)
├── hooks.ts              # Hooks personalizados
├── types.ts              # Tipos de feature
├── validators.ts         # Validadores de negocio
├── constants.ts          # Constantes
├── pages/
│   └── MyFeaturePage.tsx
├── components/
│   ├── MyFeatureModal.tsx
│   ├── MyFeatureTable.tsx
│   └── MyFeatureCard.tsx
└── __tests__/
    ├── api.test.ts
    ├── repository.test.ts
    └── hooks.test.ts
```

### Ejemplo completo

```typescript
// features/invoice/repository.ts
export const useInvoiceRepository = (): IInvoiceRepository => {
  return {
    getAll: async (params) => useGetInvoicesQuery(params),
    getById: async (id) => useGetInvoiceQuery(id),
    create: async (input) => useCreateInvoiceMutation(input),
  };
};

// features/invoice/pages/InvoicePage.tsx
export const InvoicePage = () => {
  const invoiceRepo = useInvoiceRepository();
  const { isAdmin } = usePermissions();
  const { error } = useNotification();

  // Componente no depende de RTK Query, solo del repositorio
};

// features/invoice/components/InvoiceModal.tsx
export const InvoiceModal = () => {
  const invoiceRepo = useInvoiceRepository();
  const { success, error } = useNotification();

  const handleCreate = async (data) => {
    try {
      await invoiceRepo.create(data);
      success("Factura creada");
    } catch (err) {
      const appErr = handleApiError(err);
      error(getUserFriendlyErrorMessage(appErr));
    }
  };
};
```

---

## 9. 🚫 Anti-patrones a evitar

### ❌ NO hacer esto

```typescript
// ❌ EVITAR: Componente depende de RTK Query directamente
import { useGetUsersQuery } from "@/features/users/api";

export const UserList = () => {
  const { data, isLoading } = useGetUsersQuery(); // Tight coupling
};

// ❌ EVITAR: localStorage manual
const token = localStorage.getItem("auth_token"); // Ya está en Redux

// ❌ EVITAR: Mezclar autenticación de múltiples fuentes
const { isAuthenticated } = useAuth(); // Redux
const { isAuth } = useAuthContext(); // Deprecated
// ^ Inconsistencia

// ❌ EVITAR: Errores no manejados
const { data } = useGetUsersQuery(); // Si falla, sin notificación

// ❌ EVITAR: Componentes con demasiadas responsabilidades
export const UserPage = () => {
  // Fetch, render, paginación, modal, validación, todo aquí
};
```

### ✅ Hacer esto en su lugar

```typescript
// ✅ MEJOR: Componente usa hook personalizado
import { useUsers } from '@/features/users/hooks';

export const UserList = () => {
  const { users, isLoading } = useUsers(); // Loose coupling
};

// ✅ MEJOR: Redux maneja persistencia
// (redux-persist automáticamente sincroniza con localStorage)

// ✅ MEJOR: Una sola fuente de verdad
const { isAuthenticated } = useAuth(); // Siempre Redux

// ✅ MEJOR: Manejo centralizado
try {
  await userRepo.create(data);
  success('Usuario creado');
} catch (error) {
  const appErr = handleApiError(error);
  error(getUserFriendlyErrorMessage(appErr));
}

// ✅ MEJOR: Separar responsabilidades
export const UserPage = () => {
  return (
    <>
      <UserFilters />
      <UserTable />
      <UserPagination />
    </>
  );
};
```

---

## 10. 📚 Recursos de Referencia

- **Core Types**: `src/core/types/` - Tipos centralizados
- **Core Hooks**: `src/core/hooks/` - Hooks reutilizables
- **Core Utils**: `src/core/utils/` - Funciones helpers
- **SOLID Guide**: `SOLID_GUIDE.md` - Principios y patrones
- **Features Example**: `src/features/users/` - Referencia de estructura
