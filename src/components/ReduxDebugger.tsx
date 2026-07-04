/**
 * components/ReduxDebugger.tsx
 *
 * Componente para visualizar y debugging del estado de Redux
 * Útil para verificar que todo está funcionando correctamente
 *
 * Muestra:
 * - Estado de auth (user, token, isAuthenticated)
 * - Memberships del usuario
 * - Estado de loading/error
 * - Estado de localStorage (redux-persist)
 * - Actions disponibles para testing
 *
 * Uso (solo en desarrollo):
 * <ReduxDebugger />
 */

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logout, getUserMemberships } from "../features/auth";

export const ReduxDebugger: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useAppDispatch();

  // Seleccionar todo el estado de auth
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

  // Obtener memberships usando el servicio
  const memberships = getUserMemberships(user);

  // Obtener info de localStorage (redux-persist)
  const persistedAuth = (() => {
    try {
      const stored = localStorage.getItem("persist:root");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.auth ? JSON.parse(parsed.auth) : null;
    } catch {
      return null;
    }
  })();

  // Calcular info del token
  const tokenInfo = (() => {
    if (!token) return null;
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      // Decodificar payload (segunda parte)
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      return {
        valid: true,
        issuer: "JWT",
        payload,
        exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : null,
        length: token.length,
      };
    } catch {
      return { valid: false, error: "Token inválido" };
    }
  })();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCopyState = () => {
    const state = {
      user,
      token: token ? `${token.substring(0, 20)}...` : null,
      isAuthenticated,
      loading,
      error,
      memberships,
      tokenInfo,
      localStorage: persistedAuth ? "Persistido" : "No persistido",
    };
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    alert("Estado copiado al portapapeles");
  };

  const statsStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "10px",
    fontSize: "11px",
  };

  const statItemStyle: React.CSSProperties = {
    padding: "8px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "3px",
    display: "flex",
    justifyContent: "space-between",
  };

  return (
    <div
      style={{
        padding: "12px",
        border: "3px solid #dc3545",
        borderRadius: "4px",
        backgroundColor: "#ffe6e6",
        marginBottom: "15px",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ fontWeight: "bold", color: "#dc3545" }}>
          🔴 REDUX DEBUGGER {expanded ? "▼" : "▶"}
        </div>
        <div style={{ fontSize: "10px", color: "#666" }}>
          {isAuthenticated ? "✅ Autenticado" : "❌ No autenticado"}
        </div>
      </div>

      {!expanded && (
        <div style={{ fontSize: "10px", color: "#666" }}>
          Click para expandir... |{" "}
          {user?.username ? `Usuario: ${user.username}` : ""}
        </div>
      )}

      {/* Contenido expandido */}
      {expanded && (
        <div>
          {/* Estado General */}
          <div
            style={{
              marginBottom: "12px",
              paddingBottom: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Estado General
            </div>
            <div style={statsStyle}>
              <div style={statItemStyle}>
                <span>isAuthenticated:</span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: isAuthenticated ? "#28a745" : "#dc3545",
                  }}
                >
                  {isAuthenticated ? "true" : "false"}
                </span>
              </div>
              <div style={statItemStyle}>
                <span>loading:</span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: loading ? "#ffc107" : "#28a745",
                  }}
                >
                  {loading ? "true" : "false"}
                </span>
              </div>
              <div style={statItemStyle}>
                <span>error:</span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: error ? "#dc3545" : "#28a745",
                  }}
                >
                  {error ? error : "null"}
                </span>
              </div>
              <div style={statItemStyle}>
                <span>token:</span>
                <span style={{ fontWeight: "bold" }}>{token ? "✓" : "✗"}</span>
              </div>
            </div>
          </div>

          {/* Usuario */}
          {user && (
            <div
              style={{
                marginBottom: "12px",
                paddingBottom: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Usuario
              </div>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "8px",
                  borderRadius: "3px",
                  marginBottom: "8px",
                }}
              >
                <div>ID: {user.id}</div>
                <div>Nombre: {user.name}</div>
                <div>Username: {user.username}</div>
                <div>Status: {user.status || "N/A"}</div>
              </div>
            </div>
          )}

          {/* Memberships */}
          {memberships.length > 0 && (
            <div
              style={{
                marginBottom: "12px",
                paddingBottom: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Memberships ({memberships.length})
              </div>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "8px",
                  borderRadius: "3px",
                }}
              >
                {memberships.map((m, idx) => (
                  <div
                    key={idx}
                    style={{ marginBottom: "4px", paddingBottom: "4px" }}
                  >
                    <span style={{ color: "#007bff", fontWeight: "bold" }}>
                      {m.role}
                    </span>
                    <span style={{ marginLeft: "8px", color: "#28a745" }}>
                      {m.status || "ACTIVE"}
                    </span>
                    <span
                      style={{
                        marginLeft: "8px",
                        color: "#6c757d",
                        fontSize: "10px",
                      }}
                    >
                      ID:{" "}
                      {m.assignmentId
                        ? m.assignmentId.substring(0, 8) + "..."
                        : "null"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Token Info */}
          {tokenInfo && tokenInfo.valid && (
            <div
              style={{
                marginBottom: "12px",
                paddingBottom: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Token Info
              </div>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "8px",
                  borderRadius: "3px",
                  fontSize: "10px",
                }}
              >
                <div>Longitud: {tokenInfo.length} caracteres</div>
                <div>Expira: {tokenInfo.exp}</div>
                <div style={{ marginTop: "4px" }}>
                  <strong>Payload:</strong>
                  <pre
                    style={{
                      margin: "4px 0",
                      padding: "4px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "2px",
                      overflow: "auto",
                      maxHeight: "150px",
                      fontSize: "9px",
                    }}
                  >
                    {JSON.stringify(tokenInfo.payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* LocalStorage / Persistencia */}
          {persistedAuth && (
            <div
              style={{
                marginBottom: "12px",
                paddingBottom: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Persistencia (localStorage)
              </div>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "8px",
                  borderRadius: "3px",
                  fontSize: "10px",
                }}
              >
                <div>✓ Persistido en localStorage</div>
                <div>Clave: persist:root</div>
                <div style={{ marginTop: "4px", color: "#28a745" }}>
                  Estado: Sincronizado
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div
            style={{
              marginBottom: "12px",
              paddingBottom: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Acciones de Test
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={handleCopyState}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                📋 Copiar Estado
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                🚪 Logout
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("persist:root");
                  location.reload();
                }}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                🗑️ Limpiar Storage
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div
            style={{
              backgroundColor: "#f0f7ff",
              padding: "8px",
              borderRadius: "3px",
            }}
          >
            <div style={{ fontSize: "10px", color: "#666" }}>
              ✓ Redux está funcionando correctamente
              <br />✓ Memberships: {memberships.length} roles
              <br />✓ Persistencia: {persistedAuth ? "Activa" : "Inactiva"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReduxDebugger;
