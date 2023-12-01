import React, { useEffect, useState } from "react";
import { database } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import {
	Table,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
	IconButton,
	TablePagination,
	Container,
	Box,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const VisualizarCorretores = () => {
	const [dados, setDados] = useState([]);
	const [dadosAgenda, setDadosAgenda] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [action, setAction] = useState(1);

	const actions = [{ actionText: "Formulário" }, { actionText: "Agenda" }];

	useEffect(() => {
		// Carregar dados do banco de dados
		const dbRef = ref(
			database,
			"hub-indcon/painel-administrativo/corretores/formulario"
		);
		onValue(dbRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				const dataArray = Object.values(data);
				setDados(dataArray);
			}
		});

		const dbRef2 = ref(
			database,
			"hub-indcon/painel-administrativo/corretores/agenda"
		);
		onValue(dbRef2, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				const dataArray = Object.values(data);
				setDadosAgenda(dataArray);
				console.log(dataArray);
			}
		});
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const abrirWhatsApp = (numero) => {
		const linkWhatsApp = `https://api.whatsapp.com/send?phone=${numero}`;
		window.open(linkWhatsApp, "_blank");
	};
	return (
		<Container maxWidth='xl'>
			<Box
				sx={{
					width: "100%",
					padding: ".2rem",
					display: "flex",
					gap: "1rem",
					marginBottom: "1rem",
				}}
			>
				{actions &&
					actions.map((ac, index) => (
						<Box
							key={index}
							onClick={() => setAction(index + 1)}
							sx={{
								width: "200px",
								textAlign: "center",
								color: "#007bff",
								height: "30px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: ".3rem 1rem",
								border: "1px solid #007bff",
								cursor: "pointer",
								boxShadow:
									action === index + 1
										? "0px 0px 10px 3px rgba(0,123,255,0.150)"
										: "none",
								backgroundColor:
									action === index + 1 ? "#f0f0f0" : "transparent",
							}}
						>
							{ac.actionText}
						</Box>
					))}
			</Box>

			{action === 1 && (
				<>
					<TableContainer component={Paper}>
						<Table>
							<TableHead
								sx={{
									backgroundColor: "#007bff",
								}}
							>
								<TableRow>
									<TableCell
										sx={{
											color: "white",
										}}
									>
										Nome Completo
									</TableCell>
									<TableCell
										sx={{
											color: "white",
										}}
									>
										E-mail
									</TableCell>
									<TableCell
										sx={{
											color: "white",
										}}
									>
										WhatsApp
									</TableCell>
									<TableCell
										sx={{
											color: "white",
										}}
									>
										Ações
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{dados
									.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
									.map((row, index) => (
										<TableRow key={index}>
											<TableCell>{row["Nome completo"]}</TableCell>
											<TableCell>{row["Email"]}</TableCell>
											<TableCell>{row["Telefone"]}</TableCell>
											<TableCell>
												<IconButton
													aria-label='Abrir WhatsApp'
													onClick={() =>
														abrirWhatsApp(row["Telefone"])
													}
												>
													<WhatsAppIcon color='success' />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</TableContainer>

					<TablePagination
						rowsPerPageOptions={[10, 25]}
						component='div'
						count={dados.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</>
			)}

			{action === 2 && (
				<>
					<TableContainer component={Paper}>
						<Table>
							<TableHead
								sx={{
									backgroundColor: "#007bff",
								}}
							>
								<TableRow>
									<TableCell
										sx={{
											color: "white",
										}}
									>
										Nome Agenda
									</TableCell>

									<TableCell
										sx={{
											color: "white",
										}}
									>
										WhatsApp
									</TableCell>
									<TableCell
										sx={{
											color: "white",
										}}
									>
										Ações
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{dadosAgenda
									.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
									.map((row, index) => (
										<TableRow key={index}>
											<TableCell>{row.display_name}</TableCell>
											<TableCell>{row.whatsapp}</TableCell>
											<TableCell>
												<IconButton
													aria-label='Abrir WhatsApp'
													onClick={() =>
														abrirWhatsApp(row.whatsapp)
													}
												>
													<WhatsAppIcon color='success' />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</TableContainer>

					<TablePagination
						rowsPerPageOptions={[10, 30, 50]}
						component='div'
						count={dadosAgenda.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</>
			)}
		</Container>
	);
};

export default VisualizarCorretores;
