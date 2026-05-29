import type { ReactNode } from "react";
import { Beadcumbs, Footer, NavHeader, Sidenav } from "../components";

interface MainProps {
  children: ReactNode;
}

export const Main = ({ children }: MainProps) => {
  return (
    <div id="wrapper">
      <Sidenav />

      <div id="page-wrapper" className="gray-bg">
        <NavHeader />

        <Beadcumbs title="Principal" />

        {children}

        <Footer companyName="CoderSoft" range="2024-2027" />
      </div>
    </div>
  );
};
