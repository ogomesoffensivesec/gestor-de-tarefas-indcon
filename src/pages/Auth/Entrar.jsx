import React, { useEffect, useState } from "react";
import {
	Button,
	TextField,
	Grid,
	Paper,
	Box,
	Checkbox,
	Snackbar,
	CircularProgress,
} from "@mui/material";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Entrar = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberCredentials, setRememberCredentials] = useState(false);
	const [carregando, setCarregando] = useState(false);
	const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
	const navigate = useNavigate();

	const saveCredentials = () => {
		localStorage.setItem("savedEmail", email);
		localStorage.setItem("savedPassword", password);
	};

	const autenticarUsuario = async (e) => {
		e.preventDefault();

		if (rememberCredentials) {
			saveCredentials();
		}

		setCarregando(true);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			setCarregando(false);
			navigate("/");
		} catch (error) {
			console.log(error.code);
			setCarregando(false);
			setSnackbarErrorOpen(true);
		}
	};

	const handleSnackbarErrorClose = () => {
		setSnackbarErrorOpen(false);
	};

	useEffect(() => {
		const savedEmail = localStorage.getItem("savedEmail");
		const savedPassword = localStorage.getItem("savedPassword");

		if (savedEmail && savedPassword) {
			setEmail(savedEmail);
			setPassword(savedPassword);
			setRememberCredentials(true);
		}
	}, []);

	return (
		<Grid
			container
			justifyContent='center'
			alignItems='center'
			style={{
				minHeight: "100vh",
				backgroundColor: "#F1F1F1",
			}}
		>
			<Grid item xs={12} sm={8} md={6} lg={6}>
				<Paper
					elevation={10}
					sx={{
						padding: 4,
						backgroundColor: "#333",
						color: "white",
					}}
				>
					<form onSubmit={autenticarUsuario} className='vertical-center'>
						{carregando ? (
							<CircularProgress />
						) : (
							<>
								<TextField
									fullWidth
									label='Email'
									value={email}
									margin='dense'
									onChange={(e) => setEmail(e.target.value)}
									className='textfield-input'
									InputProps={{
										style: { color: "white" },
									}}
									InputLabelProps={{
										style: { color: "white" },
									}}
								/>

								<TextField
									fullWidth
									label='Senha'
									type='password'
									value={password}
									margin='dense'
									onChange={(e) => setPassword(e.target.value)}
									className='textfield-input'
									InputProps={{
										style: { color: "white" },
									}}
									InputLabelProps={{
										style: { color: "white" },
									}}
								/>

								<Checkbox
									checked={rememberCredentials}
									onChange={(e) =>
										setRememberCredentials(e.target.checked)
									}
									color='primary'
								/>
								<span>Lembrar Credenciais</span>

								<Box
									sx={{
										width: "100%",
									}}
								>
									<Button
										type='submit'
										variant='outlined'
										color='primary'
										sx={{
											textTransform: "none",
											marginY: 3,
										}}
									>
										Entrar no sistema
									</Button>
								</Box>
							</>
						)}
					</form>
				</Paper>
			</Grid>

			{/* Snackbar for Error */}
			<Snackbar
				open={snackbarErrorOpen}
				autoHideDuration={6000}
				onClose={handleSnackbarErrorClose}
				message='Ocorreu um erro ao fazer o login.'
			/>
		</Grid>
	);
};

export default Entrar;
