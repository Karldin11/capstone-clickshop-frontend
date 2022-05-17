import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext, AdminContext } from "../../context/auth-context";
import * as Icon from "react-bootstrap-icons";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const administrator = useContext(AdminContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li>

      {auth.isLoggedIn && administrator.isAdmin && (
        <li>
          <NavLink to="/products/new">Add product</NavLink>
        </li>
      )}
      {auth.isLoggedIn && !administrator.isAdmin && (
        <li>
          <NavLink to="/checkout">
            {auth.quantity}
            <> </>
            <Icon.Cart />
          </NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
