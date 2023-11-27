import React, { useEffect, useState } from "react";
import TabelaUsuarios from "../components/TabelaUsuarios";
import { Box, Container, Typography } from "@mui/material";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebase";

const ViewUsuarios = () => {
	const [usuarios, setUsuarios] = useState([]);
	useEffect(() => {
		const usuariosRef = ref(
			database,
			"hub-indcon/painel-administrativo/usuarios"
		);

		onValue(usuariosRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const usuariosArray = Object.values(data);
				setUsuarios(usuariosArray);
			}
		});
	}, []);

	return (
		<Container maxWidth='xl'>
			<Box marginY={5}>
				<Typography variant='h4'>Tabela de usuários</Typography>
			</Box>
			<TabelaUsuarios users={usuarios} />
		</Container>
	);
};

export default ViewUsuarios;
