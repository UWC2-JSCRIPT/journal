import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, onSnapshot,  query, orderBy, deleteDoc, setDoc } from "firebase/firestore";
import db from '../db'
import { Link } from 'react-router-dom';
import AddJournal from './AddJournal';
import firebase from 'firebase/compat/app';

export default function Journal() {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [user, setUser] = useState({})
    const [isSignedIn, setIsSignedIn] = useState(false)

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            console.log(user.uid)
            setUser(user)
            // setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
      }, [user.uid]);

    
    useEffect(() => {   
        if (!user.uid) {
            return
        }     
        const getData = async () => {
            try {
                // const querySnapshot = await getDocs(collection(db, "journal-entries"));
                // console.log(querySnapshot.docs)
                // querySnapshot.forEach((doc) => {
                    //   // doc.data() is never undefined for query doc snapshots
                    // //   console.log(doc.id, " => ", doc.data());
                    // }); 
                    if (user.uid) {
                        const journalQuery = query(collection(db, "users", user.uid ,"journal-entries"), orderBy("createdAt", 'desc'));
                             
                        onSnapshot(journalQuery, snapshot => {
                            // console.log("Current data: ", snapshot.docs);
                            setEntries(snapshot.docs)
                        });

                    }

                    setIsLoading(false)
            } catch (error) {
                console.error(error)
                setHasError(true)
                setIsLoading(false)
            }
        }

        getData();
        return () => onSnapshot;
    }, [user.uid])

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "journal-entries", id));
    }

    const handleEdit = async (id) => {
        const newData = window.prompt('New Entry')
        await setDoc(doc(db, "journal-entries", id), {
            entry: newData,
            createdAt: new Date()
          });

    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (hasError) {
        return <p>Error!</p>
    }

    return (
        <div>
            <h1>Journal</h1>
            <AddJournal />
            {entries.map(entry => {
                return <div key={entry.id}>
                    <p>{entry.data().entry}</p>
                    <span>

                    <Link to={`/journal/${entry.id}`}>View</Link>
                    </span>
                    <span>
                    <button onClick={() => handleDelete(entry.id)}>DELETE</button>
                    <button onClick={() => handleEdit(entry.id)}>Edit</button>
                    </span>
                    </div>
            })}
        </div>
    );
}


