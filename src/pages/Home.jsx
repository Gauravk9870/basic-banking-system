import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";
import Logo from "../images/logo_small.png";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";

const Home = () => {
  const [users, setUsers] = useState([]);
  const usersRef = collection(db, "users");
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data() })));
    };
    getUsers();
  }, []);
  return (
    <Layout setRoute="Home">
      <div className={styles.home}>
        <div className={styles.logo}>
          <img src={Logo} alt="logo" />
        </div>
        <span>
          <h2>The Spark Foundation</h2>
          <h1>Basic Banking System</h1>
        </span>
        <div className={styles.btn}>
          <Link to="/customers">
            <button>Customers</button>
          </Link>
          <Link to="/transfer" state={users}>
            <button>Transfer</button>
          </Link>
          <Link to="/transactions">
            <button>Transactions</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
