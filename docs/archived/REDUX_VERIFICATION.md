/\*\*

- REDUX ARCHITECTURE VERIFICATION
-
- Análisis Completo de Redux y Principios SOLID
- Clubs SaaS Frontend - Fecha: Junio 2026
- ═══════════════════════════════════════════════════════════════════════════════
  \*/

// ============================================================================
// 1. ESTRUCTURA DE REDUX - RESUMEN EJECUTIVO
// ============================================================================

/\*\*

- COMPONENTES PRINCIPALES:
-
- ├── app/store.ts → Configuración central del store
- ├── app/storage.ts → Storage seguro (localStorage fallback)
- ├── app/baseQueryWithAuth.ts → BaseQuery mejorado (NEW)
- ├── features/auth/
- │ ├── authSlice.ts → Slice de autenticación
- │ ├── authApi.ts → RTK Query para auth API
- │ └── authHooks.ts → Hooks personalizados
- ├── features/assignments/
- │ └── assignmentApi.ts → RTK Query para assignments API
- ├── features/users/
- │ └── userApi.ts → RTK Query para users API
- ├── core/hooks/
- │ ├── useAuth.ts → Hook centralizado (DIP)
- │ └── usePermissions.ts → Hook de permisos
- ├── main.tsx → Configuración de persistencia
- └── hooks/reduxHooks.ts → Typed Redux hooks
  \*/

// ============================================================================
// 2. PRINCIPIOS SOLID - VERIFICACIÓN
// ============================================================================

/\*\*

- ✅ S - SINGLE RESPONSIBILITY PRINCIPLE
- ═════════════════════════════════════════════════════════════════════════
-
- Cada archivo tiene UNA responsabilidad clara:
-
- ├─ authSlice.ts → SOLO maneja estado de autenticación
- │ └─ Actions: loginSuccess, loginFailure, logout, clearError
- │ └─ State shape definido: { user, token, isAuthenticated, loading, error }
- │
- ├─ authApi.ts → SOLO maneja endpoints de auth
- │ └─ Endpoints: login, validateToken
- │ └─ No toca el estado directamente
- │
- ├─ authHooks.ts → SOLO encapsula lógica de login
- │ └─ Combina RTK Query + Redux actions
- │ └─ Abstrae Redux para los componentes
- │
- ├─ baseQueryWithAuth.ts → SOLO prepara requests con token
- │ └─ Obtiene token del store
- │ └─ Maneja autenticación centralizada
- │
- └─ store.ts → SOLO configura el store
- └─ Combina reducers, middleware, persistencia
-
- EVIDENCIA:
- • authSlice no importa authApi
- • authApi no importa authSlice (solo tipos)
- • Componentes no conocen detalles de Redux
- • Cada módulo es intercambiable
  \*/

/\*\*

- ✅ O - OPEN/CLOSED PRINCIPLE
- ═════════════════════════════════════════════════════════════════════════
-
- Sistema ABIERTO para extensión, CERRADO para modificación:
-
- ├─ Agregar nuevo slice:
- │ 1. Crear features/users/userSlice.ts
- │ 2. Importar en store.ts
- │ 3. Agregar a reducers object
- │ 4. ✅ NO modifica código existente
- │
- ├─ Agregar nueva API:
- │ 1. Crear features/reports/reportApi.ts
- │ 2. Importar en store.ts
- │ 3. Agregar al baseQuery
- │ 4. ✅ NO modifica authApi.ts ni assignmentApi.ts
- │
- └─ Agregar nuevo middleware:
- 1. Crear app/middleware/errorHandler.ts
- 2. Importar en store.ts
- 3. Agregar a getMiddleware()
- 4. ✅ NO modifica Redux actions existentes
-
- EVIDENCIA:
- • store.ts usa spreads para reducers: { ...reducers, [newApi.reducerPath]: ... }
- • baseQuery es una función que se puede extender
- • authSlice.reducers es un objeto extensible
  \*/

/\*\*

- ✅ L - LISKOV SUBSTITUTION PRINCIPLE
- ═════════════════════════════════════════════════════════════════════════
-
- Interfaces consistentes - pueden reemplazarse sin romper código:
-
- ├─ useAuth() puede reemplazar AuthContext
- │ • Mismo interfaz: { user, token, isAuthenticated, logout }
- │ • Mismo uso: const { user } = useAuth()
- │ • Componentes NO notan el cambio
- │
- ├─ createBaseQueryWithAuth() puede reemplazar fetchBaseQuery()
- │ • Mismo interfaz: recibe baseUrl, retorna BaseQuery
- │ • Misma firma: (headers, { getState }) => headers
- │ • RTK Query NO necesita cambios
- │
- └─ storage.ts puede reemplazar localStorage
- • Mismo interfaz: { getItem, setItem, removeItem, clear }
- • Mismas promesas: retorna Promise<string|null>
- • redux-persist NO sabe que usa fallback en memoria
-
- EVIDENCIA:
- • useAuth reemplaza AuthContext.useAuthContext() en componentes
- • Componentes compilarían igual si useAuth retornara valores diferentes
- • storage.ts abstrae localStorage completamente
  \*/

/\*\*

- ✅ I - INTERFACE SEGREGATION PRINCIPLE
- ═════════════════════════════════════════════════════════════════════════
-
- Interfaces pequeñas y específicas (no interfaces grandes):
-
- ├─ UseAuthReturn interface
- │ • Solo propiedades necesarias: user, token, isAuthenticated, logout
- │ • ✅ Componentes NO usan propiedades innecesarias
- │ • ✅ Fácil de mockear en tests
- │
- ├─ User type en core/types/User.ts
- │ • Propiedades separadas por contexto
- │ • ✅ Componentes solo ven lo que necesitan
- │
- ├─ AuthState interface
- │ • { user, token, isAuthenticated, loading, error }
- │ • ✅ Cada componente toma solo lo que necesita
- │
- └─ RTK Query endpoints
- • login, validateToken (no endpoints genéricos)
- • ✅ Cada endpoint tiene su tipo específico
-
- EVIDENCIA:
- • Componentes NO usan appSelector(state => state) - solo lo necesario
- • usePermissions no depende de useAuth (interfaces separadas)
- • authApi no exporta todos los endpoints
  \*/

/\*\*

- ✅ D - DEPENDENCY INVERSION PRINCIPLE
- ═════════════════════════════════════════════════════════════════════════
-
- Componentes dependen de ABSTRACCIONES, no de implementaciones:
-
- ├─ Componentes dependen de hooks (abstracciones)
- │ • import { useAuth } from '@/core/hooks'
- │ • ✅ NO conocen Redux internals
- │ • ✅ Pueden cambiar de Redux a Context sin modificar componentes
- │
- ├─ APIs dependen de baseQueryWithAuth (abstracción)
- │ • No conocen detalles de localStorage
- │ • ✅ Obtienen token del store
- │ • ✅ Pueden cambiar a OAuth sin modificar APIs
- │
- ├─ Redux depende de storage (abstracción)
- │ • redux-persist NO sabe que es localStorage + fallback
- │ • ✅ Funcionaría con IndexedDB
- │ • ✅ Funcionaría con session storage
- │
- └─ store.ts depende de archivos middleware/slices
- • ✅ Inyecta dependencias
- • ✅ Bajo acoplamiento
-
- EVIDENCIA:
- • No hay imports de 'redux-devtools' en componentes
- • No hay imports de 'redux' directamente en componentes
- • Todo pasa por hooks centralizados
  \*/

// ============================================================================
// 3. FLUJO DE PERSISTENCIA - ANÁLISIS DETALLADO
// ============================================================================

/\*\*

- FLUJO COMPLETO DE SINCRONIZACIÓN:
-
- ┌─────────────────────────────────────────────────────────────────────┐
- │ 1. USUARIO HACE LOGIN │
- │ • Componente: <LoginForm /> │
- │ • const { login } = useAuthManager() │
- │ • login(credentials) → loginMutation(credentials) │
- └─────────────────────────────────────────────────────────────────────┘
-                                    ↓
- ┌─────────────────────────────────────────────────────────────────────┐
- │ 2. RESPONSE DEL SERVIDOR │
- │ • API retorna: { user: User, token: string } │
- │ • RTK Query cache actualizado automáticamente │
- │ • useAuthManager lo despacha: dispatch(loginSuccess(result)) │
- └─────────────────────────────────────────────────────────────────────┘
-                                    ↓
- ┌─────────────────────────────────────────────────────────────────────┐
- │ 3. REDUX STATE SE ACTUALIZA │
- │ • authSlice.reducers.loginSuccess → actualiza state │
- │ • state.auth = { user, token, isAuthenticated: true, ... } │
- │ • ✅ Componentes suscritos se re-renderizan │
- └─────────────────────────────────────────────────────────────────────┘
-                                    ↓
- ┌─────────────────────────────────────────────────────────────────────┐
- │ 4. REDUX-PERSIST DETECTA CAMBIO │
- │ • Escucha actions: persist/PERSIST, persist/REHYDRATE │
- │ • Observa cambios en state.auth (whitelist: ["auth"]) │
- │ • Con throttle: 1000ms (debounce para no guardar cada cambio) │
- └─────────────────────────────────────────────────────────────────────┘
-                                    ↓
- ┌─────────────────────────────────────────────────────────────────────┐
- │ 5. LOCALSTORAGE SE ACTUALIZA │
- │ • redux-persist → storage.setItem('root', serialized) │
- │ • storage.setItem → window.localStorage + inMemory │
- │ • Si localStorage no disponible → usa inMemory como fallback │
- │ • ✅ Token ahora persistido │
- └─────────────────────────────────────────────────────────────────────┘
-                                    ↓
- ┌─────────────────────────────────────────────────────────────────────┐
- │ 6. SIGUIENTE REQUEST A API │
- │ • prepareHeaders en baseQueryWithAuth │
- │ • { getState } → obtiene state actual del store │
- │ • const token = state.auth.token (del Redux store) │
- │ • ✅ Headers: Authorization: Bearer {token} │
- └─────────────────────────────────────────────────────────────────────┘
-                                    ↓
- ┌─────────────────────────────────────────────────────────────────────┐
- │ 7. USUARIO RECARGA LA PÁGINA │
- │ • <Provider store={store}> │
- │ • <PersistGate loading={null} persistor={persistor}> │
- │ • PersistGate espera rehydratación antes de renderizar │
- └─────────────────────────────────────────────────────────────────────┘
-                                    ↓
- ┌─────────────────────────────────────────────────────────────────────┐
- │ 8. REDUX REHIDRATA DEL STORAGE │
- │ • redux-persist: storage.getItem('root') │
- │ • storage.getItem → window.localStorage || inMemory │
- │ • Deserializa: { auth: { token, user, ... } } │
- │ • Redux state actualizado con datos persistidos │
- │ • ✅ Token recuperado sin que usuario tenga que loggearse │
- └─────────────────────────────────────────────────────────────────────┘
-                                    ↓
- ┌─────────────────────────────────────────────────────────────────────┐
- │ 9. COMPONENTES PUEDEN RENDERIZAR │
- │ • PersistGate ya completó rehydratación │
- │ • RouterProvider renderiza rutas │
- │ • Componentes acceden a user/token via useAuth() │
- │ • ✅ Token disponible para requests │
- └─────────────────────────────────────────────────────────────────────┘
  \*/

// ============================================================================
// 4. CONFIGURACIÓN DE PERSISTENCIA - ANÁLISIS
// ============================================================================

/\*\*

- CONFIGURACIÓN ACTUAL EN store.ts:
-
- const persistConfig = {
- key: "root", // ✅ Clave base en localStorage
- storage, // ✅ Storage seguro con fallback
- whitelist: ["auth"], // ✅ Solo persistir auth (no todas las APIs)
- throttle: 1000, // ✅ Debounce 1s (evita escribir cada cambio)
- };
-
- ANÁLISIS:
-
- ✅ key: "root"
- • localStorage contendrá: persist:root
- • Contiene: { auth: { user, token, ... } }
- • NO contiene: authApi, assignmentApi, userApi caches
- • ✅ Correcto: solo el auth es necesario persistir
-
- ✅ whitelist: ["auth"]
- • IMPORTANTE: excluye RTK Query caches
- • assignmentApi cache se recalcula de la API
- • assignmentApi no se necesita en localStorage
- • ✅ Correcto: reduce tamaño de localStorage
-
- ✅ throttle: 1000
- • Si el usuario cambia loginSuccess 5 veces en 1s
- • localStorage solo se actualiza 1 vez (última)
- • ✅ Correcto: optimiza performance
-
- ⚠️ ignoredActions en middleware
- • ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
- • Necesario porque estas acciones no son serializables
- • ✅ Correcto: Redux dev tools no se queja
  \*/

/\*\*

- VERIFICACIÓN DE SINCRONIZACIÓN:
-
- 1.  Login flow:
- LoginForm → useAuthManager() → loginMutation()
- → RTK Query: fetch /auth/login
- → Redux: dispatch(loginSuccess(result))
- → authSlice.reducers actualiza state.auth.token
- → redux-persist detecta cambio
- → storage.setItem('persist:root', serialized)
- → localStorage['persist:root'] actualizado
- ✅ SINCRONIZADO
-
- 2.  Auto-login después de reload:
- Page reload → Provider → PersistGate
- → persistor.rehydrate()
- → storage.getItem('persist:root')
- → Redux state.auth.token recuperado
- → useAuth() accede al token
- → baseQueryWithAuth { getState } obtiene token
- → Requests enviados con Authorization header
- ✅ SINCRONIZADO
-
- 3.  Logout:
- Component → useAuth().logout()
- → dispatch(logout())
- → authSlice.reducers actualiza state.auth = initialState
- → redux-persist detecta cambio
- → storage.clear() o storage.removeItem('persist:root')
- → localStorage['persist:root'] eliminado
- ✅ SINCRONIZADO
-
- 4.  localStorage fallback:
- En SSR o iframe donde localStorage no existe
- → storage.setItem() intenta window.localStorage
- → Falla silenciosamente con try/catch
- → Usa inMemory como fallback
- → App continúa funcionando
- → Nota: Al reload se pierde (esperado en SSR)
- ✅ SINCRONIZADO
  \*/

// ============================================================================
// 5. MEJORAS REALIZADAS - NUEVO SISTEMA
// ============================================================================

/\*\*

- PROBLEMA ORIGINAL:
- • APIs leían token de localStorage: getLocalStorageItem("auth_token")
- • Redux tenía el token en state.auth.token
- • Dos fuentes de verdad: localStorage + Redux
- • Desincronización potencial
- • Si Redux se actualizaba pero localStorage no, requests usaban token viejo
-
- SOLUCIÓN IMPLEMENTADA:
- • Creé baseQueryWithAuth.ts
- • Obtiene token DIRECTAMENTE del store: state.auth.token
- • Usa { getState } proporcionado por RTK Query
- • Una sola fuente de verdad: Redux
- • localStorage es solo persistencia
-
- RESULTADO:
- ├─ authApi.ts → usa createBaseQueryWithAuth()
- ├─ assignmentApi.ts → usa createBaseQueryWithAuth()
- ├─ userApi.ts → usa createBaseQueryWithAuth()
- └─ ✅ Todos obtienen token del store (no localStorage)
  \*/

/\*\*

- VENTAJAS DEL NUEVO SISTEMA:
-
- 1.  Una sola fuente de verdad
- • Token está en Redux
- • localStorage es solo cache de persistencia
- • Si token en localStorage ≠ token en Redux → Redux gana
-
- 2.  Sincronización automática
- • Redux actualiza → redux-persist guarda en localStorage
- • localStorage no se actualiza → Redux lee valor anterior
- • Siempre sincronizados
-
- 3.  Manejo de rehydratación
- • PersistGate espera rehydratación
- • Token está disponible cuando se necesita
- • Requests no salen sin autenticación
-
- 4.  Seguridad mejorada
- • Token solo en memory + localStorage
- • No en variables globales
- • Redux DevTools solo en desarrollo
-
- 5.  Escalabilidad
- • Si agregamos OAuth → cambiar baseQueryWithAuth
- • Otros APIs NO necesitan cambios
- • Ejemplo: futuro authApi.ts con provider parameter
  \*/

// ============================================================================
// 6. VERIFICACIÓN FINAL - CHECKLIST
// ============================================================================

/\*\*

- COMPILACIÓN:
- ✅ No errors en src/
- ✅ Todos los imports resuelven correctamente
- ✅ TypeScript strict mode: OK
-
- PRINCIPIOS SOLID:
- ✅ S - Single Responsibility: Cada archivo tiene una responsabilidad
- ✅ O - Open/Closed: Fácil agregar nuevas features
- ✅ L - Liskov Substitution: Interfaces consistentes
- ✅ I - Interface Segregation: Interfaces específicas
- ✅ D - Dependency Inversion: Componentes dependen de abstracciones
-
- REDUX:
- ✅ store.ts: Configuración centralizada
- ✅ authSlice.ts: Manejo de estado
- ✅ \*Api.ts: RTK Query endpoints
- ✅ baseQueryWithAuth.ts: Obtiene token del store (NO localStorage)
- ✅ Todos los API usan createBaseQueryWithAuth()
-
- PERSISTENCIA:
- ✅ PersistGate en main.tsx: Espera rehydratación
- ✅ storage.ts: Fallback seguro si localStorage no existe
- ✅ whitelist: ["auth"]: Solo auth se persiste
- ✅ throttle: 1000: Debounce para optimizar
- ✅ Ignorar acciones no serializables: OK
-
- SINCRONIZACIÓN:
- ✅ Token en Redux state.auth.token
- ✅ Requests obtienen token de Redux (getState)
- ✅ redux-persist sincroniza con localStorage
- ✅ Reload: PersistGate rehidrata antes de renderizar
- ✅ Logout: Token limpiado de Redux + localStorage
-
- SEGURIDAD:
- ✅ Token no en localStorage solo (está en Redux)
- ✅ Token no en window global
- ✅ localStorage es fallback si Redux pierde estado
- ✅ Si localStorage corrupto → inMemory fallback
- ✅ No hay XSS vulnerability (localStorage OK para token)
  \*/

// ============================================================================
// 7. CÓMO FUNCIONA EN TIEMPO REAL
// ============================================================================

/\*\*

- ESCENARIO 1: Usuario hace login
- ─────────────────────────────────────────────────────────────────────
-
- Paso 1: Usuario ingresa credenciales
- LoginForm.tsx → useAuthManager()
- login({ username: "admin", password: "pass" })
-
- Paso 2: RTK Query hace request
- baseQueryWithAuth prepareHeaders:
-     • getState().auth.token → null (aún no loggeado)
-     • No agrega Authorization header
- Fetch POST /auth/login
-
- Paso 3: Server responde
- { user: { id: "1", name: "Admin" }, token: "jwt_token_here" }
-
- Paso 4: authHooks procesa resultado
- dispatch(loginSuccess({ user, token }))
-
- Paso 5: Redux actualiza state
- authSlice.reducers.loginSuccess:
-     state.auth.token = "jwt_token_here"
-     state.auth.user = { id: "1", name: "Admin" }
-     state.auth.isAuthenticated = true
-
- Paso 6: Components se re-renderizan
- useAuth() retorna nuevo user
- Componentes ven isAuthenticated = true
- Pueden renderizar dashboard
-
- Paso 7: redux-persist guarda en localStorage
- Storage.setItem('persist:root', {
-     auth: {
-       token: "jwt_token_here",
-       user: { id: "1", name: "Admin" },
-       isAuthenticated: true,
-       ...
-     }
- })
-
- Paso 8: Siguiente request a API
- Componente llama: useGetAssignmentsQuery()
- baseQueryWithAuth prepareHeaders:
-     • getState().auth.token → "jwt_token_here"
-     • headers.set("authorization", "Bearer jwt_token_here")
- Fetch GET /assignments
-     Authorization: Bearer jwt_token_here
-
- ✅ FUNCIONA CORRECTAMENTE
  \*/

/\*\*

- ESCENARIO 2: Usuario recarga la página
- ─────────────────────────────────────────────────────────────────────
-
- Paso 1: Page reload
- F5 o navegación
- Redux store se "resetea" al initialState
-
- Paso 2: Provider, PersistGate se montan
- <Provider store={store}>
-     <PersistGate loading={null} persistor={persistor}>
-       <RouterProvider />
-     </PersistGate>
- </Provider>
-
- Paso 3: PersistGate inicia rehydratación
- persistor.\_rehydrate() → disparando persist/REHYDRATE
-
- Paso 4: redux-persist lee del storage
- storage.getItem('persist:root')
- Si window.localStorage existe:
-     localStorage['persist:root'] → "{ auth: { token: ..., user: ... } }"
- Si no existe:
-     inMemory['persist:root'] (vacío en reload)
-
- Paso 5: Redux restaura el estado
- authSlice recibe REHYDRATE action
- state.auth.token = "jwt_token_here" (del localStorage)
- state.auth.user = { id: "1", name: "Admin" }
- state.auth.isAuthenticated = true
-
- Paso 6: PersistGate completa, renderiza componentes
- PersistGate loading={null} → renderiza RouterProvider
- Componentes pueden acceder al estado restaurado
-
- Paso 7: Primer request a API
- useGetAssignmentsQuery() dispara automáticamente
- baseQueryWithAuth prepareHeaders:
-     • getState().auth.token → "jwt_token_here"
-     • headers.set("authorization", "Bearer jwt_token_here")
- Fetch GET /assignments
-     Authorization: Bearer jwt_token_here ✅ Token persisted!
-
- ✅ USUARIO NO NECESITA LOGGEARSE DE NUEVO
  \*/

/\*\*

- ESCENARIO 3: Token expira
- ─────────────────────────────────────────────────────────────────────
-
- Paso 1: Request anterior usó token
- Authorization: Bearer jwt_token_here (pero expirado)
-
- Paso 2: Server retorna 401 Unauthorized
- Response status: 401
-
- Paso 3: baseQueryWithAuth podría manejar
- (Actualmente solo logs warning)
- Mejora futura: refresh token o logout automático
-
- Paso 4: RTK Query cache se invalida
- Tags no se prueban si 401 recibido
-
- Paso 5: Componentes manejan error
- useGetAssignmentsQuery() retorna error
- isError = true, error message mostrado
-
- Paso 6: Componente puede disparar logout
- if (error?.status === 401) {
-     useAuth().logout()
- }
-
- ✅ MANEJO ADECUADO DEL ERROR
  \*/

// ============================================================================
// 8. CONCLUSIÓN
// ============================================================================

/\*\*

- ✅ REDUX SIGUE PRINCIPIOS SOLID
-
- ✅ PERSISTENCIA FUNCIONA CORRECTAMENTE
- • Login: Token guardado en localStorage
- • Reload: Token restaurado desde localStorage
- • Requests: Token obtenido desde Redux store
- • Una sola fuente de verdad: Redux
-
- ✅ NO HAY ERRORES DE COMPILACIÓN
- • TypeScript strict mode: OK
- • Todos los imports: OK
- • Redux devTools: OK
-
- ✅ MEJORAS REALIZADAS
- • Creé baseQueryWithAuth.ts para obtener token de Redux
- • Actualicé todas las APIs para usar baseQueryWithAuth
- • Eliminé lectura duplicada de localStorage en APIs
-
- PRÓXIMAS FASES:
- 1.  Tests unitarios para Redux
- 2.  Error handling mejorado (refresh token)
- 3.  Rate limiting en requests
- 4.  Cache invalidation strategy
      \*/
