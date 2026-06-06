# 🚀 Quick Start - Comienza Aquí

Bienvenido. Tu proyecto ha sido refactorizado con principios **SOLID**. Aquí te muestro cómo empezar.

---

## 📖 Lee Esto Primero (10 minutos)

1. **[SOLID_GUIDE.md](./SOLID_GUIDE.md)** - Entiende los 5 principios SOLID (15 min)
2. **[CHANGELOG.md](./CHANGELOG.md)** - Qué cambió y por qué (5 min)
3. **Este archivo** - Quick start (5 min)

---

## 🎯 Cambios Principales

### ❌ Ahora Deprecated (No uses)

```typescript
// ❌ VIEJO - No usar
import { useAuth } from "@/auth/AuthContext"; // ❌ Archivo eliminado
import { api } from "@/services/api"; // ❌ Archivo eliminado
import { localStorage } from "localStorage"; // Directo - No usar

// ✅ NUEVO - Usar esto
import { useAuth } from "@/core/hooks";
// (localStorage manejado automáticamente por redux-persist)
```

### ✅ Disponible Actualmente

```typescript
// ✅ Hooks implementados y disponibles
import { useAuth } from "@/core/hooks"; // Auth (✅ FUNCIONANDO)
import { handleApiError } from "@/core/utils"; // Errores (✅ FUNCIONANDO)
import type { User } from "@/core/types"; // Tipos (✅ FUNCIONANDO)

// ⚠️ PENDIENTE DE IMPLEMENTAR (No importar aún)
// import { usePermissions } from "@/core/hooks"; // TODO: Implementar
// import { useNotification } from "@/core/hooks"; // TODO: Implementar
```

---

## 💡 Ejemplos Prácticos

### 1️⃣ Obtener Usuario Actual

```typescript
import { useAuth } from '@/core/hooks';

export const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();

  return <p>{user?.name} - {isAuthenticated ? 'Online' : 'Offline'}</p>;
};
```

### 2️⃣ Manejar Errores Correctamente

```typescript
import { handleApiError, getUserFriendlyErrorMessage } from '@/core/utils';

export const DataFetcher = () => {
  const fetchData = async () => {
    try {
      // Tu llamada API aquí
      const result = await someApiCall();
    } catch (err) {
      // ✅ Convertir error a formato estándar
      const appError = handleApiError(err);

      // ✅ Obtener mensaje amigable para usuario
      const message = getUserFriendlyErrorMessage(appError);

      // ✅ Mostrar error (mediante consola o toast)
      console.error(message);
    }
  };

  return <button onClick={fetchData}>Cargar datos</button>;
};
```

### ⚠️ Próximas Características (No implementadas aún)

Los siguientes hooks están en el roadmap pero aún no están implementados:

- `usePermissions` - Para validar roles y permisos (PRÓXIMAMENTE)
- `useNotification` - Para mostrar notificaciones toast (PRÓXIMAMENTE)

Monitorea [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) para actualizaciones.

---

## 📁 Estructura de Carpetas Ahora

```
src/
├── core/                       ← NUEVA CARPETA
│   ├── types/                  (Tipos centralizados)
│   ├── hooks/                  (Hooks reutilizables)
│   └── utils/                  (Helpers y formateos)
│
├── features/                   (Sin cambios estructurales)
│   ├── auth/
│   ├── users/
│   └── assignments/
│
├── shared/                     (Componentes UI reutilizables)
│
├── auth/                       (ProtectedRoute, GuestRoute, etc.)
├── hooks/                      (reduxHooks.ts)
├── components/                 (Componentes compartidos)
└── main.tsx                    (Ahora con PersistGate)
```

---

## ⚡ Cambios en Comportamiento

### Redux-Persist Automático

```typescript
// ANTES: Tenías que guardar/recuperar localStorage manualmente
localStorage.setItem("auth_token", token);
const token = localStorage.getItem("auth_token");

// AHORA: Redux-persist lo hace automáticamente ✅
// Redux sincroniza con localStorage automáticamente
// Al refrescar página: Los datos se restauran automáticamente
```

### Autenticación Unificada

```typescript
// ANTES: Dos fuentes de verdad (Redux + AuthContext)
const { isAuth } = useAuth(); // Redux
const { isAuth } = useAuthContext(); // AuthContext dummy

// AHORA: Una sola fuente (Redux)
const { isAuthenticated } = useAuth(); // ✅ Unificado
```

### Sin código duplicado de tokens

```typescript
// ANTES: Manejabas token en múltiples sitios
api.interceptors.request.use(...);  // services/api.ts
localStorage.setItem(...);          // authSlice.ts
axios.create(...);                  // services/api.ts

// AHORA: RTK Query centralizado
// Todo se maneja en features/auth/api.ts automáticamente
```

---

## ✅ Checklist para Esta Semana

- [ ] Lee SOLID_GUIDE.md (15 min)
- [ ] Lee IMPLEMENTATION_GUIDE.md (15 min)
- [ ] Revisa BEST_PRACTICES.md (10 min)
- [ ] Prueba los ejemplos de Quick Start (30 min)
- [ ] Crea una página pequeña usando nuevos hooks (1 hora)
- [ ] Refactoriza una componente existente (2 horas)

---

## 🆘 Problemas Comunes

### Error: "Cannot find module '@/core/hooks'"

**Solución**: Asegúrate que tsconfig.json tiene el alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Error: "persistor is not defined"

**Solución**: Revisa que main.tsx importe persistor:

```typescript
import { store, persistor } from "@/app/store";
import { PersistGate } from "redux-persist/integration/react";
```

### Mi sesión se perdió al refrescar

**Solución**: Redux-persist tarda ~1-2 segundos. Si ves "Loading" es normal.

### ¿Cómo poner breakpoint en DevTools?

```typescript
// Instala Redux DevTools extension en tu navegador
// Luego en Chrome: F12 → Redux tab → Verás todas las acciones
```

---

## 📚 Documentación Completa

| Archivo                 | Para                      | Tiempo |
| ----------------------- | ------------------------- | ------ |
| SOLID_GUIDE.md          | Entender principios SOLID | 15 min |
| IMPLEMENTATION_GUIDE.md | Usar hooks en código      | 20 min |
| BEST_PRACTICES.md       | Convenciones y estructura | 15 min |
| CHANGELOG.md            | Ver qué cambió            | 5 min  |
| Este archivo            | Empezar rápido            | 10 min |

---

## 🎓 Próximo Nivel

Cuando te sientas cómodo, lee:

1. **FASE 2**: Refactorizar componentes con Repository Pattern
2. **FASE 3**: Crear nuevas features correctamente
3. **FASE 4**: Agregar tests

Cada fase tiene ~1-2 horas de trabajo.

---

## 🤔 ¿Todavía Confundido?

1. **¿Qué hook uso?**
   - Auth → `useAuth`
   - Permisos → `usePermissions`
   - Notificaciones → `useNotification`

2. **¿Dónde pongo tipos nuevos?**
   - Tipos globales → `src/core/types`
   - Tipos de feature → `src/features/{feature}/types.ts`

3. **¿Cómo accedo a datos?**
   - Siempre a través de hooks personalizados
   - Nunca RTK Query directo desde componentes

4. **¿Cómo manejo errores?**
   - Usa `handleApiError()` para mapear errores
   - Usa `getUserFriendlyErrorMessage()` para mostrar
   - Usa `useNotification()` para notificar

---

## 🚀 ¡Listo!

Ya estás preparado para:

- ✅ Entender SOLID
- ✅ Usar los nuevos hooks
- ✅ Escribir código mantenible
- ✅ Colaborar en el proyecto

**Siguiente paso**: Lee IMPLEMENTATION_GUIDE.md

¡Adelante! 💪
