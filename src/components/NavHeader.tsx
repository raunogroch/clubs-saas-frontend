import { useNavigate } from "react-router";
import { NavHeaderSearch } from "./NavHeaderSearch";
import { Button } from "./Button";
import { useAuth } from "../auth/AuthContext";
import { ButtonForm } from "./ButtonForm";

export const NavHeader = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  const handleMinimize = () => {
    document.body.classList.toggle("mini-navbar");
  };

  return (
    <div className="row border-bottom">
      <nav
        className="navbar navbar-static-top  "
        role="navigation"
        style={{ marginBottom: "0" }}
      >
        <div className="navbar-header">
          <ButtonForm
            className="navbar-minimalize minimalize-styl-2 btn btn-primary"
            type="button"
            onClick={handleMinimize}
          >
            <i className="fa fa-bars"></i>
          </ButtonForm>
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
