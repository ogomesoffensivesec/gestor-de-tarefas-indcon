import { Box, Container } from "@mui/material";
import React from "react";
import TabelaEmpreendimento from "../components/TabelaEmpreendimento";

const VisualizarImoveis = () => {
	return (
		<Container maxWidth='xl'>
			<Box
				sx={{
					marginY: 10,
					width: "100%",
				}}
			>
				<TabelaEmpreendimento />
			</Box>
		</Container>
	);
};

export default VisualizarImoveis;
