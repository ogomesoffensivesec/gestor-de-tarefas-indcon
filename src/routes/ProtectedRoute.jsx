import React, { useContext } from "react";
import { Context } from "..//context/AuthContext";
import { Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import TopBar from "../components/Topbar";

export function ProtectedRoute({ children }) {
	const { user } = useContext(Context);

	if (!user) {
		return <Navigate to='/login' />;
	} else {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<TopBar />
				<Box sx={{ flex: 1, backgroundColor: "#e9ecef", padding: "2rem" }}>
					{children}
				</Box>
			</Box>
		);
	}
}
