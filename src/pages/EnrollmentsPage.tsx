import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcumbs, IBox } from "../components";
import { AthleteEnrollmentModal } from "../modals/AthleteEnrollmentModal";
import { useGroups } from "../features/groups/groupHooks";
import { useGroupEnrollments } from "../features/groups/groupRelationsHooks";
import { useAssignmentPersistence } from "../core/hooks";
import { useAuthManager } from "../features/auth/useAuthManager";
import { useSearchSetup } from "../core/hooks/useSearchSetup";
import { getEnrollmentStatusLabel } from "../common/translations";
import type { User } from "../core/interfaces";
import { useGetUsersQuery } from "../features/users/userApi";

export const EnrollmentsPage = () => {
  const navigate = useNavigate();
  const { clubId, groupId } = useParams<{
    clubId?: string;
    groupId?: string;
  }>();
  const { activeAssignmentId } = useAuthManager();
  const { assignmentId: persistedAssignmentId, clubId: persistedClubId } =
    useAssignmentPersistence();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { searchValue } = useSearchSetup();

  const activeClubId = clubId || persistedClubId;
  const resolvedAssignmentId =
    persistedAssignmentId || activeAssignmentId || "";

  const {
    groups,
    isLoading,
    error,
    refetch: refetchGroups,
  } = useGroups({
    page: 1,
    limit: 100,
    clubId: activeClubId,
  });

  const activeGroup = useMemo(
    () => groups.find((item) => item.id === groupId) ?? null,
    [groups, groupId],
  );

  const { enrollments, refetch: refetchEnrollments } =
    useGroupEnrollments(groupId);
  const { data: usersResponse } = useGetUsersQuery(
    {
      page: 1,
      limit: 200,
      assignmentId: resolvedAssignmentId || undefined,
    },
    {
      skip: !resolvedAssignmentId,
    },
  );

  useEffect(() => {
    if (!activeClubId || !groupId) {
      navigate("/clubs", { replace: true });
    }
  }, [activeClubId, groupId, navigate]);

  const handleEnrollmentSaved = () => {
    void refetchEnrollments();
    void refetchGroups();
  };

  const pageTitle = activeGroup?.name || "Inscripciones";

  const athleteLookup = useMemo(() => {
    const users = usersResponse?.data ?? [];
    return new Map((users as User[]).map((user) => [user.id, user]));
  }, [usersResponse]);

  const filteredEnrollments = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return enrollments;
    }

    return enrollments.filter((enrollment) => {
      const athlete =
        enrollment.athlete ?? athleteLookup.get(enrollment.athleteId) ?? null;
      const fullName = [athlete?.name, athlete?.lastname]
        .filter(Boolean)
        .join(" ")
        .trim()
        .toLowerCase();

      return fullName.includes(normalizedSearch);
    });
  }, [athleteLookup, enrollments, searchValue]);

  const getAthleteDisplay = (enrollment: (typeof enrollments)[number]) => {
    const athlete =
      enrollment.athlete ?? athleteLookup.get(enrollment.athleteId) ?? null;
    const fullName = [athlete?.name, athlete?.lastname]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      fullName: fullName || "Sin nombre",
      dni: athlete?.dni ? `CI ${athlete.dni}` : null,
    };
  };

  const handleEditUser = (enrollment: (typeof enrollments)[number]) => {
    const athlete =
      enrollment.athlete ?? athleteLookup.get(enrollment.athleteId) ?? null;
    if (!athlete) {
      return;
    }

    setSelectedUser(athlete as User);
    setIsModalOpen(true);
  };

  return (
    <>
      <Breadcumbs
        title={pageTitle}
        items={[
          { label: "Inicio", route: "/dashboard" },
          { label: "Clubs", route: "/clubs" },
          { label: "Grupos", route: `/clubs/${activeClubId}/groups` },
          { label: "Inscripciones" },
        ]}
      >
        <button
          className="btn btn-rounded btn-sm btn-primary"
          onClick={() => setIsModalOpen(true)}
          disabled={!activeGroup || !resolvedAssignmentId}
        >
          <i className="fa fa-plus" /> Registrar atleta
        </button>
      </Breadcumbs>

      <div className="wrapper wrapper-content animated fadeInRight">
        <IBox title="Inscripciones del grupo">
          {!activeGroup && !isLoading && (
            <div className="alert alert-warning">
              No se encontró el grupo solicitado.
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {isLoading && <p className="text-info">Cargando inscripciones...</p>}

          {!isLoading && activeGroup && (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Atleta</th>
                      <th>DNI</th>
                      <th>Estado</th>
                      <th>Fecha de inscripcion</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnrollments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-muted text-center">
                          No hay atletas inscritos aún o no coinciden con la
                          búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredEnrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td className="align-middle">
                            <div className="fw-semibold">
                              {(() => {
                                const athleteDisplay =
                                  getAthleteDisplay(enrollment);
                                return athleteDisplay.fullName;
                              })()}
                            </div>
                          </td>
                          <td className="align-middle">
                            {(() => {
                              const athleteDisplay =
                                getAthleteDisplay(enrollment);
                              return athleteDisplay.dni || "-";
                            })()}
                          </td>
                          <td className="align-middle">
                            <span className="badge bg-info">
                              {getEnrollmentStatusLabel(enrollment.status)}
                            </span>
                          </td>
                          <td className="align-middle">
                            {enrollment.joinedAt || enrollment.createdAt
                              ? new Date(
                                  (enrollment.joinedAt ||
                                    enrollment.createdAt) as string,
                                ).toLocaleDateString("es-ES")
                              : "Sin fecha"}
                          </td>
                          <td className="align-middle">
                            <button
                              className="btn btn-sm btn-rounded btn-primary"
                              onClick={() => handleEditUser(enrollment)}
                            >
                              <i className="fa fa-edit me-1" /> Editar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </IBox>
      </div>

      <AthleteEnrollmentModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSaved={handleEnrollmentSaved}
        groupId={activeGroup?.id}
        assignmentId={resolvedAssignmentId}
        clubId={activeGroup?.clubId}
        athlete={selectedUser}
      />
    </>
  );
};
