import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import TabelEmpresas from "../components/TabelaEmpresas";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebase";
const VisualizarEmpresas = () => {
	const [empresas, setEmpresas] = useState([]);
	useEffect(() => {
		const empresasRef = ref(
			database,
			"hub-indcon/painel-administrativo/empresas"
		);

		onValue(empresasRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const empresasArray = Object.values(data);
				setEmpresas(empresasArray);
			}
		});
	}, []);

	return (
		<Container maxWidth='xl'>
			<Box marginY={5}>
				<Typography variant='h4'>Tabela das empresas</Typography>
			</Box>
			<TabelEmpresas empresas={empresas} />
		</Container>
	);
};

export default VisualizarEmpresas;

/*
 TABELA DE VISUALIZAÇÃO DAS EMPRESAS

*/
