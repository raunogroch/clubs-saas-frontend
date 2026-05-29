# Redux - Ejemplos Prácticos

## 📚 Ejemplos de Uso Real

### 1️⃣ Componente con Login y Manejo de Errores

```typescript
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { login } from '@/features/auth/store/authThunks';
import { selectLoginLoading, selectLoginError } from '@/features/auth/store/authSelectors';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoginLoading);
  const error = useAppSelector(selectLoginError);
  
  const handleLogin = async (email: string, password: string) => {
    const result = await dispatch(login({ email, password }));
    
    // Verificar si fue exitoso
    if (login.fulfilled.match(result)) {
      console.log('Login exitoso:', result.payload);
      // Navegar al dashboard (ya se hace automáticamente)
    } else {
      console.error('Login falló:', result.payload);
      // Error ya está en selectLoginError
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin('user@example.com', 'password123');
    }}>
      {error && <div className="alert alert-danger">{error}</div>}
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### 2️⃣ Componente con Información del Usuario

```typescript
import { useUserInfo } from '@/features/auth/hooks/useAuthActions';

export const UserProfile = () => {
  const { user, displayName, isAdmin, hasPermission } = useUserInfo();
  
  return (
    <div>
      <h1>Welcome, {displayName}!</h1>
      <p>Email: {user?.email}</p>
      
      {isAdmin && <div>You are an admin</div>}
      
      {hasPermission('manage_clubs') && (
        <button>Manage Clubs</button>
      )}
    </div>
  );
};
```

### 3️⃣ Componente con Logout

```typescript
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

export const NavHeader = () => {
  const { user, logout, isLoggingOut } = useAuthActions();
  
  const handleLogout = async () => {
    await logout();
    // Automáticamente redirige a /login
  };
  
  return (
    <nav>
      <span>Hi, {user?.firstName}</span>
      <button onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </nav>
  );
};
```

### 4️⃣ Componente Condicional Basado en Autenticación

```typescript
import { useAuth } from '@/hooks/redux';

export const Header = () => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return (
      <header>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </header>
    );
  }
  
  return (
    <header>
      <span>Welcome, {user?.firstName}</span>
      {/* ... */}
    </header>
  );
};
```

### 5️⃣ Selector Personalizado para Permisos

```typescript
import { createSelector } from '@reduxjs/toolkit';
import { selectUser } from '@/features/auth/store/authSelectors';

// Verificar si el usuario puede editar un club específico
export const selectCanEditClub = (clubId: string) =>
  createSelector([selectUser], (user) => {
    if (!user) return false;
    
    // Lógica personalizada
    return (
      user.roles.includes('admin') ||
      user.permissions.includes(`edit:club:${clubId}`)
    );
  });

// Uso en componente
export const ClubCard = ({ clubId }) => {
  const canEdit = useAppSelector(selectCanEditClub(clubId));
  
  return (
    <div>
      {canEdit && <button>Edit</button>}
    </div>
  );
};
```

### 6️⃣ Formulario con Validación y Redux

```typescript
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { register } from '@/features/auth/store/authThunks';
import { selectRegisterLoading, selectRegisterError } from '@/features/auth/store/authSelectors';

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectRegisterLoading);
  const serverError = useAppSelector(selectRegisterError);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const result = await dispatch(register({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
    }));
    
    if (!register.fulfilled.match(result)) {
      // Error manejo por Redux
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {serverError && (
        <div className="alert alert-danger">{serverError}</div>
      )}
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        disabled={loading}
      />
      {errors.email && <span>{errors.email}</span>}
      
      {/* Más campos */}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
};
```

### 7️⃣ Hook Personalizado para Async Data

```typescript
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

/**
 * Hook reutilizable para obtener datos async
 * 
 * USO:
 * const { data, loading, error } = useFetchData(fetchUserData);
 */
export const useFetchData = <T,>(
  thunk: () => ReturnType<typeof thunk>
) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const data = useAppSelector(selectData);
  
  const fetch = useCallback(async () => {
    const result = await dispatch(thunk());
    return result;
  }, [dispatch, thunk]);
  
  return { data: data as T, loading, error, fetch };
};
```

### 8️⃣ Componente con Manejo de Estado Múltiple

```typescript
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectLoginLoading,
  selectLoginError,
} from '@/features/auth/store/authSelectors';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectLoginLoading);
  const error = useAppSelector(selectLoginError);
  
  // Derivar datos
  const userFullName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Guest';
  
  const isReady = isAuthenticated && !loading;
  
  return (
    <div>
      {!isAuthenticated && (
        <p>Please log in to continue</p>
      )}
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      
      {isReady && (
        <h1>Welcome, {userFullName}!</h1>
      )}
    </div>
  );
};
```

### 9️⃣ Integración con Fetch/Request Lib (Axios)

```typescript
import axios from 'axios';
import { useAppDispatch } from '@/hooks/redux';
import { authActions } from '@/features/auth/store/authSlice';

/**
 * Crear instancia de Axios con autorización automática
 * (Ya está en src/services/api.ts)
 */
export const createAuthorizedAxios = (token: string) => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Uso en componentes
export const FetchDataComponent = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAccessToken);
  
  const fetchData = async () => {
    try {
      const api = createAuthorizedAxios(token!);
      const response = await api.get('/api/clubs');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(authActions.logout());
      }
      throw error;
    }
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
};
```

### 🔟 Testing de Componentes Redux

```typescript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import { LoginForm } from '@/features/auth/components/LoginForm';

// Helper para crear store de test
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
};

describe('LoginForm', () => {
  it('debería mostrar error si email es inválido', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    // Test lógica
  });
});
```

## 🔌 Patrones de Middleware Personalizado

### Middleware para Tracking

```typescript
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

export const trackingMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    console.log('Action:', action.type);
    const result = next(action);
    console.log('New State:', store.getState());
    return result;
  };

// Registrar en store.ts
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(trackingMiddleware),
```

### Middleware para Error Handling

```typescript
export const errorHandlingMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    try {
      return next(action);
    } catch (error) {
      console.error('Error caught by middleware:', error);
      // Dispatch error action
      store.dispatch(errorActions.setError(String(error)));
      throw error;
    }
  };
```

## 📡 Thunk Personalizado Complejo

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

interface FetchUserDataPayload {
  userId: string;
  includeSettings?: boolean;
}

export const fetchUserData = createAsyncThunk<
  any, // Return type
  FetchUserDataPayload, // Argument type
  {
    state: RootState;
    rejectValue: { message: string; code: string };
  }
>(
  'user/fetchData',
  async (
    { userId, includeSettings = true },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      // Acceder al estado actual
      const state = getState();
      const token = state.auth.accessToken;
      
      if (!token) {
        return rejectWithValue({
          message: 'No auth token',
          code: 'NO_TOKEN',
        });
      }
      
      // Hacer solicitud
      const api = createAuthorizedAxios(token);
      const userData = await api.get(`/users/${userId}`);
      
      if (includeSettings) {
        const settings = await api.get(`/users/${userId}/settings`);
        userData.settings = settings.data;
      }
      
      return userData.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
      });
    }
  }
);
```

## 🎨 Patterns para Variables Globales

```typescript
// ❌ MALO - Estado volátil en Redux
const [theme, setTheme] = useState('light');

// ✅ BUENO - Estado persistente en Redux
export const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: 'light' as 'light' | 'dark' },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
  },
});

// Persistencia automática
const persistConfig = {
  key: 'root',
  whitelist: ['auth', 'theme'], // ← Incluir tema
};
```
