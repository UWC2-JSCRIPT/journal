import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import db from "../db";
import { Link } from "react-router-dom";
import AddJournal from "./AddJournal";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState({});

  // Configure Firebase.
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  };
  firebase.initializeApp(config);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setUser(user);
      });

    return () => unregisterAuthObserver;
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      if (!user.uid) {
        return;
      }
      try {
        // const querySnapshot = await getDocs(collection(db, "journal-entries"));
        // console.log(querySnapshot.docs)
        // querySnapshot.forEach((doc) => {
        //   // doc.data() is never undefined for query doc snapshots
        // //   console.log(doc.id, " => ", doc.data());
        // });
        const journalQuery = query(
          collection(db, "users", user.uid, "journal-entries"),
          orderBy("createdAt", "desc"),
        );

        onSnapshot(journalQuery, (snapshot) => {
          // console.log("Current data: ", snapshot.docs);
          setEntries(snapshot.docs);
        });

        setIsLoading(false);
      } catch {
        setHasError(true);
        setIsLoading(false);
      }
    };

    getData();
    return () => onSnapshot;
  }, [user.uid]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "journal-entries", id));
  };

  const handleEdit = async (id) => {
    const newData = window.prompt("New Entry");
    await setDoc(doc(db, "journal-entries", id), {
      entry: newData,
      createdAt: new Date(),
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (hasError) {
    return <p>Error!</p>;
  }

  return (
    <div>
      <h1>Journal</h1>
      <AddJournal />
      {entries.map((entry) => {
        return (
          <div key={entry.id}>
            <p>{entry.data().entry}</p>
            <span>
              <Link to={`/journal/${entry.id}`}>View</Link>
            </span>
            <span>
              <button onClick={() => handleDelete(entry.id)}>DELETE</button>
              <button onClick={() => handleEdit(entry.id)}>Edit</button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
