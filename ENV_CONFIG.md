# Configuración de Variables de Entorno

## Archivo: `.env.local` (crear en raíz del proyecto)

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Entorno
VITE_ENV=development

# Features Flags (opcional)
VITE_ENABLE_2FA=false
VITE_ENABLE_ANALYTICS=false

# Redux Config (opcional)
VITE_REDUX_DEVTOOLS=true
```

## Archivo: `.env.production` (para producción)

```env
# API Configuration
VITE_API_URL=https://api.clubs.com/api

# Entorno
VITE_ENV=production

# Features Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_ANALYTICS=true

# Redux Config
VITE_REDUX_DEVTOOLS=false
```

## Acceder a Variables en el Código

```typescript
// En cualquier archivo
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// En src/services/api.ts ya está implementado
```

## Variables Disponibles Automáticamente

```typescript
import.meta.env.DEV       // boolean - true en desarrollo
import.meta.env.PROD      // boolean - true en producción
import.meta.env.SSR       // boolean - Server-side rendering
import.meta.env.MODE      // string - 'development' o 'production'
```

## Typeado de Variables de Entorno

Para mejor tipado, crear `src/vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENV: 'development' | 'production';
  readonly VITE_ENABLE_2FA: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_REDUX_DEVTOOLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## ⚠️ IMPORTANTE: No Commitear Secrets

Agregar a `.gitignore`:

```
.env.local
.env.*.local
.env.production.local
*.pem
*.key
.DS_Store
```

Nunca commitear archivos `.env` con secretos.

## Ejemplo de Uso en la App

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// src/store.ts
devTools: import.meta.env.DEV,

// En componentes
if (import.meta.env.PROD) {
  // Solo en producción
}
```
