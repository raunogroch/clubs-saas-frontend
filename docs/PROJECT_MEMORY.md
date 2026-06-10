# PROJECT MEMORY - Clubs Frontend

Este archivo es la memoria operativa del proyecto para continuar implementando módulos sin perder contexto.

## 1. Qué es este proyecto

- Frontend en React + TypeScript + Vite.
- Arquitectura orientada a features y hooks reutilizables.
- Estado global con Redux Toolkit + RTK Query.
- Persistencia de sesión con redux-persist.
- Rutas protegidas con React Router.
- UI basada en Bootstrap / clases CSS existentes.

## 2. Estructura principal

src/
├── app/ # store, persistencia, middleware, inicialización
├── auth/ # ProtectedRoute, GuestRoute
├── components/ # componentes reutilizables UI
├── core/ # hooks, context, interfaces, types, utils
├── features/ # auth, users, assignments (lógica de feature)
├── hooks/ # hooks auxiliares de Redux y utilidades
├── layouts/ # layout principal del dashboard
├── modals/ # modales por feature
├── pages/ # páginas del sistema
└── router/ # rutas y navegación

## 3. Cómo funciona el estado del proyecto

### 3.1 Estado global de autenticación

- El slice principal está en `src/features/auth/authSlice.ts`.
- Guarda:
  - `user`
  - `token`
  - `isAuthenticated`
  - `loading`
  - `error`
- El login se dispara con `loginSuccess`, `loginFailure`, `logout`, `updateUser`.

### 3.2 Persistencia

- El store central está en `src/app/store.ts`.
- Se usa `redux-persist` con `whitelist: ["auth"]`.
- El reducer de persistencia está en `src/app/persistenceSlice.ts`.
- La rehidratación se monitorea desde `src/main.tsx` usando `PersistGate`.
- Importante: antes de renderizar rutas, el sistema marca `rehydrated = true`.

### 3.3 RTK Query

- Los endpoints de API están separados por feature:
  - `src/features/auth/authApi.ts`
  - `src/features/users/userApi.ts`
  - `src/features/assignments/assignmentApi.ts`
- Se usan tags para invalidar caché después de crear/actualizar.
- Las páginas consumen estos hooks mediante `useUsers`, `useCreateUser`, `useUpdateUser`, etc.

### 3.4 Contexto global de búsqueda

- Existe un contexto de búsqueda global en `src/core/context/`.
- Se usa para activar/desactivar el buscador desde cualquier página.
- Patrón recomendado:
  1. activar búsqueda en `useEffect`
  2. usar `searchValue` en el filtro de la página
  3. limpiar estado al desmontar

## 4. Patrón usado para páginas y modales

### 4.1 Patrón de página

Una página típica sigue este flujo:

1. usar `useModalManagement<T>()` para abrir/cerrar modal
2. usar `usePaginationState()` para paginación
3. usar `useSearchSetup()` si necesita búsqueda global
4. usar un hook de feature (`useUsers`, `useAssignments`, etc.) para cargar datos
5. renderizar una tabla + modal

Ejemplo real:

- `src/pages/UserPage.tsx`
- `src/features/users/userHooks.ts`
- `src/modals/UserModal.tsx`

### 4.2 Patrón de modal

- El modal se abre desde la página con `handleCreate()` o `handleEdit(item)`.
- El modal recibe:
  - `open`
  - `onClose`
  - `data`
  - `onSaved`
- Después del submit exitoso, se hace refetch y se cierra el modal.

### 4.3 Hook reutilizable para modal

- `src/core/hooks/useModalManagement.ts`
  - controla `isOpen`, `selectedItem`, `isCreating`
- `src/core/hooks/useModalSaveHandler.ts`
  - hace refetch, muestra notificación y cierra modal

## 5. Patrón recomendado para implementar un nuevo módulo

### Paso A. Crear la feature

- Crear carpeta en `src/features/<nombre>/`
- Añadir:
  - `*.api.ts` para endpoints RTK Query
  - `*.hooks.ts` para lógica de uso
  - `types.ts` si aplica

### Paso B. Crear la página

- Añadir la vista en `src/pages/<NombrePage>.tsx`
- Usar:
  - `useModalManagement`
  - `usePaginationState`
  - `useSearchSetup` si aplica

### Paso C. Crear el modal

- Añadir el modal en `src/modals/<NombreModal>.tsx`
- Mantener el formulario dentro del componente `Modal`.
- No mezclar lógica de negocio dentro del modal si puede ir a un hook.

### Paso D. Conectar la ruta

- Añadir la ruta en `src/router/routes.tsx`
- Seguir el patrón de `UserPage` / `AssignmentPage`.

### Paso E. Mantener SOLID

- Cada archivo debe tener una sola responsabilidad clara.
- Separar lógica de UI, lógica de negocio y persistencia.
- Preferir hooks y composición sobre lógica inline excesiva.

## 6. Reglas de trabajo del proyecto

- No mezclar responsabilidades dentro de un mismo componente.
- Usar hooks para lógica reutilizable.
- Preferir RTK Query sobre fetch manual.
- No usar localStorage directo en la UI cuando ya existe redux-persist.
- Mantener modal, tabla y hook de datos separados.
- Si se necesita búsqueda global, usar el contexto de búsqueda existente.

## 7. Puntos importantes a recordar

- La ruta principal protegida está en `src/router/routes.tsx`.
- El sistema espera que `redux-persist` haya terminado de rehidratar antes de mostrar vistas protegidas.
- El store central está configurado para ignorar acciones de persistencia en serializableCheck.
- El token de autenticación se valida con hooks especiales en `src/hooks/useTokenValidation.ts`.

## 8. Referencias útiles del proyecto

- `docs/guides/QUICK_START.md`
- `docs/guides/IMPLEMENTATION_GUIDE.md`
- `docs/guides/BEST_PRACTICES.md`
- `docs/guides/SOLID_GUIDE.md`
- `docs/reports/` para historial de cambios y refactors

## 9. Resumen para nuevas implementaciones

Si vas a crear un módulo nuevo, piensa en este flujo:

1. feature API
2. hook de feature
3. page
4. modal
5. ruta
6. validación / error handling
7. pruebas manuales básicas de carga, crear, editar, cerrar

Este archivo debe servir como base para que un siguiente prompt pueda entender el proyecto sin necesidad de volver a reconstruir contexto desde cero.
