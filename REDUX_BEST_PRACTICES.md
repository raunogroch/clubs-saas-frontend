# Redux - Mejores Prácticas y Patrones

## 🏗️ Principios de Arquitectura

### 1. Separación de Responsabilidades (SRP)

Cada archivo tiene **UNA** responsabilidad:

```
types.ts       → Define interfaces TypeScript
service.ts     → Llamadas a API (sin estado)
thunk.ts       → Orquestación de lógica async
slice.ts       → Reducers (cambiar estado)
selectors.ts   → Acceso al estado
hooks.ts       → Interfaz para componentes
```

### 2. Unidirectional Data Flow

```
Component
    ↓ (dispatch)
Thunk (API call)
    ↓ (fulfill/reject)
Slice (update state)
    ↓ (subscribe)
Selector (read state)
    ↓ (render)
Component
```

### 3. Inmutabilidad

Redux Toolkit usa Immer bajo el capó, permitiendo código mutable:

```typescript
// Redux Toolkit lo convierte en inmutable internamente
const slice = createSlice({
  reducers: {
    updateUser: (state, action) => {
      // ✅ Esto se trata como inmutable (Immer mágico)
      state.user.name = action.payload;
    },
  },
});
```

## 💾 Persistencia de Estado

### Configuración Actual

```typescript
// store.ts
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Solo persistir auth
  timeout: 1000,
};
```

### Qué Persistir vs No Persistir

✅ **Persistir**:
- Datos de usuario (después de login)
- Tema de la aplicación
- Preferencias del usuario
- Tokens (⚠️ considerar seguridad)

❌ **NO Persistir**:
- Estado de carga
- Errores (fugaces)
- Datos en tiempo real
- Información sensible

## 🔐 Seguridad

### 1. Tokens en localStorage

⚠️ **Riesgo**: localStorage es vulnerable a XSS

**Mitigación**:
```typescript
// ✅ Sanitizar inputs
const sanitize = (input: string) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// ✅ Use HttpOnly cookies si es posible (backend)
// ✅ Content Security Policy (CSP)
// ✅ HTTPS solo
```

### 2. Permisos y Roles

```typescript
// ✅ BUENO - Check en UI + Backend
export const selectCanDeleteUser = (userId: string) =>
  createSelector([selectUser], (user) => {
    // UI check (para UX)
    if (!user) return false;
    return user.roles.includes('admin') || 
           user.permissions.includes('delete:user');
  });

// ⚠️ NUNCA confiar solo en UI
// El backend debe verificar permisos SIEMPRE
```

### 3. CSRF Protection

Axios está configurado para incluir CSRF tokens:

```typescript
// src/services/api.ts
const api = axios.create({
  withCredentials: true, // Enviar cookies
});

// Backend debe validar token CSRF
```

## 🎯 Performance Optimization

### 1. Memoización de Selectores

```typescript
// ✅ BUENO - Solo recalcula si user cambia
export const selectUserDisplayName = createSelector(
  [selectUser],
  (user) => `${user.firstName} ${user.lastName}`
);

// ❌ MALO - Recalcula cada render
export const selectUserDisplayName = (state: RootState) => {
  const user = state.auth.user;
  return `${user.firstName} ${user.lastName}`;
};
```

### 2. Splitting State

Dividir estado grande en piezas más pequeñas:

```typescript
// ❌ TODO en un slice
export const authSlice = createSlice({
  initialState: {
    user: null,
    token: null,
    loading: true,
    error: null,
    userData: { /* muchos campos */ },
    preferences: { /* muchos campos */ },
  }
});

// ✅ BUENO - Slices separados
export const authSlice = createSlice({...}); // User + token
export const preferencesSlice = createSlice({...}); // Preferences
export const uiSlice = createSlice({...}); // Loading + error
```

### 3. Lazy Loading de Features

```typescript
// store.ts
const store = configureStore({
  reducer: {
    auth: authReducer,
    // Otros slices se pueden añadir dinámicamente
  },
});

// Función para registrar un reducer dinámicamente
export const injectReducer = (key: string, reducer: any) => {
  store.asyncReducers = store.asyncReducers || {};
  store.asyncReducers[key] = reducer;
};
```

## 📊 Monitoreo y Debugging

### Redux DevTools

Automáticamente disponible en desarrollo:

```typescript
// store.ts
devTools: import.meta.env.DEV,
```

**Features**:
- Time travel debugging
- Action history
- State diff
- Export/import state

### Logging Personalizado

```typescript
const loggingMiddleware: Middleware = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
```

## 🧪 Testing

### 1. Testing de Reducers

```typescript
import { authSlice } from '@/features/auth/store/authSlice';

describe('authSlice', () => {
  it('debería manejar logout', () => {
    const initialState = {
      user: { id: '1', name: 'John' },
      isAuthenticated: true,
    };
    
    const newState = authSlice.reducer(
      initialState,
      authSlice.actions.logout()
    );
    
    expect(newState.user).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
  });
});
```

### 2. Testing de Selectores

```typescript
import { selectUserDisplayName } from '@/features/auth/store/authSelectors';

describe('selectUserDisplayName', () => {
  it('debería retornar nombre completo', () => {
    const state: RootState = {
      auth: {
        user: { firstName: 'John', lastName: 'Doe' },
      },
    };
    
    expect(selectUserDisplayName(state)).toBe('John Doe');
  });
  
  it('debería retornar Guest si no hay usuario', () => {
    const state: RootState = {
      auth: { user: null },
    };
    
    expect(selectUserDisplayName(state)).toBe('Guest');
  });
});
```

### 3. Testing de Thunks

```typescript
import { login } from '@/features/auth/store/authThunks';
import * as authService from '@/features/auth/services/authService';

jest.mock('@/features/auth/services/authService');

describe('login thunk', () => {
  it('debería setear usuario en fulfilled', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    
    jest.spyOn(authService, 'login').mockResolvedValue({
      user: mockUser,
      access_token: 'token123',
      refresh_token: 'refresh123',
    });
    
    const store = configureStore({ reducer: { auth: authReducer } });
    
    const result = await store.dispatch(
      login({ email: 'test@example.com', password: 'pass' })
    );
    
    expect(login.fulfilled.match(result)).toBe(true);
    expect(store.getState().auth.user).toEqual(mockUser);
  });
});
```

### 4. Testing de Componentes con Redux

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from '@/features/auth/components/LoginForm';
import authReducer from '@/features/auth/store/authSlice';

const renderWithRedux = (
  component: React.ReactElement,
  { preloadedState = {} } = {}
) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });
  
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('LoginForm', () => {
  it('debería desabilitar botón cuando loading', () => {
    const { store } = renderWithRedux(<LoginForm />, {
      preloadedState: {
        auth: { loading: { login: true } },
      },
    });
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

## 🔄 Patrones de Actualización de Estado

### 1. Optimistic Updates

```typescript
export const updateUserSlice = createSlice({
  reducers: {
    // Actualizar localmente antes de confirmar con servidor
    updateUserOptimistic: (state, action) => {
      if (state.user) {
        state.user.name = action.payload;
      }
    },
    // Revertir si falla
    revertUserUpdate: (state, action) => {
      if (state.user) {
        state.user.name = action.payload;
      }
    },
  },
});
```

### 2. Normalización de Estado

Para datos complejos con relaciones:

```typescript
// ❌ MALO - Anidado profundamente
{
  users: [
    {
      id: 1,
      clubs: [
        { id: 1, memberships: [...] }
      ]
    }
  ]
}

// ✅ BUENO - Normalizado
{
  users: { 1: { id: 1, clubIds: [1] } },
  clubs: { 1: { id: 1, membershipIds: [1] } },
  memberships: { 1: { id: 1, userId: 1, clubId: 1 } }
}
```

### 3. Batch Updates

```typescript
export const batchUpdateSlice = createSlice({
  reducers: {
    batchUpdate: (state, action: PayloadAction<UpdatePayload[]>) => {
      action.payload.forEach((update) => {
        // Actualizar múltiples cosas
      });
    },
  },
});
```

## 🚨 Error Handling Avanzado

### 1. Retry Logic

```typescript
export const loginWithRetry = createAsyncThunk(
  'auth/loginWithRetry',
  async (credentials, { rejectWithValue }) => {
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await authService.login(credentials);
      } catch (error) {
        if (i === maxRetries - 1) {
          return rejectWithValue(error);
        }
        // Esperar antes de reintentar
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
);
```

### 2. Error Recovery

```typescript
export const setupErrorRecovery = (store) => {
  store.subscribe(() => {
    const state = store.getState();
    
    // Si hay error crítico, notificar
    if (state.auth.error.login === 'NETWORK_ERROR') {
      // Mostrar notificación
      // Reintentar automáticamente
    }
  });
};
```

## 📈 Escalabilidad

### Structure para Grande Projects

```
features/
├── auth/
├── users/
│   ├── store/
│   │   ├── users.slice.ts
│   │   ├── users.thunks.ts
│   │   ├── users.selectors.ts
│   │   ├── users.types.ts
│   │   └── index.ts (exports centralizados)
│   ├── services/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── index.ts
├── clubs/
├── memberships/
├── payments/
└── index.ts (export de todos los features)
```

### Exports Centralizados

```typescript
// features/auth/store/index.ts
export * from './authSlice';
export * from './authThunks';
export * from './authSelectors';
export * from './authTypes';

// Uso
import { login, selectUser } from '@/features/auth/store';
```

## 🎓 Checklist de Code Review Redux

- [ ] ¿Los thunks solo hacen llamadas a API?
- [ ] ¿Los reducers solo cambian estado?
- [ ] ¿Los servicios son puros (sin Redux)?
- [ ] ¿Los selectores son memoizados?
- [ ] ¿El loading/error está granularizado por acción?
- [ ] ¿Se usa `rejectWithValue` en todos los thunks?
- [ ] ¿Los tipos TypeScript cubren todos los casos?
- [ ] ¿Se limpia el estado correctamente en logout?
- [ ] ¿Se valida input en el componente + backend?
- [ ] ¿Se testea la lógica async adecuadamente?

## 🔮 Roadmap: Evolución a RTK Query

Cuando el proyecto cresca, considerar migrar a RTK Query:

```typescript
// Futura estructura con RTK Query
const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = selectAccessToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({ /* ... */ }),
    getCurrentUser: builder.query({ /* ... */ }),
  }),
});
```

**Beneficios**:
- Caché automático
- Menos boilerplate
- Invalidación de caché
- Sincronización de estado servidor/cliente
