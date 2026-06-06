# 🎯 Clubs SaaS - Frontend

Aplicación React/TypeScript para gestión de clubs y asignaciones. Refactorizada con principios **SOLID** para máxima mantenibilidad.

## 📋 Quick Links

- 🚀 **[docs/guides/QUICK_START.md](./docs/guides/QUICK_START.md)** - Comienza aquí (10 min)
- 📚 **[docs/guides/SOLID_GUIDE.md](./docs/guides/SOLID_GUIDE.md)** - Entiende los principios SOLID
- 💡 **[docs/guides/IMPLEMENTATION_GUIDE.md](./docs/guides/IMPLEMENTATION_GUIDE.md)** - Cómo usar nuevos hooks
- ✅ **[docs/guides/BEST_PRACTICES.md](./docs/guides/BEST_PRACTICES.md)** - Convenciones y patrones
- 📝 **[docs/reference/CHANGELOG.md](./docs/reference/CHANGELOG.md)** - Cambios realizados
- 📖 **[docs/](./docs/)** - Toda la documentación organizada

## 🏗️ Tech Stack

- **React** 19.2 - UI library
- **TypeScript** 6.0 - Type safety
- **Redux Toolkit** 2.12 - State management
- **RTK Query** - Data fetching & caching
- **React Router** 7 - Routing
- **Vite** 8.0 - Build tool
- **Redux Persist** 6.0 - State persistence

## 📁 Estructura del Proyecto

```
src/
├── core/                    # Abstracciones centralizadas (SOLID)
│   ├── types/              # Tipos centralizados
│   ├── hooks/              # Hooks reutilizables
│   └── utils/              # Utilidades y helpers
├── features/               # Funcionalidades por feature
│   ├── auth/
│   ├── users/
│   └── assignments/
├── shared/                 # Componentes UI reutilizables
├── app/                    # Configuración de app
│   ├── store.ts            # Redux + redux-persist
│   ├── router.tsx          # Rutas
│   └── App.tsx
└── main.tsx
```

## 🚀 Comenzar

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de ambiente

```bash
cp .env.example .env.local
# Editar VITE_API_URL con tu backend
```

### 3. Iniciar desarrollo

```bash
pnpm dev
```

### 4. Build para producción

```bash
pnpm build
```

## 🎯 Principios SOLID Implementados

### ✅ Single Responsibility (SRP)

- Cada archivo/componente tiene una responsabilidad
- `authSlice.ts` - Solo Redux state
- `useAuth.ts` - Solo acceso a auth
- `error-handlers.ts` - Solo mapeo de errores

### ✅ Open/Closed (OCP)

- Extensible sin modificar código existente
- Tipos centralizados para todas las features
- Plugin system para componentes

### ✅ Liskov Substitution (LSP)

- Interfaz consistente entre ProtectedRoute y GuestRoute
- Todos los hooks retornan interfaces predecibles

### ✅ Interface Segregation (ISP)

- Hooks segregados: `useAuth`, `usePermissions`, `useNotification`
- No mezclar responsabilidades en un hook

### ✅ Dependency Inversion (DIP)

- Componentes dependen de abstracciones (hooks)
- No dependen de implementación (Redux, RTK Query)
- Repository Pattern para acceso a datos

## 📚 Hooks Disponibles

### `useAuth`

Acceso a información de autenticación

```typescript
const { user, isAuthenticated, token, logout } = useAuth();
```

### `usePermissions`

Validación de roles y permisos

```typescript
const { isAdmin, hasRole, can } = usePermissions();
```

### `useNotification`

Mostrar notificaciones al usuario

```typescript
const { success, error, warning, info } = useNotification();
```

## 🛠️ Utilities Centralizadas

### Error Handling

```typescript
import { handleApiError, getUserFriendlyErrorMessage } from "@/core/utils";

const appError = handleApiError(error);
const message = getUserFriendlyErrorMessage(appError);
```

### Validación

```typescript
import { isValidEmail, isStrongPassword } from "@/core/utils";
```

### Formateo

```typescript
import { formatDate, capitalize, truncate } from "@/core/utils";
```

## 📖 Documentación

### Para Entender el Proyecto

1. **QUICK_START.md** - Introducción rápida (10 min)
2. **SOLID_GUIDE.md** - Principios SOLID (15 min)
3. **src/core/README.md** - Estructura de core/ (5 min)

### Para Escribir Código

1. **IMPLEMENTATION_GUIDE.md** - Cómo usar hooks (20 min)
2. **BEST_PRACTICES.md** - Convenciones (15 min)
3. **features/users/** - Referencia de estructura

### Para Colaborar

1. **BEST_PRACTICES.md** - Checklist de code review
2. **CHANGELOG.md** - Cambios recientes

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Coverage
pnpm test:coverage
```

## 🔍 Linting

```bash
# Verificar código
pnpm lint

# Arreglar automáticamente
pnpm lint --fix
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@/core/hooks'"

Revisa que `vite.config.ts` o `tsconfig.json` tengan el alias `@/`.

### Error: "persistor is not defined"

Asegúrate que `main.tsx` importe `persistor` de `store.ts`.

### Mi sesión se perdió

Redux-persist sincroniza en background. Recarga la página si esperas más de 2 segundos.

## 🤝 Contribuir

1. Lee **BEST_PRACTICES.md** para convenciones
2. Crea branch: `git checkout -b feature/mi-feature`
3. Sigue el patrón de carpetas en `features/`
4. Implementa usando hooks centralizados
5. Abre PR con descripción clara

## 📞 Soporte

- 📚 Documentación completa en archivos `.md`
- 💡 Ejemplos en `src/features/`
- 🔧 Tipos en `src/core/types/`

## 📄 Licencia

Propietario - Clubs SaaS

---

**Estado**: ✅ FASE 1 Completada - Refactorización SOLID implementada  
**Próxima Fase**: Refactorización de componentes con Repository Pattern  
**Última actualización**: Junio 5, 2024
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
