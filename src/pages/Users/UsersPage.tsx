import {
  useModalManagement,
  useModalSaveHandler,
  useSearchSetup,
  useRoleList,
} from "../../core/hooks";
import type { User, UserPageProps } from "../../core/interfaces";
import { UserModal } from "../../modals";
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
    refetch: async () => {
      // Refetch is handled at the container level
    },
    onModalClose: handleCloseModal,
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
            onEdit={handleEdit}
          />
        ))}
      </div>
    </>
  );
};
