import React, { useEffect, useState } from "react";
import styles from "../styles/Transfer.module.scss";
import Layout from "../components/Layout";
import { BiTransferAlt } from "react-icons/bi";
import {
  addDoc,
collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Transfer = () => {
  let date = new Date();
  let formattedDate = date.toISOString();

  const navigate = useNavigate();

  const [sender, setSender] = useState("select");
  const [receiver, setReceiver] = useState("select");
  const usersRef = collection(db, "users");
  const [users, setUsers] = useState([]);
  const [transferAmt, setTransferAmt] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Fetching All Users
    const getUsers = async () => {
      const data = await getDocs(usersRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data() })));
    };

    getUsers();
  }, []);

  const handleTransfer = async () => {
    if (sender !== "select" && receiver !== "select") {
      console.log("Sender : ", sender);
      console.log("Receiver : ", receiver);
      if (sender === receiver) {
        setErrorMsg("Please Don't Test Me and Enter Valid Sender And Receiver");
        return;
      }

      // Get Details of Both Users
      const senderRef = doc(db, "users", sender);
      const senderSnap = await getDoc(senderRef);

      const receiverRef = doc(db, "users", receiver);
      const receiverSnap = await getDoc(receiverRef);

      if (senderSnap.exists()) {
        if (receiverSnap.exists()) {
          const senderBalance = senderSnap.data().balance;
          const receiverBalnace = receiverSnap.data().balance;

          if (transferAmt <= 0) {
            setErrorMsg("Please Enter Valid Amount");
            return;
          }
          if (senderBalance < transferAmt) {
            setErrorMsg("Insufficient Amount To be Transferred");
            return;
          }
          const senderRemainingBalance =
            Number(senderBalance) - Number(transferAmt);
          const receiverUpdatedBalance =
            Number(receiverBalnace) + Number(transferAmt);

          await updateDoc(senderRef, {
            balance: senderRemainingBalance,
          });

          // Entering Debit Data to Database
          try {
            const transactionRef = await addDoc(
              collection(db, "transactions"),
              {
                debit: transferAmt,
                credit: 0,
                username: senderSnap.data().displayName,
                balance: senderRemainingBalance,
                desc: `Transfer to ${receiverSnap.data().displayName}`,
                timestamp: formattedDate,
              }
            );
            setErrorMsg("");
            setSuccessMsg("Transferring......");
          } catch (err) {
            setErrorMsg("Error While Updating Debit Amt.");
          }

          await updateDoc(receiverRef, {
            balance: receiverUpdatedBalance,
          });

          // Entering Credit Data to Database
          try {
            const transactionRef = await addDoc(
              collection(db, "transactions"),
              {
                debit: 0,
                credit: transferAmt,
                username: receiverSnap.data().displayName,
                balance: receiverUpdatedBalance,
                desc: `Received from ${senderSnap.data().displayName}`,
                timestamp: formattedDate,
              }
            );
          } catch (err) {
            setErrorMsg("Error While Updating Credit Amt.");
          }
        } else {
          setErrorMsg("Error While Fetching Receiver's Details");
        }
      } else {
        setErrorMsg("Error While Fetching Sender's Details");
      }

      setSuccessMsg("Transaction Successfully Completed");
      setTimeout(() => {
        setTransferAmt(0);
        setSender("select");
        setReceiver("select");
        navigate("/");
      }, 3000);
    } else {
      setErrorMsg("Please Select Sender And Receiver");

      console.log("Please Select Sender and Receiver");
    }
  };
  return (
    <Layout>
      <div className={styles.transfer}>
        <div className={styles.title}>
          <h1>Transfer</h1>
        </div>
        <div className={styles.actions}>
          <div className={styles.action}>
            <label>Sender</label>
            <select value={sender} onChange={(e) => setSender(e.target.value)}>
              <option value="select">Please choose an sender</option>
              {users.map((user) => {
                return (
                  <option value={user.uid} key={user.uid}>
                    {user.displayName}{" "}
                  </option>
                );
              })}
            </select>
          </div>

          <div className={styles.transferLogo}>
            <BiTransferAlt />
          </div>
          <div className={styles.action}>
            <label>Receiver</label>
            <select
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            >
              <option value="select">Please choose an receiver</option>
              {users.map((user) => {
                return (
                  <option value={user.uid} key={user.uid}>
                    {user.displayName}{" "}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className={styles.getData}>
          <input
            type="text"
            placeholder="Enter Amount To Transfer"
            onChange={(e) => setTransferAmt(e.target.value)}
            value={transferAmt}
            required
          />
          <div className={styles.btn}>
            <button onClick={handleTransfer}>Transfer</button>
          </div>
        </div>
        {successMsg && (
          <div className={styles.successNote}>
            {successMsg} <br /> Returing Home
          </div>
        )}

        {errorMsg && <div className={styles.errorNote}>{errorMsg}</div>}
      </div>
    </Layout>
  );
};

export default Transfer;
