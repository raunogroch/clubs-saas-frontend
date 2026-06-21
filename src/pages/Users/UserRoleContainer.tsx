import { useState } from "react";
import { Roles } from "../../common";
import type { User } from "../../core/interfaces";
import { useUsers } from "../../features/users";
import { UserRoleBox } from "../../components";

interface UserRoleContainerProps {
  role: Roles;
  searchValue: string;
  rolesCount: number;
  activeAssignmentId?: string;
  onEdit: (user: User) => void;
}

export const UserRoleContainer = ({
  role,
  searchValue,
  rolesCount,
  activeAssignmentId,
  onEdit,
}: UserRoleContainerProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { users, meta, isLoading, error } = useUsers({
    role,
    search: searchValue,
    page,
    limit: pageSize,
    assignmentId: activeAssignmentId,
  });

  const totalPages =
    meta?.totalPages ||
    meta?.lastPage ||
    Math.ceil((meta?.total || 0) / pageSize) ||
    1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <div className="mb-4">
      <UserRoleBox
        role={role}
        users={users}
        isLoading={isLoading}
        error={error}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        total={meta?.total}
        rolesCount={rolesCount}
        searchValue={searchValue}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onEdit={onEdit}
      />
    </div>
  );
};
