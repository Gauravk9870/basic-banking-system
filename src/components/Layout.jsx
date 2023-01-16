import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Layout.module.scss";
import { AiOutlineRollback } from "react-icons/ai";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {currentRoute !== "/" && (
          <Link to="/">
            <div className={styles.back}>
              <button>
                <AiOutlineRollback />
              </button>
            </div>
          </Link>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
