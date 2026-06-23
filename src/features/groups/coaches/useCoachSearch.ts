import { useState } from "react";
import { useGetUsersQuery, type User } from "../../users";

export const useCoachSearch = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetUsersQuery(
    {
      role: "COACH",
      search,
      page: 1,
      limit: 20,
    },
    {
      skip: search.trim().length < 2,
    },
  );

  const coaches: User[] = data?.data ?? [];

  return {
    search,
    setSearch,
    coaches,
    isLoading,
  };
};
