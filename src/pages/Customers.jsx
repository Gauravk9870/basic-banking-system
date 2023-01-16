import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import styles from "../styles/Customers.module.scss";
import Layout from "../components/Layout";

const Customers = () => {
  const usersRef = collection(db, "users");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data() })));
    };

    getUsers();
  }, []);

  return (
    <Layout>
      <div className={styles.customers}>
        <div className={styles.title}>
          <h1>Customers</h1>
        </div>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th className={styles.hidden_sm}>Email</th>
                <th className={styles.hidden_sm}>ID</th>
                <th>Balance</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user.uid}>
                    <td>{user.displayName}</td>
                    <td className={styles.hidden_sm}>{user.email}</td>
                    <td className={styles.hidden_sm}>{user.uid}</td>
                    <td>{user.balance}</td>
                    <td>
                      <Link
                        to={`/customer/${user.uid}`}
                        state={user}
                        className={styles.btn}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Customers;
