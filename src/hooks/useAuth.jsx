import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

// Rename the function to use the "use" prefix to follow the convention for custom hooks
export default function useVerifyUserAuthenticationState(url) {
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((userName) => {
			if (userName) {
				setCurrentUser(userName);
				navigate(`/${url}`);
			} else {
				setCurrentUser(null);
				navigate("/entrar");
			}
		});

		return () => unsubscribe();
	}, [navigate]);

	// Return any data or functions you want to expose
	return { currentUser };
}
