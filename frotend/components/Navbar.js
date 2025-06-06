import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}