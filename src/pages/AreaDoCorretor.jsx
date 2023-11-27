import { Container, Grid, Box } from "@mui/material";
import React from "react";

const itemStyle = {
	width: "auto",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: 6,
	padding: 8,
	backgroundColor: "#007bff",
	boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
	cursor: "pointer",
	color: "white",
	fontWeight: "700",
	textAlign: "center",
	fontSize: "20px",
	transition: ".4s ease all",
	"&:hover": {
		backgroundColor: "#03045e",
	},
};
const options = [
	{
		option_name: "Destaques",
		option_id: 1,
	},

	{
		option_name: "Corretores",
		option_id: 3,
	},
];

const AreaDoCorretor = () => {
	return (
		<Container maxWidth='xl'>
			<Box
				sx={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: 5,
				}}
			>
				{options &&
					options.map((op) => <Box sx={itemStyle}>{op.option_name}</Box>)}
			</Box>
		</Container>
	);
};

export default AreaDoCorretor;
