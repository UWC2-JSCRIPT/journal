import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default function Nav() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

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

  const handleLogout = () => {
    firebase.auth().signOut();
    navigate("/");
  };

  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/journal">Journal</Link>
        </li>
        <li>
          <Link to="/journal/1">Journal Entry</Link>
        </li>
      </ul>
      {user && (
        <div>
          <p>{user.displayName}</p>
          <img src={user.photoURL} alt={`Avatar of ${user.displayName}`} />
          <button onClick={() => handleLogout()}>Log Out</button>
        </div>
      )}
    </div>
  );
}
