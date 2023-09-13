import React, { useContext } from "react";

import classes from "./Navigation.module.css";
import AuthContext from "../../store/auth-context";
import { Link } from "react-router-dom";

const Navigation = () => {
  const ctx = useContext(AuthContext);

  return (
    <nav className={classes.nav}>
      <ul>
        {!ctx.isLoggedIn && (
          <li>
            <Link to="/login/" className={classes.avatarLink}>
              <div className={classes.avatarContainer}>
                <img
                  src="https://placebear.com/250/250"
                  alt="Avatar"
                  className={classes.avatar}
                />
              </div>
              <span>Login</span>
            </Link>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <a href="/">Users</a>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <a href="/">Admin</a>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <button onClick={ctx.onLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
