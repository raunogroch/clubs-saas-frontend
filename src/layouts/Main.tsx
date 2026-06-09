import type { ReactNode } from "react";
import {
  Footer,
  NavHeader,
  Sidenav,
  TokenExpirationWarning,
} from "../components";
import { SearchProvider } from "../core/context/SearchContext";
import { ActiveRoleProvider } from "../core/context/ActiveRoleContext";

interface MainProps {
  children: ReactNode;
}

export const Main = ({ children }: MainProps) => {
  return (
    <div id="wrapper">
      <ActiveRoleProvider>
        <Sidenav />

        <div id="page-wrapper" className="gray-bg">
          <SearchProvider>
            <NavHeader />

            {children}
          </SearchProvider>

          <Footer companyName="CoderSoft" range="2024-2027" />
        </div>

        <TokenExpirationWarning />
      </ActiveRoleProvider>
    </div>
  );
};
