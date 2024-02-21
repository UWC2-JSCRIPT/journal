import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "../db";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

function AddJournal() {
  const [entry, setEntry] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(entry);

    const docRef = await addDoc(
      collection(db, "users", user.uid, "journal-entries"),
      {
        entry: entry,
        createdAt: new Date(),
      },
    );
    setEntry("");
    console.log("Document written with ID: ", docRef.id);
  };

  return (
    <>
      <h2>Add Journal Entry</h2>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="entry-input"></label>
        <textarea
          id="entry-input"
          onChange={(e) => setEntry(e.target.value)}
          value={entry}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default AddJournal;
