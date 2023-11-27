import {
	Container,
	Box,
	Button,
	Input,
	Snackbar,
	Table,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
} from "@mui/material";
import React, { useState } from "react";
import { database } from "../firebase/firebase";
import { ref, push } from "firebase/database";
import * as XLSX from "xlsx";

const CadastrarCorretores = () => {
	const [file, setFile] = useState(null);
	const [data, setData] = useState([]);
	const [message, setMessage] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);

		// Limpa os dados anteriores ao selecionar um novo arquivo
		setData([]);
	};

	const lerPlanilha = async () => {
		setMessage(true);
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const workbook = XLSX.read(e.target.result, { type: "binary" });
				const sheetName = workbook.SheetNames[0]; // Assumindo que você quer a primeira planilha

				const sheet = workbook.Sheets[sheetName];
				const dataToUpload = XLSX.utils.sheet_to_json(sheet);

				setData(dataToUpload);

				setSnackbarMessage("Planilha enviada com sucesso");
				setSnackbarOpen(true);
			};
			reader.readAsBinaryString(file);
		}
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const cadastrarPlanilha = async () => {
		if (data.length > 0) {
			const dbRef = ref(
				database,
				"hub-indcon/painel-administrativo/corretores/formulario"
			);

			try {
				for (const item of data) {
					console.log(item);
					await push(dbRef, item);
				}

				setSnackbarMessage("Planilha cadastrada com sucesso");
				setSnackbarOpen(true);
				setData([]);
				setFile(null);
			} catch (error) {
				setSnackbarMessage(
					"Erro ao cadastrar a planilha: " + error.message
				);
				setSnackbarOpen(true);
				setData([]);
				setFile(null);
			}
		} else {
			setSnackbarMessage("Nenhum dado para cadastrar");
			setSnackbarOpen(true);
		}
	};

	return (
		<Container maxWidth='xl'>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					paddingTop: "2rem",
				}}
			>
				<Input type='file' onChange={handleFileChange} />

				{data.length > 0 && (
					<TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
						<Table>
							<TableHead>
								<TableRow>
									{Object.keys(data[0]).map((header) => (
										<TableCell key={header}>{header}</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map((row, index) => (
									<TableRow key={index}>
										{Object.values(row).map((value, idx) => (
											<TableCell key={idx}>{value}</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}

				<Button
					onClick={data.length > 0 ? cadastrarPlanilha : lerPlanilha}
					variant='contained'
					color='primary'
					sx={{
						marginTop: "1rem",
					}}
				>
					{data.length > 0 ? "Confirmar e cadastrar" : "Enviar planilha"}
				</Button>
			</Box>

			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleSnackbarClose}
				message={snackbarMessage}
			/>
		</Container>
	);
};

export default CadastrarCorretores;
