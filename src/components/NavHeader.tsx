import { Link } from "react-router";
import { NavHeaderSearch } from "./NavHeaderSearch";
import { Button } from "./Button";

export const NavHeader = () => {
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
              Welcome to INSPINIA+ Admin Theme.
            </span>
          </li>
          <li>
            <Button text="Log out" icon={{ icon: "fa fa-sign-out" }} />
          </li>
        </ul>
      </nav>
    </div>
  );
};
