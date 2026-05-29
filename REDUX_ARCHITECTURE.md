# Arquitectura Redux - Guía Completa

Esta es una implementación **enterprise-ready** de Redux con Redux Toolkit siguiendo las mejores prácticas modernas.

## 📁 Estructura de Carpetas

```
src/
├── app/
│   └── store.ts                 # Configuración central del store Redux
│
├── features/
│   ├── auth/                    # Feature de Autenticación (ejemplo)
│   │   ├── components/
│   │   │   ├── LoginForm.tsx    # Componente de login
│   │   │   ├── RegisterForm.tsx # Componente de registro
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   └── useAuthActions.ts
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   └── authService.ts   # Llamadas a API (pura, sin Redux)
│   │   └── store/
│   │       ├── authSlice.ts     # Reducers (estado + acciones)
│   │       ├── authThunks.ts    # Async actions
│   │       ├── authSelectors.ts # Extractores de estado
│   │       ├── authTypes.ts     # TypeScript interfaces
│   │       └── authMiddleware.ts
│   │
│   ├── users/                   # Feature de Usuarios (estructura similar)
│   ├── clubs/                   # Feature de Clubs
│   ├── memberships/             # Feature de Memberships
│   └── notifications/           # Feature de Notificaciones
│
├── hooks/
│   └── redux.ts                 # Hooks personalizados tipados
│
├── services/
│   └── api.ts                   # Cliente Axios con interceptores
│
└── shared/                      # Componentes y utilidades compartidas
```

## 🎯 Conceptos Clave

### 1. **State Management Separation**

El estado se divide en tres categorías:

#### a) **Data State** (Datos del servidor)
```typescript
user: User | null;
accessToken: string | null;
```

#### b) **UI State** (Estado de la interfaz)
```typescript
loading: {
  login: boolean;
  register: boolean;
  // ...
}
```

#### c) **Error State** (Estados de error)
```typescript
error: {
  login: string | null;
  register: string | null;
  // ...
}
```

### 2. **Service Layer Pattern**

**authService.ts** - Solo hace llamadas a API:
```typescript
export const authService = {
  login: async (credentials) => await apiClient.post('/auth/login', credentials),
  logout: async () => await apiClient.post('/auth/logout'),
};
```

**NO tiene Redux**, solo retorna datos.

### 3. **Thunks (Async Logic)**

**authThunks.ts** - Orquesta servicios y Redux:
```typescript
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      tokenService.setTokens(response.access_token, response.refresh_token);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

### 4. **Selectors (Extractores tipados)**

**authSelectors.ts** - Acceso centralizado al estado:
```typescript
// Selector simple
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

// Selector derivado
export const selectUserDisplayName = createSelector(
  [selectUser],
  (user) => user ? `${user.firstName} ${user.lastName}` : 'Guest'
);
```

## 🔧 Cómo Usar en Componentes

### Paso 1: Importar Hooks Personalizados

```typescript
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectUser, selectLoginLoading } from '@/features/auth/store/authSelectors';
import { login } from '@/features/auth/store/authThunks';
```

### Paso 2: Usar en Componentes

```typescript
export const MyComponent = () => {
  const dispatch = useAppDispatch();
  
  // Selectores tipados
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectLoginLoading);
  
  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      // Éxito
    }
  };
  
  return <div>{user?.name}</div>;
};
```

### Paso 3: Usar Hooks Personalizados (Recomendado)

```typescript
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

export const NavHeader = () => {
  const { user, logout, isLoggingOut } = useAuthActions();
  
  return (
    <div>
      <span>{user?.firstName}</span>
      <button onClick={logout} disabled={isLoggingOut}>
        Logout
      </button>
    </div>
  );
};
```

## 📊 Estado Global vs Local

### Usa Estado Global cuando:
✅ Múltiples componentes necesitan el dato
✅ Datos del servidor (usuario, configuración)
✅ Estado de autenticación
✅ Preferencias globales del usuario
✅ Datos que persisten entre navegación

### Usa Estado Local cuando:
✅ Solo un componente lo usa (useState)
✅ Estado temporal de formulario
✅ UI ephemeral (tooltips, dropdowns)
✅ Animaciones y transiciones
✅ Búsqueda/filtrado temporal

### Ejemplo: State Colocation
```typescript
export const UserProfile = () => {
  // Local: solo esta pantalla
  const [editMode, setEditMode] = useState(false);
  
  // Global: compartido por toda la app
  const user = useAppSelector(selectUser);
  
  return <div>{/* ... */}</div>;
};
```

## 🚀 Flujo de Autenticación

```
1. Usuario abre app
   ↓
2. authMiddleware verifica si hay tokens en localStorage
   ↓
3. Si existen → dispatch(getCurrentUser())
   ↓
4. Redux restaura sesión automáticamente
   ↓
5. Componentes verifican selectIsAuthenticated
   ↓
6. ProtectedRoute permite/bloquea acceso
```

## 🔐 Gestión de JWT y Refresh Token

### Flujo de Refresh Automático

```
1. Llamada a API retorna 401 (Unauthorized)
   ↓
2. Interceptor detecta 401
   ↓
3. Si token de refresh disponible → POST /auth/refresh
   ↓
4. Guardar nuevo access token
   ↓
5. Reintentar request original
   ↓
6. Si refresh también falla → dispatch(logout())
```

Implementado en: `src/services/api.ts`

## ⚙️ Anti-patrones a Evitar

### ❌ MALO: Estado derivado duplicado
```typescript
// NO HAGAS ESTO
const [user, setUser] = useState(null);
const [displayName, setDisplayName] = useState('');

// Cuando user cambia, tienes que actualizar displayName manualmente
```

### ✅ BUENO: Selector derivado
```typescript
export const selectUserDisplayName = createSelector(
  [selectUser],
  (user) => user ? `${user.firstName} ${user.lastName}` : 'Guest'
);
```

### ❌ MALO: Persistencia manual
```typescript
// NO HAGAS ESTO
dispatch(login(credentials));
localStorage.setItem('user', JSON.stringify(user));
```

### ✅ BUENO: Redux-Persist automático
```typescript
// Configurado en store.ts
const persistConfig = { key: 'root', storage, whitelist: ['auth'] };
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
```

### ❌ MALO: Lógica de servidor en el slice
```typescript
// NO HAGAS ESTO
const reducer = (state, action) => {
  // ❌ No hacer llamadas a API aquí
  const data = await fetch('...');
  state.user = data;
};
```

### ✅ BUENO: Separación clara
```typescript
// Thunk (orquestación)
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    const data = await authService.login(credentials); // ← API aquí
    return data;
  }
);

// Slice (cambiar estado)
const authSlice = createSlice({
  // ...
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user; // ← Cambiar estado aquí
    });
  },
});
```

## 📝 Estados Loading/Error por Acción

```typescript
// Cada acción async tiene su propio loading y error
loading: {
  login: false,        // Estado del login específicamente
  register: false,     // Estado del registro específicamente
  logout: false,
  getCurrentUser: false,
  refresh: false,
}

error: {
  login: null,         // Error del login
  register: null,      // Error del registro
  logout: null,
  getCurrentUser: null,
  refresh: null,
}
```

**Ventaja**: Puedes mostrar loading/error diferente para cada acción.

```typescript
{selectLoginLoading && <LoadingSpinner />}
{selectLoginError && <Alert message={selectLoginError} />}
```

## 🧪 Testing

### Testear Selectors
```typescript
import { selectUserDisplayName } from '@/features/auth/store/authSelectors';

test('selectUserDisplayName', () => {
  const state = {
    auth: {
      user: { firstName: 'John', lastName: 'Doe' }
    }
  };
  const displayName = selectUserDisplayName(state);
  expect(displayName).toBe('John Doe');
});
```

### Testear Thunks
```typescript
import { login } from '@/features/auth/store/authThunks';
import { configureStore } from '@reduxjs/toolkit';

test('login thunk', async () => {
  const store = configureStore({ reducer: { auth: authReducer } });
  
  const result = await store.dispatch(login({
    email: 'test@example.com',
    password: 'password123'
  }));
  
  expect(login.fulfilled.match(result)).toBe(true);
});
```

## 🔄 Preparación para RTK Query

**RTK Query** es la próxima generación de data fetching en Redux (reemplaza servicios + thunks).

Estructura actual es compatible porque:
- ✅ Separación clara de responsabilidades
- ✅ Types definidos
- ✅ Selectors centralizados
- ✅ Fácil migración

**Migración futura**:
```typescript
// Antes (actual)
import { authService } from './services/authService';
export const login = createAsyncThunk('auth/login', ...);

// Después (RTK Query)
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    login: builder.mutation({ /* ... */ }),
  }),
});
```

## 🏗️ Estructura para Features Adicionales

Cada feature sigue el mismo patrón:

```
features/users/
├── components/
├── pages/
├── services/
│   └── userService.ts
├── store/
│   ├── userSlice.ts
│   ├── userThunks.ts
│   ├── userSelectors.ts
│   └── userTypes.ts
└── hooks/
    └── useUserActions.ts
```

## 📋 Checklist para Nueva Feature

1. ✅ Crear `types.ts` con interfaces
2. ✅ Crear `service.ts` con llamadas a API
3. ✅ Crear `thunks.ts` con lógica async
4. ✅ Crear `slice.ts` con reducers
5. ✅ Crear `selectors.ts` con extractores
6. ✅ Crear `hooks.ts` con hooks personalizados (opcional)
7. ✅ Registrar reducer en `store.ts`
8. ✅ Crear componentes usando los hooks

## 🎓 Referencias

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Redux Persist Docs](https://github.com/rt2zz/redux-persist)
- [Redux Selectors Best Practices](https://redux.js.org/usage/deriving-data-selectors)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
