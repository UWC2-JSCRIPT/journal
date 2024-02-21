import React, {useEffect, useState}from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';

   // Listen to the Firebase Auth state and set the local state.
   
   
   export default function Nav() {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
   
    useEffect(() => {
     const unregisterAuthObserver = firebase.auth().onAuthgitStateChanged(user => {
         setUser(user)
         console.log(user.photoURL)
         // setIsSignedIn(!!user);
     });
     return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
   }, [user]);

   const handleSignout = () => {
    firebase.auth().signOut();
    navigate('/')
   }


    return (
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/journal">Journal</Link></li>
                <li><Link to="/journal/1">Journal Entry</Link></li>
            </ul>
            {user.displayName && user.displayName}
            {user.photoURL && <img src={user.photoURL} alt="jiji"/>}
            <button onClick={() => handleSignout()}>Sign Out</button>
        </div>
    );
}
