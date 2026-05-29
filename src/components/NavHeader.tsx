import { Link, useNavigate } from "react-router";
import { NavHeaderSearch } from "./NavHeaderSearch";
import { Button } from "./Button";
import { useAuth } from "../auth/AuthContext";

export const NavHeader = () => {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <div className="row border-bottom">
      <nav
        className="navbar navbar-static-top  "
        role="navigation"
        style={{ marginBottom: "0" }}
      >
        <div className="navbar-header">
          <Link
            className="navbar-minimalize minimalize-styl-2 btn btn-primary"
            to="#"
          >
            <i className="fa fa-bars"></i>
          </Link>
          <NavHeaderSearch />
        </div>
        <ul className="nav navbar-top-links navbar-right">
          <li>
            <span className="m-r-sm text-muted welcome-message">
              Bienvenido a la Plataforma ClubSphere
            </span>
          </li>
          <li>
            <Button
              text="Log out"
              icon={{ icon: "fa fa-sign-out" }}
              onClick={handleLogout}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};
