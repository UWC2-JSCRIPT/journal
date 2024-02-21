import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import db from "../db";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default function JournalEntry() {
  const { id } = useParams();
  const [entry, setEntry] = useState({});
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
        const docRef = doc(db, "users", user.uid, "journal-entries", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          setEntry(docSnap.data());
          setHasError(false);
          setIsLoading(false);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
          throw new Error();
        }
      } catch {
        // error
        setHasError(true);
        setIsLoading(false);
      }
    };

    getData();
  }, [user.uid, id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (hasError) {
    return <p>Error!</p>;
  }

  return (
    <div>
      <h1>Journal Entry: {id}</h1>
      <p>{entry.entry}</p>
    </div>
  );
}
