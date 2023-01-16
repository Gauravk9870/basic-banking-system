import React, { useEffect, useState } from "react";
import styles from "../styles/Transactions.module.scss";
import Layout from "../components/Layout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Transactions = () => {
  const transactionRef = collection(db, "transactions");
  const [trans, setTrans] = useState([]);

  useEffect(() => {
    const getTransactions = async () => {
      const data = await getDocs(transactionRef);
      setTrans(data.docs.map((doc) => ({ ...doc.data() })));
    };
    getTransactions();
  }, []);

 
  const sortTransactions = (transactions) => {
    return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  console.log(trans);
  return (
    <Layout>
      <div className={styles.transactions}>
        <div className={styles.title}>
          <h1>Transactions</h1>
        </div>
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th className={styles.hidden_sm}>Date</th>
                <th>Name</th>
                <th>Desciption</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {sortTransactions(trans).map((transaction) => {
                return (
                  <tr key={transaction.uid}>
                    <td className={styles.hidden_sm}>{transaction.timestamp}</td>
                    <td>{transaction.username}</td>
                    <td>{transaction.desc}</td>
                    <td>{transaction.debit}</td>
                    <td>{transaction.credit}</td>
                    <td>{transaction.balance}</td>
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

export default Transactions;
