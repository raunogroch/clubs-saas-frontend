╔════════════════════════════════════════════════════════════════════════════╗
║ ║
║ 🔐 SISTEMA COMPLETO DE VALIDACIÓN Y PERSISTENCIA DE TOKEN ║
║ ║
║ Clubs SaaS Frontend - Token Verification & Auto-Logout ║
║ ║
╚════════════════════════════════════════════════════════════════════════════╝

📋 RESUMEN EJECUTIVO
════════════════════════════════════════════════════════════════════════════

El sistema ahora verifica el token continuamente en múltiples niveles:

✅ localStorage: Datos persisten automáticamente
✅ Redux Store: Estado sincronizado siempre
✅ ProtectedRoute: Valida antes de permitir acceso
✅ baseQueryWithAuth: Verifica antes de cada request
✅ authMiddleware: Logout automático si servidor responde 401
✅ useTokenValidation: Monitoreo continuo en componentes

Si algo falla → AUTO-LOGOUT inmediato ✓

🏗️ ARQUITECTURA DE VALIDACIÓN
════════════════════════════════════════════════════════════════════════════

```
LOGIN
  ↓
authSlice.loginSuccess() → Redux state actualizado
  ↓
redux-persist detecta cambio
  ↓
storage.setItem('persist:root', {..., token, user, ...})
  ↓
localStorage['persist:root'] = JSON serializado
  ↓
✅ Token guardado en localStorage


PÁGINA RECARGADA (F5)
  ↓
Redux inicializa (empty state)
  ↓
ProtectedRoute renderiza
  ├─ Verifica: !isRehydrated ? SplashScreen
  ├─ redux-persist inicia rehydratación
  ├─ Lee localStorage['persist:root']
  └─ Restaura token a Redux
  ↓
100ms → PersistGate.onBeforeLift dispara setRehydrated()
  ↓
ProtectedRoute re-renderiza
  ├─ Verifica: isRehydrated = true ✓
  ├─ Verifica: isTokenInStorage() = true ✓
  ├─ Verifica: isAuthenticated = true ✓
  └─ useTokenValidation() = valida formato y expiración
  ↓
✅ Usuario permanece loggeado


API REQUEST
  ↓
baseQueryWithAuth.prepareHeaders()
  ├─ Obtiene token del Redux store
  ├─ Valida formato: isValidTokenFormat()
  ├─ Valida expiración: isTokenExpired()
  ├─ Verifica localStorage: isTokenInStorage()
  └─ Agrega: Authorization: Bearer {token}
  ↓
Servidor responde 200 ✓ o 401 ✗
  ↓
Si 401:
  ├─ authMiddleware detecta error
  ├─ store.dispatch(logout())
  ├─ useTokenValidation detecta discrepancia
  └─ ProtectedRoute redirige a /login
  ↓
✅ Logout automático


LOGOUT
  ↓
useAuth().logout() → dispatch(logout())
  ↓
authSlice limpia estado
  ├─ token = null
  ├─ user = null
  ├─ isAuthenticated = false
  └─ error = null
  ↓
redux-persist detecta cambio
  ↓
storage.removeItem('persist:root') O storage.clear()
  ↓
localStorage['persist:root'] eliminado
  ↓
ProtectedRoute re-renderiza
  ├─ Verifica: isAuthenticated = false
  └─ Redirige: <Navigate to="/login" />
  ↓
✅ Usuario loggeado out
```

📂 ARCHIVOS NUEVOS CREADOS
════════════════════════════════════════════════════════════════════════════

1. **src/app/tokenVerification.ts** (Utilidades)
   ├─ getTokenFromStorage() - Obtiene token de localStorage
   ├─ isTokenInStorage() - Verifica existencia
   ├─ isValidTokenFormat() - Valida estructura JWT
   ├─ decodeJWT() - Decodifica payload
   ├─ isTokenExpired() - Verifica expiración
   ├─ getTokenExpirationTime() - Tiempo restante
   ├─ validateToken() - Validación completa
   ├─ isTokenSynchronized() - Compara localStorage vs Redux
   ├─ clearTokenFromStorage() - Limpia localStorage
   └─ watchTokenChanges() - Monitorea cambios (otras pestañas)

2. **src/hooks/useTokenValidation.ts** (Hooks)
   ├─ useTokenValidation() - Valida continuamente
   ├─ useTokenExpiration() - Obtiene info de expiración
   └─ useAutoLogoutOnTokenExpiry() - Logout automático

3. **src/app/middleware/authMiddleware.ts** (Middleware)
   └─ authMiddleware - Maneja errores 401/403 de RTK Query

4. **src/components/TokenExpirationWarning.tsx** (Componente)
   └─ TokenExpirationWarning - Alerta cuando falta < 5 min

📝 ARCHIVOS MODIFICADOS
════════════════════════════════════════════════════════════════════════════

1. **src/auth/ProtectedRoute.tsx**
   ├─ ✅ Agregado useTokenValidation()
   ├─ ✅ Verifica isTokenInStorage()
   └─ ✅ Validación en 3 niveles

2. **src/app/baseQueryWithAuth.ts**
   ├─ ✅ Valida token antes de cada request
   ├─ ✅ Verifica formato y expiración
   ├─ ✅ Verifica localStorage
   └─ ✅ Maneja respuesta 401/403

3. **src/app/store.ts**
   ├─ ✅ Agregado authMiddleware
   └─ ✅ Escucha errores 401 de RTK Query

4. **src/layouts/Main.tsx**
   └─ ✅ Agregado <TokenExpirationWarning />

5. **src/components/index.ts**
   └─ ✅ Exporta TokenExpirationWarning

🔄 FLUJO DE VALIDACIÓN DETALLADO
════════════════════════════════════════════════════════════════════════════

NIVEL 1: localStorage
──────────────────────────────────────────────────────────────────────────
localStorage['persist:root'] = {
"auth": {
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": { "id": 1, "name": "Juan", ... },
"isAuthenticated": true,
"loading": false,
"error": null
}
}

Validación:
✓ Existe la clave 'persist:root'
✓ Contiene 'auth.token'
✓ Token no está vacío

NIVEL 2: Redux Store (después de rehydrate)
──────────────────────────────────────────────────────────────────────────
store.getState().auth = {
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
user: { id: 1, name: "Juan", ... },
isAuthenticated: true,
loading: false,
error: null
}

Validación:
✓ isAuthenticated === true
✓ token !== null
✓ token !== empty string
✓ Sincronizado con localStorage

NIVEL 3: Token Integrity
──────────────────────────────────────────────────────────────────────────
Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvIn0.xxx"
└──────── Header ────────┘ └───────── Payload ────────┘ └─ Sig ─┘

Validación:
✓ 3 partes separadas por '.'
✓ Cada parte es base64 válido
✓ Payload es JSON válido
✓ No está expirado (exp > now)
✓ Diferencia: now < exp (o exp - 60s para buffer)

NIVEL 4: ProtectedRoute
──────────────────────────────────────────────────────────────────────────
if (!isRehydrated) return <SplashScreen />;
if (!isTokenInStorage()) return <Navigate to="/login" />;
if (!isAuthenticated) return <Navigate to="/login" />;
useTokenValidation(); // Monitorear continuamente
return <Outlet />;

Resultado:
✓ Usuario solo ve ruta si token EXISTE y VÁLIDO
✓ Automático logout si token desaparece

NIVEL 5: Request Headers
──────────────────────────────────────────────────────────────────────────
baseQueryWithAuth.prepareHeaders():
const token = store.getState().auth.token;
if (token) {
const validation = validateToken(token);
if (validation.isValid) {
headers.set("authorization", `Bearer ${token}`);
}
}

Result:
GET /api/users HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

NIVEL 6: Server Response Handling
──────────────────────────────────────────────────────────────────────────
Si servidor responde 401:
├─ authMiddleware detecta: isRejectedWithValue(action).status === 401
├─ store.dispatch(logout())
├─ useTokenValidation() también detecta cambio
├─ Redux state actualiza: isAuthenticated = false
├─ redux-persist guarda cambio a localStorage
└─ ProtectedRoute redirige a /login

Si servidor responde 200:
├─ tokenExpirationTime se actualiza
├─ Si faltan < 5 min
│ └─ TokenExpirationWarning muestra alerta
└─ Usuario puede seguir navegando

🔐 MECANISMOS DE PROTECCIÓN
════════════════════════════════════════════════════════════════════════════

1. **Sincronización Activa**
   • useTokenValidation compara localStorage vs Redux
   • Si no coinciden → logout inmediato
   • Detecta si usuario eliminó token manualmente

2. **Validación de Formato**
   • isValidTokenFormat() verifica estructura JWT
   • Token debe tener exactamente 3 partes (header.payload.sig)
   • Cada parte debe ser base64 válido

3. **Verificación de Expiración**
   • isTokenExpired() decodifica y verifica claim 'exp'
   • Buffer de 1 minuto: logout si exp - 60s < now
   • Previene requests con token casi expirado

4. **Monitoreo en Tiempo Real**
   • watchTokenChanges() escucha cambios en otras pestañas
   • Storage event triggered cuando cambia localStorage
   • Sincroniza múltiples pestañas automáticamente

5. **Error 401 Handling**
   • authMiddleware captura respuestas 401
   • Logout automático sin retraso
   • No permite reintentos con token inválido

6. **localStorage Fallback**
   • Si localStorage no disponible, usa memory storage
   • App funciona pero sin persistencia
   • Al reload se pide login de nuevo

7. **Token Expiration Warning**
   • Alerta 5 minutos antes de expiración
   • Permite usuario tomar acciones antes de logout
   • Mejora UX significativamente

⚙️ CONFIGURACIÓN & UTILIZACIÓN
════════════════════════════════════════════════════════════════════════════

En ProtectedRoute (YA HECHO):
────────────────────────────────────────────────────────────────────────────
import { useTokenValidation } from "../hooks/useTokenValidation";

const ProtectedRoute = () => {
const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
const isRehydrated = useAppSelector(selectIsRehydrated);

useTokenValidation(); // ← Validar token

if (!isRehydrated) return <SplashScreen />;
if (!isTokenInStorage()) return <Navigate to="/login" />;
if (!isAuthenticated) return <Navigate to="/login" />;

return <Outlet />;
};

En componentes (OPCIONAL):
────────────────────────────────────────────────────────────────────────────
import { useTokenExpiration } from "../hooks/useTokenValidation";

const MyComponent = () => {
const { expiresIn, isExpired, reason } = useTokenExpiration();

if (expiresIn && expiresIn < 5 _ 60 _ 1000) {
return <p>⏰ Tu sesión expira en {expiresIn / 1000}s</p>;
}

return <div>Contenido</div>;
};

Para manual token verification:
────────────────────────────────────────────────────────────────────────────
import {
validateToken,
getTokenFromStorage
} from "../app/tokenVerification";

const token = getTokenFromStorage();
const validation = validateToken(token);

if (validation.isValid) {
console.log("Token válido, expira en", validation.expiresIn, "ms");
} else {
console.log("Token inválido:", validation.reason);
}

🧪 CASOS DE USO & PRUEBAS
════════════════════════════════════════════════════════════════════════════

CASO 1: Login → Reload (RUTA FELIZ)
──────────────────────────────────────────────────────────────────────────
Pasos:

1. Inicia sesión con credenciales
2. Presiona F5
3. Deberías ver SplashScreen brevemente
4. Luego dashboard (sin redirigir a /login)

Validaciones:
✓ localStorage['persist:root'] existe
✓ Contiene token y user
✓ Redux restaura automáticamente
✓ ProtectedRoute permite acceso

CASO 2: Token Expirado (SEGURIDAD)
──────────────────────────────────────────────────────────────────────────
Pasos:

1. Inicia sesión
2. Espera a que token expire (o simula con DevTools)
3. Intenta hacer request a API

Validaciones:
✓ baseQueryWithAuth detecta expiración
✓ No envía request al servidor
✓ ProtectedRoute redirige a /login
✓ useTokenValidation dispara logout

CASO 3: Token Eliminado Manualmente (SECURITY TEST)
──────────────────────────────────────────────────────────────────────────
Pasos:

1. Inicia sesión
2. Abre DevTools → Application → Local Storage
3. Selecciona clave 'persist:root' y elimina
4. Regresa a la aplicación o presiona F5

Validaciones:
✓ ProtectedRoute detecta: isTokenInStorage() = false
✓ Redirige a /login inmediatamente
✓ useTokenValidation detecta desincronización
✓ dispatch(logout()) automáticamente

CASO 4: Token Warning (UX)
──────────────────────────────────────────────────────────────────────────
Pasos:

1. Inicia sesión
2. Espera 55 minutos (o simula con DevTools manipulando exp)
3. Cuando falten < 5 minutos para expiración

Validaciones:
✓ TokenExpirationWarning aparece en UI
✓ Muestra tiempo restante (4m 30s)
✓ Usuario puede hacer logout o ignorar

CASO 5: Múltiples Pestañas (SINCRONIZACIÓN)
──────────────────────────────────────────────────────────────────────────
Pasos:

1. Abre app en Pestaña A → Login
2. Abre misma app en Pestaña B
3. En Pestaña A → Hace logout

Validaciones:
✓ Pestaña B detecta cambio de localStorage (Storage event)
✓ watchTokenChanges() se dispara
✓ Pestaña B redirige a /login automáticamente

CASO 6: Servidor Responde 401
──────────────────────────────────────────────────────────────────────────
Pasos:

1. Inicia sesión
2. Manipula token en DevTools (quita último carácter)
3. Intenta hacer request

Validaciones:
✓ baseQueryWithAuth envía header Authorization
✓ Servidor responde 401
✓ authMiddleware detecta error
✓ dispatch(logout()) automáticamente
✓ Usuario redirigido a /login

📊 CASOS EDGE & MANEJO DE ERRORES
════════════════════════════════════════════════════════════════════════════

❌ localStorage no disponible
✓ storage.ts fallback a memory
✓ App funciona normalmente
✓ No persiste al reload

❌ localStorage quota excedida
✓ storage.setItem() falla silenciosamente
✓ Fallback a memory continúa
✓ Log de warning en console

❌ JSON corrupto en localStorage
✓ getTokenFromStorage() intenta parse
✓ Si falla, devuelve null
✓ useTokenValidation detecta y dispara logout

❌ JWT inválido (formato)
✓ isValidTokenFormat() detecta
✓ No se envía request
✓ Logout automático

❌ JWT expirado (exp < now)
✓ isTokenExpired() detecta
✓ No se envía request
✓ Logout automático

❌ Network error en request
✓ RTK Query maneja como error normal
✓ useTokenValidation NO dispara logout
✓ Usuario puede reintentar

🎯 COMPORTAMIENTO ESPERADO
════════════════════════════════════════════════════════════════════════════

✅ DEBE PASAR:

1. Login → Reload → Permanece loggeado
   Evidencia: No ve /login, ve dashboard

2. Logout → Reload → Ve /login
   Evidencia: No puede acceder sin credenciales

3. Token expira → Logout automático
   Evidencia: Redirige a /login automáticamente

4. Token eliminado de localStorage → Logout automático
   Evidencia: useTokenValidation detecta y redirige

5. Servidor responde 401 → Logout automático
   Evidencia: authMiddleware dispara logout

6. Token válido → Requests funcionan normalmente
   Evidencia: API responde 200, datos se muestran

7. Token próximo a expirar → Alerta visible
   Evidencia: TokenExpirationWarning aparece

8. Múltiples pestañas → Sincronización automática
   Evidencia: Pestaña B se actualiza cuando A hace logout

❌ NUNCA DEBE PASAR:

1. Usuario loggeado sin token válido
2. Request enviado con token expirado
3. Token inválido en localStorage
4. Desincronización entre localStorage y Redux
5. Usuario ve dashboard sin estar autenticado
6. Logout no limpia estado completamente

📈 MONITOREO & DEBUGGING
════════════════════════════════════════════════════════════════════════════

Para verificar que todo funciona, abre DevTools → Console:

Debería ver logs como:
──────────────────────────────────────────────────────────────────────────
[auth] Token validado
[auth] Token rehydratado desde localStorage
[auth] Sincronización OK: localStorage === Redux
[auth] Token expira en: 3599000 ms (aprox 1 hora)

Si hay problemas:
──────────────────────────────────────────────────────────────────────────
⚠️ "Token inválido. Razón: Token expirado"
⚠️ "Token no sincronizado. Disparando logout..."
⚠️ "Token no encontrado en localStorage. Token sincronizado incorrectamente."
⚠️ "Respuesta 401 Unauthorized. Token inválido o expirado."

Verificar localStorage:
──────────────────────────────────────────────────────────────────────────
DevTools → Application → Local Storage → find "persist:root"

Deberías ver:
{
"auth": {
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": 1,
"name": "Juan",
"lastname": "Pérez",
"roles": ["ADMIN"],
"gender": "M",
"status": "ACTIVE"
},
"isAuthenticated": true,
"loading": false,
"error": null
}
}

═══════════════════════════════════════════════════════════════════════════
✅ SISTEMA LISTO PARA PRODUCCIÓN

Todas las credenciales y token están protegidos en localStorage.
Validación ocurre en múltiples niveles.
Auto-logout automático en caso de problemas.
Sincronización entre pestañas.
UX mejorada con advertencias.

═══════════════════════════════════════════════════════════════════════════
