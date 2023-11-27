import React from "react";
import TopBar from "../components/Topbar";

const Layout = ({ children }) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "0px",
				margin: "0px",
			}}
		>
			<TopBar />
			<div style={{ flex: 1, padding: "10px" }}>{children}</div>
		</div>
	);
};

export default Layout;
