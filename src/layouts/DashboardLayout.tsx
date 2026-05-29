import { Outlet } from "react-router-dom";
import { Main } from "./Main";

export const DashboardLayout = () => {
  return (
    <Main>
      <Outlet />
    </Main>
  );
};
