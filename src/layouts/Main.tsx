import type { ReactNode } from "react";
import {
  Footer,
  NavHeader,
  Sidenav,
  TokenExpirationWarning,
} from "../components";

interface MainProps {
  children: ReactNode;
}

export const Main = ({ children }: MainProps) => {
  return (
    <div id="wrapper">
      <Sidenav />

      <div id="page-wrapper" className="gray-bg">
        <NavHeader />

        {children}

        <Footer companyName="CoderSoft" range="2024-2027" />
      </div>

      {/* Mostrar advertencia cuando el token está próximo a expirar */}
      <TokenExpirationWarning />
    </div>
  );
};
