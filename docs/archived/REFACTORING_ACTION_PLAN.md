# 🔧 PLAN DE ACCIÓN DETALLADO - Refactorización

## Resumen Ejecutivo
Este documento contiene **acciones específicas y ejecutables** para limpiar el código basadas en el análisis exhaustivo.

---

## FASE 1: ELIMINACIÓN INMEDIATA ⚡ (30 minutos)

### Acción 1.1: Eliminar componentes no utilizados

```bash
# Verificar antes de eliminar
grep -r "Button\|DropdownMenu" src/ --include="*.tsx" --include="*.ts"
# Resultado esperado: Solo en index.ts

# Eliminar archivos
rm src/components/Button.tsx
rm src/components/DropdownMenu.tsx
```

### Acción 1.2: Actualizar `src/components/index.ts`

**Archivo actual (líneas 1-20):**
```typescript
export * from "./Button";              // ❌ QUITAR
export * from "./Breadcumbs";
export * from "./Footer";
export * from "./NavHeader";
export * from "./Sidenav";
export * from "./DropdownMenu";        // ❌ QUITAR
export * from "./MenuMultiOption";
export * from "./MenuProfile";
export * from "./MenuSingleOption";
export * from "./NavHeaderSearch";
export * from "./ButtonForm";
export * from "./Modal";
export * from "./InputForm";
export * from "./PaginationTable";
export * from "./PaginationOptions";
export * from "./IBox";
export * from "./SplashScreen";
export * from "./TokenExpirationWarning";
```

**Archivo actualizado:**
```typescript
export * from "./Breadcumbs";
export * from "./Footer";
export * from "./NavHeader";
export * from "./Sidenav";
export * from "./MenuMultiOption";
export * from "./MenuProfile";
export * from "./MenuSingleOption";
export * from "./NavHeaderSearch";
export * from "./ButtonForm";
export * from "./Modal";
export * from "./InputForm";
export * from "./PaginationTable";
export * from "./PaginationOptions";
export * from "./IBox";
export * from "./SplashScreen";
export * from "./TokenExpirationWarning";
```

### Acción 1.3: Eliminar carpeta vacía

```bash
rm -rf src/core/middleware/
```

---

## FASE 2: CORRECCIONES DE NOMENCLATURA 📝 (45 minutos)

### Acción 2.1: Corregir Typo "Beadcumbs" → "Breadcrumbs"

```bash
# 1. Renombrar archivo
mv src/components/Breadcumbs.tsx src/components/Breadcrumbs.tsx

# 2. Actualizar export en index.ts
# ANTES: export * from "./Breadcumbs";
# DESPUÉS: export * from "./Breadcrumbs";

# 3. Actualizar imports (4 ubicaciones)
# Archivos a actualizar:
#   - src/pages/UserPage.tsx (línea 2)
#   - src/pages/AssignmentPage.tsx (línea 2)
```

**Paso a paso para UserPage.tsx:**
```typescript
// ANTES
import { Beadcumbs, IBox, PaginationOptions } from "../components";
// ...
<Beadcumbs title="Usuarios">

// DESPUÉS
import { Breadcrumbs, IBox, PaginationOptions } from "../components";
// ...
<Breadcrumbs title="Usuarios">
```

**Paso a paso para AssignmentPage.tsx:**
```typescript
// ANTES
import { Beadcumbs, IBox, PaginationOptions } from "../components";
// ...
<Beadcumbs title="Asignaciones">

// DESPUÉS
import { Breadcrumbs, IBox, PaginationOptions } from "../components";
// ...
<Breadcrumbs title="Asignaciones">
```

---

## FASE 3: REORGANIZACIÓN DE HOOKS 🎣 (1 hora)

### Acción 3.1: Mover reduxHooks a src/core/hooks/

**Paso 1: Crear nuevo archivo**
```bash
cp src/hooks/reduxHooks.ts src/core/hooks/reduxHooks.ts
```

**Paso 2: Actualizar exports en `src/core/hooks/index.ts`**

**Antes:**
```typescript
export { useAuth } from "./useAuth";
export type { UseAuthReturn } from "./useAuth";

export { usePermissions } from "./usePermissions";
export type { UsePermissionsReturn } from "./usePermissions";

export { useNotification } from "./useNotification";
export type { UseNotificationReturn } from "./useNotification";
```

**Después:**
```typescript
export { useAuth } from "./useAuth";
export type { UseAuthReturn } from "./useAuth";

export { usePermissions } from "./usePermissions";
export type { UsePermissionsReturn } from "./usePermissions";

export { useNotification } from "./useNotification";
export type { UseNotificationReturn } from "./useNotification";

export { useAppDispatch, useAppSelector } from "./reduxHooks";
export type { RootState, AppDispatch } from "./reduxHooks";
```

**Paso 3: Actualizar imports en 6 archivos**

| Archivo | Línea | Antes | Después |
|---------|-------|-------|---------|
| `src/core/hooks/useAuth.ts` | 17 | `from "../../hooks/reduxHooks"` | `from "./reduxHooks"` |
| `src/auth/ProtectedRoute.tsx` | 2 | `from "../hooks/reduxHooks"` | `from "../core/hooks"` |
| `src/auth/GuestRoute.tsx` | 14 | `from "../hooks/reduxHooks"` | `from "../core/hooks"` |
| `src/features/auth/authHooks.ts` | 4 | `from "../../hooks/reduxHooks"` | `from "../../core/hooks"` |
| `src/hooks/useTokenValidation.ts` | 12 | `from "./reduxHooks"` | `from "../core/hooks"` |
| `src/components/TokenExpirationWarning.tsx` | 9 | `from "../hooks/reduxHooks"` | `from "../core/hooks"` |

**Paso 4: Eliminar archivo antiguo**
```bash
rm src/hooks/reduxHooks.ts
```

**Paso 5: Verificar (no debe haber referencias a reduxHooks antiguo)**
```bash
grep -r "from.*hooks/reduxHooks" src/
# Resultado: nada
```

---

## FASE 4: ACTUALIZACIÓN DE DOCUMENTACIÓN 📚 (30 minutos)

### Acción 4.1: Actualizar QUICK_START.md

**Ubicación:** Línea 22

**Antes:**
```markdown
import { api } from "@/services/api";
const response = await api.get('/users');
```

**Después:**
```markdown
// ❌ DEPRECATED - Usar RTK Query en su lugar

// ✅ CORRECTO
import { useGetUsersQuery } from '@/features/users/userApi';
export const MyComponent = () => {
  const { data, isLoading } = useGetUsersQuery();
  // ...
};
```

### Acción 4.2: Actualizar BEST_PRACTICES.md

**Ubicación:** Línea 204

**Antes:**
```markdown
import { api } from "@/services/api"; // Use RTK Query
```

**Después:**
```markdown
// ❌ DEPRECATED
import { api } from "@/services/api";

// ✅ CORRECTO - Use RTK Query
import { useGetUsersQuery } from "@/features/users/userApi";
```

### Acción 4.3: Crear documento de limpieza

Crear archivo `CLEANUP_LOG.md`:
```markdown
# Registro de Limpieza de Código

Fecha: Junio 5, 2026

## Cambios Realizados

### Eliminados
- [ ] src/components/Button.tsx
- [ ] src/components/DropdownMenu.tsx
- [ ] src/core/middleware/ (carpeta)
- [ ] src/hooks/reduxHooks.ts

### Renombrados
- [ ] Breadcumbs → Breadcrumbs
- [ ] src/hooks/reduxHooks.ts → src/core/hooks/reduxHooks.ts

### Actualizados
- [ ] src/components/index.ts (exports)
- [ ] QUICK_START.md
- [ ] BEST_PRACTICES.md
- [ ] 4 componentes con imports de Breadcumbs
- [ ] 6 archivos con imports de reduxHooks

## Estado: COMPLETO
```

---

## FASE 5: MEJORAR HOOKS NO IMPLEMENTADOS 🔧 (2 horas)

### Acción 5.1: Implementar useNotification

**Opción A: Con librería (Recomendado)**

```bash
npm install react-toastify
```

**Actualizar `src/core/hooks/useNotification.ts`:**

```typescript
import { toast } from 'react-toastify';

export interface UseNotificationReturn {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export const useNotification = (): UseNotificationReturn => {
  return {
    success: (message, duration = 3000) => {
      toast.success(message, { autoClose: duration });
    },
    error: (message, duration = 3000) => {
      toast.error(message, { autoClose: duration });
    },
    warning: (message, duration = 3000) => {
      toast.warning(message, { autoClose: duration });
    },
    info: (message, duration = 3000) => {
      toast.info(message, { autoClose: duration });
    },
  };
};
```

**Actualizar `src/main.tsx`:**

```typescript
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ToastContainer position="top-right" />
    {/* ... resto del código */}
  </Provider>,
);
```

**Opción B: Eliminar temporalmente**

Si no se necesita ahora, comentar en el archivo:
```typescript
/**
 * ⚠️ STUB - No implementado aún
 * 
 * TODO: Implementar con react-toastify o librería similar
 * No se usa en la aplicación por el momento
 */
```

---

### Acción 5.2: Implementar usePermissions

**Para después de implementar RBAC**, por ahora marcar como TODO:

```typescript
/**
 * core/hooks/usePermissions.ts
 *
 * ⚠️ STUB - No completamente implementado
 * 
 * TODO: Implementar cuando el backend proporcione:
 * - Lista de permisos en JWT token
 * - Endpoint de permisos por usuario
 * 
 * Ejemplo de uso (cuando esté listo):
 * const { hasRole, hasPermission } = usePermissions();
 * if (hasRole('ADMIN')) { ... }
 */
```

---

## FASE 6: REFACTORIZACIÓN MEDIA 🚀 (2-3 horas)

### Acción 6.1: Mejorar TokenExpirationWarning (Dinámico)

**Archivo:** `src/components/TokenExpirationWarning.tsx`

**Reemplazar línea 48-60:**

```typescript
// ANTES
useEffect(() => {
  if (!showWarning) return;

  const updateTimeRemaining = () => {
    if (expiresIn && expiresIn > 0) {
      const minutes = Math.floor(expiresIn / 1000 / 60);
      const seconds = Math.floor((expiresIn / 1000) % 60);
      setTimeRemaining(`${minutes}m ${seconds}s`);
    }
  };

  updateTimeRemaining();

  // No actualizar cada segundo porque expiresIn no cambia en este componente
  // Es un valor calculado una sola vez.
}, [showWarning, expiresIn]);

// DESPUÉS
useEffect(() => {
  if (!showWarning || !expiresIn) return;

  // Actualizar cada segundo
  const interval = setInterval(() => {
    const remaining = Math.max(0, expiresIn - (Date.now() - Date.now()));
    if (remaining > 0) {
      const minutes = Math.floor(remaining / 1000 / 60);
      const seconds = Math.floor((remaining / 1000) % 60);
      setTimeRemaining(`${minutes}m ${seconds}s`);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [showWarning, expiresIn]);
```

---

### Acción 6.2: Simplificar TokenExpirationWarning (usar useAuthManager)

**Reemplazar imports:**

```typescript
// ANTES
import { useTokenExpiration } from "../hooks/useTokenValidation";
import { useAppDispatch } from "../hooks/reduxHooks";
import { logout } from "../features/auth/authSlice";

// DESPUÉS
import { useTokenExpiration } from "../hooks/useTokenValidation";
import { useAuthManager } from "../features/auth/authHooks";
```

**Reemplazar handleLogout:**

```typescript
// ANTES
const dispatch = useAppDispatch();
// ...
const handleLogout = () => {
  dispatch(logout());
};

// DESPUÉS
const { logout: handleLogout } = useAuthManager();
```

---

## FASE 7: REORGANIZACIÓN FINAL 🎯 (30 minutos)

### Acción 7.1: Eliminar archivos deprecated

```bash
# Eliminación gradual (opcional, pero recomendado)
# Semana 1: Solo documentar deprecation
# Semana 2: Mover a carpeta deprecated/
# Semana 3: Eliminar completamente

mkdir -p docs/deprecated

# Mover (no eliminar aún)
mv src/services/api.ts docs/deprecated/api.ts.bak
mv src/auth/AuthContext.tsx docs/deprecated/AuthContext.tsx.bak
```

### Acción 7.2: Crear carpeta de documentación histórica

```bash
mkdir -p docs/archive

# Mover documentación histórica
mv PERSISTENCE_FIX.md docs/archive/
mv REDUX_VERIFICATION.md docs/archive/
mv TOKEN_VERIFICATION_GUIDE.md docs/archive/
mv REDUX_STATUS.txt docs/archive/
mv SOLID_REFACTORING.txt docs/archive/
```

---

## 📊 COMANDOS RÁPIDOS (Copy-Paste)

### Verificar cambios
```bash
# Antes de ejecutar cualquier acción
git status
git diff src/
```

### Ejecutar todas las eliminaciones seguras
```bash
#!/bin/bash
# Fase 1: Eliminar archivos
rm -f src/components/Button.tsx
rm -f src/components/DropdownMenu.tsx
rm -rf src/core/middleware/

# Fase 2: Mover archivo
mv src/hooks/reduxHooks.ts src/core/hooks/reduxHooks.ts 2>/dev/null || echo "Ya movido"

echo "✅ Eliminaciones completadas"
```

### Verificar que no hay referencias rotas
```bash
# Buscar imports de archivos eliminados
grep -r "Button" src/ --include="*.tsx" --include="*.ts" | grep -v "//"
grep -r "DropdownMenu" src/ --include="*.tsx" --include="*.ts" | grep -v "//"
grep -r "hooks/reduxHooks" src/ --include="*.tsx" --include="*.ts"
```

---

## ✅ CHECKLIST DE VALIDACIÓN

Después de cada fase, ejecutar:

```bash
# 1. Verificar tipos
npm run build

# 2. Verificar linting
npm run lint

# 3. Verificar que la app aún funciona
npm run dev
# - Abrir http://localhost:5173
# - Login
# - Navegar a Users, Assignments, Dashboard
# - Verificar que no hay errores de consola
```

---

## 🚨 ROLLBACK EN CASO DE ERROR

Si algo sale mal:

```bash
# Volver al estado anterior
git checkout src/

# O si ya hiciste commit
git revert <commit-hash>
```

---

## 📝 NOTAS IMPORTANTES

1. **Hacer commits pequeños**: Un cambio por commit
2. **Probar después de cada fase**: No esperar al final
3. **Comunicar cambios**: Avisar al equipo sobre renombramientos
4. **Actualizar documentación**: Mantener sincronizado con código

---

**Total estimado: 4-5 horas de trabajo**
