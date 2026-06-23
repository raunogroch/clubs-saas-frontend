import {
  useModalManagement,
  useModalSaveHandler,
  useSearchSetup,
  useRoleList,
} from "../../core/hooks";
import type { User, UserPageProps } from "../../core/interfaces";
import { UserModal } from "../../modals";
import { useAuthManager } from "../../features/auth/useAuthManager";
import { useActiveRole } from "../../core/context/useActiveRole";
import { Roles } from "../../common";
import { UserRoleContainer } from "./UserRoleContainer";
import { UsersPageHeader } from "./UsersPageHeader";

/**
 * UsersPage Component
 *
 * Responsabilidades:
 * - Orquestar modal management y búsqueda
 * - Renderizar UI basada en roleList resuelto dinámicamente
 *
 * Principios SOLID aplicados:
 * - SRP: Componente enfocado solo en orquestación y renderizado
 * - DIP: Depende de hooks para lógica de negocio, no de implementación directa
 * - OCP: Abierto a cambios en resolución de roleList sin modificar este componente
 */
export const UsersPage = (props: UserPageProps) => {
  const roleList = useRoleList(props.roleList);
  const { activeAssignmentId } = useAuthManager();
  const { activeRole } = useActiveRole();

  const {
    isOpen: isModalOpen,
    selectedItem: selectedUser,
    isCreating,
    handleCreate,
    handleEdit,
    handleClose: handleCloseModal,
  } = useModalManagement<User>();

  const { searchValue } = useSearchSetup();

  const handleSaved = useModalSaveHandler({
    isCreating,
    selectedItem: selectedUser,
    refetch: async () => {},
    onModalClose: handleCloseModal,
  });

  // Solo pasar assignmentId si el rol actual es ADMIN (no SUPER_ADMIN)
  // SUPER_ADMIN ve todos los ADMIN sin filtrar por assignmentId
  const assignmentIdForFilter: string | undefined =
    activeRole === Roles.ADMIN && activeAssignmentId
      ? activeAssignmentId
      : undefined;

  console.log("UsersPage", {
    activeRole,
    activeAssignmentId,
  });
  return (
    <>
      <UsersPageHeader onCreateClick={handleCreate} />

      <UserModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedUser}
        onSaved={handleSaved}
        roleList={roleList}
      />

      <div className="wrapper wrapper-content animated fadeInRight">
        {roleList.map((role) => (
          <UserRoleContainer
            key={role}
            role={role}
            searchValue={searchValue}
            rolesCount={roleList.length}
            activeAssignmentId={assignmentIdForFilter}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </>
  );
};
