import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import db from '../db';
import firebase from 'firebase/compat/app';


export default function JournalEntry() {
    const { id } = useParams();
    const [entry, setEntry] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [user, setUser] = useState({})


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

                const docRef = doc(db, "users", user.uid, "journal-entries", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data());
                setEntry(docSnap.data());
                setHasError(false)
                setIsLoading(false)

                } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
                throw new Error()
                }

            } catch {
                // error
                setHasError(true)
                setIsLoading(false)
            }
        }

        getData()
    }, [user.uid, id])

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (hasError) {
        return <p>Error!</p>
    }

    return (
        <div>
            <h1>Journal Entry: {id}</h1>
            <p>{entry.entry}</p>
        </div>
    );
}
