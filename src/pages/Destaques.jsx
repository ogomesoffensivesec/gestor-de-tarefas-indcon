import {
	Box,
	Button,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { database } from "../firebase/firebase";
import PropTypes from "prop-types";
import { ref, onValue, set, push } from "firebase/database";
import { Delete } from "@mui/icons-material";

function CircularProgressWithLabel(props) {
	return (
		<Box sx={{ position: "relative", display: "inline-flex" }}>
			<CircularProgress variant='determinate' {...props} />
			<Box
				sx={{
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					position: "absolute",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Typography
					variant='caption'
					component='div'
					color='text.secondary'
				>
					{`${Math.round(props.value)}%`}
				</Typography>
			</Box>
		</Box>
	);
}

CircularProgressWithLabel.propTypes = {
	/**
	 * The value of the progress indicator for the determinate variant.
	 * Value between 0 and 100.
	 * @default 0
	 */
	value: PropTypes.number.isRequired,
};

const Destaques = () => {
	const [selectedOption, setSelectedOption] = useState(0);
	const [empreendimentos, setEmpreendimentos] = useState([]);
	const [carregando, setCarregando] = useState(false);
	const [destaques, setDestaques] = useState([]);
	const [destaque, setDestaque] = useState({
		empreendimento: "",
		textDestaque: "",
	});

	const [progress, setProgress] = React.useState(10);

	const options = [
		{
			id: 1,
			text: "Novo Destaque",
			action: null,
		},
		{
			id: 2,
			text: "Todos destaques",
			action: null,
		},
	];
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedToDelete, setSelectedToDelete] = useState(null);

	const handleOpenDialog = (index) => {
		setSelectedToDelete(destaques[index]);
		setOpenDialog(true);
	};
	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) =>
				prevProgress >= 100 ? 0 : prevProgress + 10
			);
		}, 800);
		return () => {
			clearInterval(timer);
		};
	}, []);
	useEffect(() => {
		const empreendimentosRef = ref(
			database,
			"hub-indcon/painel-administrativo/empreendimentos"
		);

		onValue(empreendimentosRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const empreendimentosArray = Object.values(data);
				setEmpreendimentos(empreendimentosArray);
			}
		});
		const destaquesRef = ref(
			database,
			"hub-indcon/painel-administrativo/destaques"
		);
		onValue(destaquesRef, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const destaquesArray = Object.values(data).map((item, index) => {
					return { ...item, id: Object.keys(data)[index] };
				});

				setDestaques(destaquesArray);
			}
		});
	}, []);
	const alterarCampos = (fieldPath) => (event) => {
		const fieldPathArray = fieldPath.split(".");
		let updatedValue = event.target.value;
		let updatedDestaque = { ...destaque };

		let currentField = updatedDestaque;
		for (let i = 0; i < fieldPathArray.length - 1; i++) {
			currentField = currentField[fieldPathArray[i]];
		}

		currentField[fieldPathArray[fieldPathArray.length - 1]] = updatedValue;

		setDestaque(updatedDestaque);
	};

	const cadastrarDestaque = async () => {
		setCarregando(true);
		try {
			const referenciaBancoDeDados = ref(
				database,
				"/hub-indcon/painel-administrativo/destaques"
			);
			await push(referenciaBancoDeDados, destaque);
			setDestaque({
				empreendimento: "",
				textDestaque: "",
			});
			setTimeout(() => {
				setCarregando(false);
			}, 1500);
		} catch (error) {
			console.error(error.message);
		}
	};

	const excluirDestaque = async (index) => {
		if (!selectedToDelete) {
			console.error("Destaque não encontrado.");
			return;
		}

		try {
			const referencia = ref(
				database,
				`hub-indcon/painel-administrativo/destaques/${selectedToDelete.id}`
			);

			await set(referencia, null);
			const destaquesAtualizados = destaques.filter(
				(d) => d.id !== selectedToDelete.id
			);
			setDestaques(destaquesAtualizados);
			console.log("Destaque removido com sucesso!");
			setOpenDialog(false);
		} catch (error) {
			console.error("Erro ao excluir o destaque:", error);
		}
	};

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
		>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>Confirmar exclusão</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Tem certeza de que deseja excluir este destaque?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)} color='primary'>
						Cancelar
					</Button>
					<Button
						onClick={excluirDestaque}
						color='error'
						variant='contained'
						autoFocus
					>
						Excluir
					</Button>
				</DialogActions>
			</Dialog>
			<Box
				sx={{
					width: "100%",
					height: "40px",
					display: "flex",
					alignItems: "center",
					gap: "1rem",
				}}
			>
				{options.map((option) => (
					<Button
						variant={
							option.id === selectedOption ? "contained" : "outlined"
						}
						key={option.id}
						color='primary'
						onClick={() => setSelectedOption(option.id)}
					>
						{option.text}
					</Button>
				))}
			</Box>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				{selectedOption === 1 && (
					<>
						{carregando ? (
							<Box
								sx={{
									width: "100vw",
									height: "80vh",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<CircularProgressWithLabel value={progress} />
							</Box>
						) : (
							<>
								<Typography
									variant='h5'
									color='primary'
									fontWeight='bold'
									marginY={2}
								>
									Criando novo destaque
								</Typography>
								<FormControl fullWidth>
									<InputLabel htmlFor='empresa'>
										Selecione a Empresa
									</InputLabel>
									<Select
										labelId='empresa'
										id='empresa'
										value={destaque.empreendimento}
										onChange={alterarCampos("empreendimento")}
									>
										{empreendimentos.map((empreendimento) => (
											<MenuItem
												key={empreendimento.uid}
												value={empreendimento}
											>
												{empreendimento.nomeEmpreendimento}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<TextField
									rows={6}
									placeholder='Digite o título do destaque'
									value={destaque.textDestaque}
									onChange={alterarCampos("textDestaque")}
									sx={{
										marginY: 2,
									}}
								/>
								<Button
									variant='contained'
									color='primary'
									onClick={() => cadastrarDestaque()}
								>
									Cadastrar destaque
								</Button>
							</>
						)}
					</>
				)}
				{selectedOption === 2 && (
					<>
						<Box
							sx={{
								width: "100%",
							}}
						>
							<TableContainer
								component={Paper}
								sx={{
									marginTop: "1rem",
								}}
							>
								<Table sx={{ minWidth: 650 }} aria-label='simple table'>
									<TableHead
										sx={{
											backgroundColor: "#007bff",
										}}
									>
										<TableRow>
											<TableCell
												sx={{
													color: "white",
													fontWeight: "600",
												}}
											>
												Nome do empreendimento
											</TableCell>
											<TableCell
												sx={{
													color: "white",
													fontWeight: "600",
												}}
												align='right'
											>
												Texto Destaque
											</TableCell>
											<TableCell
												sx={{
													color: "white",
													fontWeight: "600",
												}}
												align='right'
											>
												Tipo de empreendimento
											</TableCell>
											<TableCell
												sx={{
													color: "white",
													fontWeight: "600",
												}}
												align='right'
											>
												Endereço
											</TableCell>
											<TableCell
												sx={{
													color: "white",
													fontWeight: "600",
												}}
												align='right'
											>
												Excluir
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{destaques.length > 0 ? (
											destaques.map((destaque, index) => (
												<TableRow
													key={destaque.id}
													sx={{
														"&:last-child td, &:last-child th": {
															borderBottom:
																"1px solid rgba(0,0,0,0.3)",
														},
													}}
												>
													<TableCell component='th' scope='row'>
														{
															destaque.empreendimento
																.nomeEmpreendimento
														}
													</TableCell>
													<TableCell component='th' scope='row'>
														{destaque.textDestaque}
													</TableCell>
													<TableCell align='right'>
														{
															destaque.empreendimento
																.tipoEmpreendimento
														}
													</TableCell>
													<TableCell align='right'>
														{destaque.empreendimento.rua}
													</TableCell>
													<TableCell
														onClick={() =>
															handleOpenDialog(index)
														}
														align='right'
														sx={{
															display: "flex",
															color: "#007bff",
															alignItems: "center",
															gap: "1rem",
															transition: ".4s ease all",
															cursor: "pointer",
															"&:hover": {
																color: "#c1121f",
															},
														}}
													>
														<Delete />
														<Typography variant='p'>
															Excluir destaque
														</Typography>
													</TableCell>
												</TableRow>
											))
										) : (
											<Typography
												variant='h5'
												color='error'
												sx={{
													marginY: "1.5rem",
												}}
											>
												Nenhum destaque por aqui
											</Typography>
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</Box>
					</>
				)}
			</Box>
		</Box>
	);
};

export default Destaques;
