import { getRoleLabel, Roles } from "../../common";
import { Breadcumbs } from "../../components";
import {
  useModalManagement,
  useModalSaveHandler,
  useSearchSetup,
} from "../../core/hooks";
import type { User, UserPageProps } from "../../core/interfaces";
import { UserModal } from "../../modals";
import { UserRoleContainer } from "./UserRoleContainer";

export const UserSuperadminPage = (props: UserPageProps) => {
  const {
    isOpen: isModalOpen,
    selectedItem: selectedUser,
    isCreating,
    handleCreate,
    handleEdit,
    handleClose: handleCloseModal,
  } = useModalManagement<User>();

  const { searchValue } = useSearchSetup();

  // Get all role options based on props
  const allRoles: Roles[] =
    props.roleList === "*" || !props.roleList
      ? (Object.keys(getRoleLabel) as Roles[])
      : (props.roleList as Roles[]);

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
      <Breadcumbs
        title="Usuarios"
        items={[
          { label: "Inicio", route: "/dashboard" },
          { label: "Usuarios" },
        ]}
      >
        <button
          className="btn btn-rounded btn-primary"
          onClick={handleCreate}
          aria-label="Crear"
        >
          <i className="fa fa-plus" />
          &nbsp;Crear
        </button>
      </Breadcumbs>

      <UserModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedUser}
        onSaved={handleSaved}
        roleList={props.roleList}
      />

      <div className="wrapper wrapper-content animated fadeInRight">
        {allRoles.map((role) => (
          <UserRoleContainer
            key={role}
            role={role}
            searchValue={searchValue}
            rolesCount={allRoles.length}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </>
  );
};
