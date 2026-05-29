# Template: Crear Nueva Feature Redux

## Script Rápido para Generar Nueva Feature

Usar este template para crear nuevas features de forma consistente.

## 📋 Pasos

### 1. Crear Estructura de Carpetas

```bash
# Reemplazar {featureName} con el nombre de tu feature (ej: clubs, users, etc)
mkdir -p src/features/{featureName}/store
mkdir -p src/features/{featureName}/services
mkdir -p src/features/{featureName}/components
mkdir -p src/features/{featureName}/hooks
mkdir -p src/features/{featureName}/pages
```

### 2. Crear `{featureName}Types.ts`

```typescript
/**
 * Tipos para feature: {featureName}
 */

export enum AsyncStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export interface {FeatureNamePascalCase}State {
  items: {FeatureName}[] | null;
  
  loading: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  
  error: {
    fetch: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
}

export interface {FeatureName} {
  id: string;
  // Agregar campos según sea necesario
  createdAt: string;
  updatedAt: string;
}
```

### 3. Crear `{featureName}Service.ts`

```typescript
import { apiClient } from '../../../services/api';
import { {FeatureName} } from './{featureName}Types';

const BASE_PATH = '/{featureName}';

export const {featureName}Service = {
  /**
   * Obtener todas las items
   */
  getAll: async (): Promise<{FeatureName}[]> => {
    const response = await apiClient.get<{FeatureName}[]>(BASE_PATH);
    return response.data;
  },

  /**
   * Obtener un item por ID
   */
  getById: async (id: string): Promise<{FeatureName}> => {
    const response = await apiClient.get<{FeatureName}>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo item
   */
  create: async (data: Partial<{FeatureName}>): Promise<{FeatureName}> => {
    const response = await apiClient.post<{FeatureName}>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Actualizar item
   */
  update: async (id: string, data: Partial<{FeatureName}>): Promise<{FeatureName}> => {
    const response = await apiClient.put<{FeatureName}>(
      `${BASE_PATH}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Eliminar item
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${id}`);
  },
};
```

### 4. Crear `{featureName}Thunks.ts`

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { {featureName}Service } from '../services/{featureName}Service';
import { {FeatureName} } from './{featureName}Types';
import type { RootState } from '../../../app/store';

export const fetch{FeatureNamePascalCase}All = createAsyncThunk<
  {FeatureName}[],
  void,
  {
    state: RootState;
    rejectValue: { message: string; code: string };
  }
>(
  '{featureName}/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await {featureName}Service.getAll();
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
      });
    }
  }
);

export const create{FeatureNamePascalCase} = createAsyncThunk<
  {FeatureName},
  Partial<{FeatureName}>,
  {
    state: RootState;
    rejectValue: { message: string; code: string };
  }
>(
  '{featureName}/create',
  async (data, { rejectWithValue }) => {
    try {
      return await {featureName}Service.create(data);
    } catch (error: any) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
      });
    }
  }
);
```

### 5. Crear `{featureName}Slice.ts`

```typescript
import { createSlice } from '@reduxjs/toolkit';
import {
  fetch{FeatureNamePascalCase}All,
  create{FeatureNamePascalCase},
  // Importar otros thunks
} from './{featureName}Thunks';
import { {FeatureNamePascalCase}State } from './{featureName}Types';

const initialState: {FeatureNamePascalCase}State = {
  items: null,
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },
  error: {
    fetch: null,
    create: null,
    update: null,
    delete: null,
  },
};

export const {featureName}Slice = createSlice({
  name: '{featureName}',
  initialState,
  reducers: {
    clearError: (state, action) => {
      state.error[action.payload] = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetch{FeatureNamePascalCase}All.pending, (state) => {
        state.loading.fetch = true;
      })
      .addCase(fetch{FeatureNamePascalCase}All.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.items = action.payload;
      })
      .addCase(fetch{FeatureNamePascalCase}All.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload?.message || 'Error fetching data';
      });

    // Create
    builder
      .addCase(create{FeatureNamePascalCase}.pending, (state) => {
        state.loading.create = true;
      })
      .addCase(create{FeatureNamePascalCase}.fulfilled, (state, action) => {
        state.loading.create = false;
        if (state.items) {
          state.items.push(action.payload);
        }
      })
      .addCase(create{FeatureNamePascalCase}.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload?.message || 'Error creating item';
      });
  },
});

export const {featureName}Actions = {featureName}Slice.actions;
export default {featureName}Slice.reducer;
```

### 6. Crear `{featureName}Selectors.ts`

```typescript
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';

const select{FeatureNamePascalCase}State = (state: RootState) => state.{featureName};

export const select{FeatureNamePascalCase}Items = createSelector(
  [select{FeatureNamePascalCase}State],
  (state) => state.items
);

export const select{FeatureNamePascalCase}Loading = createSelector(
  [select{FeatureNamePascalCase}State],
  (state) => state.loading
);

export const select{FeatureNamePascalCase}Error = createSelector(
  [select{FeatureNamePascalCase}State],
  (state) => state.error
);

export const select{FeatureNamePascalCase}ById = (id: string) =>
  createSelector([select{FeatureNamePascalCase}Items], (items) =>
    items?.find((item) => item.id === id) || null
  );
```

### 7. Crear `use{FeatureNamePascalCase}Actions.ts`

```typescript
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  fetch{FeatureNamePascalCase}All,
  create{FeatureNamePascalCase},
} from '../store/{featureName}Thunks';
import {
  select{FeatureNamePascalCase}Items,
  select{FeatureNamePascalCase}Loading,
  select{FeatureNamePascalCase}Error,
} from '../store/{featureName}Selectors';
import { {FeatureNamePascalCase} } from '../store/{featureName}Types';

export const use{FeatureNamePascalCase}Actions = () => {
  const dispatch = useAppDispatch();

  const items = useAppSelector(select{FeatureNamePascalCase}Items);
  const loading = useAppSelector(select{FeatureNamePascalCase}Loading);
  const error = useAppSelector(select{FeatureNamePascalCase}Error);

  const fetchAll = useCallback(async () => {
    return dispatch(fetch{FeatureNamePascalCase}All());
  }, [dispatch]);

  const create = useCallback(
    async (data: Partial<{FeatureNamePascalCase}>) => {
      return dispatch(create{FeatureNamePascalCase}(data));
    },
    [dispatch]
  );

  return {
    items,
    loading,
    error,
    fetchAll,
    create,
  };
};
```

### 8. Registrar Reducer en `store.ts`

```typescript
import {featureName}Reducer from '../features/{featureName}/store/{featureName}Slice';

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    {featureName}: {featureName}Reducer, // ← Agregar aquí
  },
});
```

### 9. Usar en Componentes

```typescript
import { use{FeatureNamePascalCase}Actions } from '@/features/{featureName}/hooks/use{FeatureNamePascalCase}Actions';

export const {FeatureNamePascalCase}List = () => {
  const { items, loading, error, fetchAll } = use{FeatureNamePascalCase}Actions();

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading.fetch) return <div>Loading...</div>;
  if (error.fetch) return <div>Error: {error.fetch}</div>;

  return (
    <div>
      {items?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## 🎯 Nombres de Ejemplo

Para crear feature `clubs`:
- `{featureName}` → `clubs`
- `{FeatureName}` → `Club`
- `{FeatureNamePascalCase}` → `Clubs`

Para crear feature `memberships`:
- `{featureName}` → `memberships`
- `{FeatureName}` → `Membership`
- `{FeatureNamePascalCase}` → `Memberships`

## ✅ Checklist

- [ ] Carpetas creadas
- [ ] Types creados
- [ ] Service creado
- [ ] Thunks creados
- [ ] Slice creado
- [ ] Selectors creados
- [ ] Hooks creados
- [ ] Reducer registrado en store
- [ ] Componentes creados
- [ ] Testado

## 📝 Convenciones de Naming

- **Carpeta feature**: `kebab-case` (auth, user-profile, etc)
- **Nombres de tipos**: `PascalCase` (User, Club, etc)
- **Nombres de thunks**: `camelCase` con prefijo feature (fetchUsers, createClub)
- **Nombres de selectores**: `select` + feature + dato (selectUsers, selectUserById)
- **Nombres de hooks**: `use` + feature + `Actions` (useUsersActions)

## 🔄 Next Steps

1. Copiar este template
2. Reemplazar todos los placeholders
3. Crear los 8 archivos
4. Registrar el reducer en store.ts
5. Crear componentes que usen los hooks
6. Testear que todo funcione
