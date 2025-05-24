import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
        Go back to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
