import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Customer.module.scss";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineRollback } from "react-icons/ai";


const Customer = (props) => {
  const [user, setUser] = useState({});
  const location = useLocation();

  useEffect(() => {
    const data = location.state;
    console.log(data);
    setUser(data);
  }, [user]);

  return (
    <div className={styles.customer}>
      <div className={styles.container}>
        <Link to="/customers">
          <div className={styles.back}>
            <button>
              <AiOutlineRollback />
            </button>
          </div>
        </Link>
        <FaUserCircle className={styles.avatar} />
        <h1 className={styles.name}>{user.displayName}</h1>
        <p>{user.email}</p>
        <p>Total Balance : {user.balance}</p>
      </div>
    </div>
  );
};

export default Customer;
