import { useEffect } from "react";
import { MenuMultiOption, MenuProfile, MenuSingleOption } from ".";
import { useAuthManager } from "../features/auth/authHooks";

declare global {
  interface JQuery {
    metisMenu: () => JQuery;
  }
}

export const Sidenav = () => {
  const location = window.location.pathname;
  const { user } = useAuthManager();

  useEffect(() => {
    // Reinitialize MetisMenu after React renders
    const $ = (window as any).$;
    if ($) {
      $("#side-menu").metisMenu();
    }
  }, []);

  // Mostrar nombre completo o un valor por defecto
  const displayName = user?.name
    ? `${user.name} ${user.lastname || ""}`.trim()
    : "Usuario";
  const displayRoles = user?.roles || [];

  return (
    <>
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">
            <li className="nav-header">
              <MenuProfile
                imageUrl="assets/img/profile_small.jpg"
                name={displayName}
                roles={displayRoles}
              />
              <div className="logo-element">
                <img
                  src="assets/img/olympics.svg"
                  alt="logo"
                  style={{ height: "20px" }}
                />
              </div>
            </li>

            <MenuSingleOption
              route={"/dashboard"}
              icon={"th-large"}
              name={"Dashboard"}
              active={location === "/dashboard"}
            />

            <MenuMultiOption
              route={"/mailbox"}
              icon="envelope"
              name="Mailbox"
              subItems={[
                { label: "Inbox", route: "/mailbox" },
                { label: "Email view", route: "/mail_detail" },
                { label: "Compose email", route: "/mail_compose" },
                { label: "Email templates", route: "/email_template" },
              ]}
            />

            <MenuMultiOption
              route={"/graphs"}
              icon={"bar-chart-o"}
              name={"Graphs"}
              label={{ text: "NEW", type: "warning" }}
              subItems={[
                { label: "Flot Charts", route: "/graph_flot" },
                { label: "Morris.js Charts", route: "/graph_morris" },
                { label: "Rickshaw Charts", route: "/graph_rickshaw" },
                { label: "Chart.js", route: "/graph_chartjs" },
                { label: "Chartist", route: "/graph_chartist" },
                { label: "c3 charts", route: "/c3" },
                { label: "Peity Charts", route: "/graph_peity" },
                { label: "Sparkline Charts", route: "/graph_sparkline" },
              ]}
            />

            <MenuSingleOption
              route={"/layouts"}
              icon={"fa fa-diamond"}
              name={"Layouts"}
            />
          </ul>
        </div>
      </nav>
    </>
  );
};
