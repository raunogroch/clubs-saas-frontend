/**
 * components/MembershipsDebugger.tsx
 *
 * Componente para visualizar memberships del usuario actual
 * Útil para debugging y verificar que los memberships se cargan correctamente
 *
 * Uso:
 * <MembershipsDebugger />
 *
 * Esto se usa solo en desarrollo/debugging
 */

import React from "react";
import { useAuth } from "../core/hooks";
import { getUserMemberships } from "../features/auth/membershipService";

export const MembershipsDebugger: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const memberships = getUserMemberships(user);

  return (
    <div
      style={{
        padding: "10px",
        border: "2px solid #007bff",
        borderRadius: "4px",
        marginBottom: "10px",
        backgroundColor: "#f0f7ff",
        fontSize: "12px",
        fontFamily: "monospace",
      }}
    >
      <div style={{ marginBottom: "5px", fontWeight: "bold" }}>
        👤 Memberships del Usuario
      </div>

      <div style={{ marginBottom: "8px", fontSize: "11px" }}>
        <strong>User:</strong> {user.name} ({user.username})
      </div>

      {memberships.length === 0 ? (
        <div style={{ color: "#dc3545" }}>❌ No hay memberships</div>
      ) : (
        <div>
          <div style={{ marginBottom: "5px", fontSize: "11px" }}>
            <strong>Total Roles:</strong> {memberships.length}
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: "0",
              margin: "5px 0",
            }}
          >
            {memberships.map((membership, idx) => (
              <li
                key={idx}
                style={{
                  padding: "5px",
                  marginBottom: "4px",
                  backgroundColor: "#fff",
                  border: "1px solid #dee2e6",
                  borderRadius: "3px",
                  fontSize: "11px",
                }}
              >
                <span style={{ color: "#007bff", fontWeight: "bold" }}>
                  {membership.role}
                </span>
                <span style={{ marginLeft: "8px", color: "#666" }}>
                  Status:{" "}
                  <span style={{ color: "#28a745" }}>
                    {membership.status || "N/A"}
                  </span>
                </span>
                <span style={{ marginLeft: "8px", color: "#666" }}>
                  ID:{" "}
                  <span style={{ color: "#6c757d" }}>
                    {membership.assignmentId
                      ? membership.assignmentId.substring(0, 8) + "..."
                      : "null"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MembershipsDebugger;
