import type { ReactNode } from "react";
import {
  Footer,
  NavHeader,
  Sidenav,
  TokenExpirationWarning,
} from "../components";
import { SearchProvider } from "../core/context/SearchContext";
import { ActiveRoleProvider } from "../core/context/ActiveRoleContext";
import { useRoleRouteValidator } from "../hooks/useRoleRouteValidator";

interface MainProps {
  children: ReactNode;
}
const MainContent = ({ children }: MainProps) => {
  useRoleRouteValidator();

  return (
    <>
      <Sidenav />

      <div id="page-wrapper" className="gray-bg">
        <SearchProvider>
          <NavHeader />

          {children}
        </SearchProvider>

        <Footer companyName="CoderSoft" range="2024-2027" />
      </div>

      <TokenExpirationWarning />
    </>
  );
};

export const Main = ({ children }: MainProps) => {
  return (
    <div id="wrapper">
      <ActiveRoleProvider>
        <MainContent>{children}</MainContent>
      </ActiveRoleProvider>
    </div>
  );
};
