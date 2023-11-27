import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export const Context = createContext();
export function AuthContext({ children }) {
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setLoading(false);
			currentUser ? setUser(currentUser) : setUser(null);
		});

		return () => {
			unsubscribe && unsubscribe();
		};
	}, []);

	const values = {
		user: user,
		setUser: setUser,
	};

	return (
		<Context.Provider value={values}>{!loading && children}</Context.Provider>
	);
}
