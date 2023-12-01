import React, { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ref, onValue, set } from "firebase/database";
import { database, storage } from "../../firebase/firebase";
import MuiAlert from "@mui/material/Alert";

import {
	ref as refStorage,
	uploadBytes,
	getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import {
	Box,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Select,
	Snackbar,
} from "@mui/material";
import {
	CloudUpload,
	Delete,
	DeleteOutlineRounded,
	Visibility,
} from "@mui/icons-material";
import EmpreendimentoInfo from "../EmpreendimentoInfo";

function obterEtapas(tipoEmpreendimento) {
	const etapas = [
		"Informações Básicas",
		"Dados da Empresa",
		"Documentos do Imóvel",
		"Confirmação",
	];

	if (tipoEmpreendimento === "Apartamento") {
		etapas.splice(1, 0, "Modelos");
	}

	return etapas;
}
function FormularioModelos({ formulario, setFormulario }) {
	const [modelos, setModelos] = useState([]);
	const [modelo, setModelo] = useState({
		id: "",
		nome: "",
		tipoEmpreendimento: "Apartamento",
	});

	const adicionarCampoAoFormulario = (campo, valor) => {
		console.log(formulario);
		setFormulario((prevFormulario) => {
			if (prevFormulario.modelos) {
				return {
					...prevFormulario,
					modelos: {
						...prevFormulario.modelos,
						[campo]: valor,
					},
				};
			} else {
				return {
					...prevFormulario,
					modelos: {
						[campo]: valor,
					},
				};
			}
		});
	};

	const alterarCampos = (campo) => (e) => {
		setModelo({ ...modelo, [campo]: e.target.value });
	};
	const adicionarModelo = () => {
		modelo.id = uuidv4();
		const modeloJaExiste = modelos.some((m) => m.nome === modelo.nome);

		if (modeloJaExiste) {
			alert("Modelo já existe");
		} else {
			setModelos((prevModelos) => [...prevModelos, modelo]);
			adicionarCampoAoFormulario(modelo.nome, modelo);
			console.log(formulario);
		}
	};

	const removerModelo = (id) => {
		setModelos((prevModelos) =>
			prevModelos.filter((modelo) => modelo.id !== id)
		);
	};

	return (
		<>
			<Grid container spacing={3} style={{ marginTop: "1rem" }}>
				<Grid item xs={12}>
					{modelos.length > 0 && (
						<List>
							{modelos.map((modelo) => (
								<ListItem
									key={modelo.id}
									sx={{
										borderBottom: "1px solid #007bff",
									}}
								>
									<ListItemText>
										<Typography variant='h7'>
											{modelo.nome}
										</Typography>
									</ListItemText>
									<ListItemIcon
										sx={{ cursor: "pointer" }}
										onClick={() => removerModelo(modelo.id)}
									>
										<DeleteOutlineRounded color='error' />
									</ListItemIcon>
									<ListItemIcon sx={{ cursor: "pointer" }}>
										<Visibility color='primary' />
									</ListItemIcon>
								</ListItem>
							))}
						</List>
					)}
				</Grid>
				<Grid item xs={12}>
					<TextField
						type='text'
						label='Nome do Modelo de Apartamento'
						value={modelo.nome}
						onChange={alterarCampos("nome")}
						fullWidth
					/>
				</Grid>
				<Grid item xs={12}>
					<FormControl fullWidth>
						<InputLabel>Tipo de Empreendimento</InputLabel>
						<Select
							value={modelo.tipoEmpreendimento}
							onChange={alterarCampos("tipoEmpreendimento")}
						>
							<MenuItem value='Apartamento'>Apartamento</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				{modelo.tipoEmpreendimento === "Apartamento" && (
					<>
						<Grid item xs={6}>
							<TextField
								type='number'
								label='Lavabo (s)'
								value={modelo.lavabos}
								onChange={alterarCampos("lavabos")}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								type='number'
								label='Banheiros'
								value={modelo.banheiros}
								onChange={alterarCampos("banheiros")}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								type='number'
								label='Quartos com suítes'
								value={modelo.suites}
								onChange={alterarCampos("suites")}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								type='number'
								label='Quartos simples'
								value={modelo.quartosSimples}
								onChange={alterarCampos("quartosSimples")}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								type='text'
								label='Metragem (m²)'
								value={modelo.metragem}
								onChange={alterarCampos("metragem")}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								type='number'
								label='Vagas'
								value={modelo.vagas}
								onChange={alterarCampos("vagas")}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type='text'
								label='Dados adicionais'
								value={modelo.dadosAdicionais}
								onChange={alterarCampos("dadosAdicionais")}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant='contained'
								color='primary'
								sx={{
									margin: "1rem",
								}}
								onClick={adicionarModelo}
							>
								Adicionar Modelo
							</Button>
							<Button
								variant='outlined'
								color='primary'
								sx={{
									margin: "1rem",
								}}
								onClick={() => {}}
							>
								Ver modelos
							</Button>
						</Grid>
					</>
				)}
			</Grid>
		</>
	);
}

function FormularioInformacoesBasicas({ valores, alterarCampos }) {
	return (
		<div style={{ marginTop: "3rem" }}>
			<FormControl fullWidth>
				<InputLabel htmlFor='tipo-empreendimento'>
					Tipo de Imóvel
				</InputLabel>
				<Select
					labelId='tipo-empreendimento'
					id='tipo-empreendimento'
					value={valores.tipoEmpreendimento}
					onChange={alterarCampos("tipoEmpreendimento")}
				>
					<MenuItem value='Apartamento'>Apartamento</MenuItem>
					<MenuItem value='Condomínio'>Condomínio</MenuItem>
					<MenuItem value='Casa'>Casa</MenuItem>
				</Select>
			</FormControl>
			<TextField
				label='Nome do Empreendimento'
				fullWidth
				margin='normal'
				required
				value={valores.nomeEmpreendimento}
				onChange={alterarCampos("nomeEmpreendimento")}
			/>
			<TextField
				label='Inscrição do Imóvel'
				fullWidth
				margin='normal'
				required
				value={valores.inscricao}
				onChange={alterarCampos("inscricao")}
			/>
			<TextField
				label='Cep'
				fullWidth
				margin='normal'
				required
				value={valores.cep}
				onChange={alterarCampos("cep")}
			/>
			<TextField
				label='Rua'
				fullWidth
				margin='normal'
				required
				value={valores.rua}
				onChange={alterarCampos("rua")}
			/>
			<TextField
				label='Número'
				fullWidth
				margin='normal'
				required
				value={valores.numero}
				onChange={alterarCampos("numero")}
			/>
			<TextField
				label='Complemento e Observações'
				fullWidth
				margin='normal'
				value={valores.complemento}
				onChange={alterarCampos("complemento")}
			/>
			<TextField
				label='Bairro'
				fullWidth
				margin='normal'
				required
				value={valores.bairro}
				onChange={alterarCampos("bairro")}
			/>
			<TextField
				label='Cidade'
				fullWidth
				margin='normal'
				required
				value={valores.cidade}
				onChange={alterarCampos("cidade")}
			/>
		</div>
	);
}

function FormularioDadosEmpresa({ valores, alterarCampos }) {
	const [empresas, setEmpresas] = useState([]);
	useEffect(() => {
		const empresasREF = ref(
			database,
			"hub-indcon/painel-administrativo/empresas"
		);

		onValue(empresasREF, (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const empresasArray = Object.values(data);
				setEmpresas(empresasArray);
			}
		});
	}, []);

	return (
		<div style={{ marginTop: "1rem" }}>
			<FormControl fullWidth>
				<InputLabel htmlFor='empresa'>Selecione a Empresa</InputLabel>
				<Select
					labelId='empresa'
					id='empresa'
					value={valores.empresa}
					onChange={alterarCampos("empresa")}
				>
					{empresas.map((empresa, index) => (
						<MenuItem key={index} value={empresa}>
							{empresa.razaoSocial}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}

function FormularioDocumentosImovel({ formulario, setFormulario }) {
	const handleFileChange = (e) => {
		const files = e.target.files;
		const newDocumentos = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const nomeArquivo = "";
			newDocumentos.push({ nome: nomeArquivo, arquivo: file });
		}

		setFormulario((prevState) => ({
			...prevState,
			documentos: [...prevState.documentos, ...newDocumentos],
		}));
	};

	const handleNomeChange = (event, index) => {
		const updatedDocumentos = [...formulario.documentos];
		updatedDocumentos[index].nome = event.target.value;
		setFormulario((prevState) => ({
			...prevState,
			documentos: updatedDocumentos,
		}));
	};

	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					marginTop: "5rem",
				}}
			>
				<input
					type='file'
					multiple
					id='file-upload'
					onChange={handleFileChange}
					accept='.pdf,.doc,.docx,.txt,.xls,.xlsx,.xlsm,.xml,.jpg,.jpeg,.png,.gif'
					style={{ display: "none" }}
				/>
				<label htmlFor='file-upload' style={{ cursor: "pointer" }}>
					<Typography variant='p'>
						Selecione os documentos do imóvel
					</Typography>
					<IconButton color='primary' component='span'>
						<CloudUpload />
					</IconButton>
				</label>
			</Box>

			<List>
				{formulario.documentos.map((doc, index) => (
					<ListItem key={index}>
						<TextField
							label='Nome do Arquivo'
							fullWidth
							size='small'
							value={doc.nome || ""}
							onChange={(event) => handleNomeChange(event, index)}
							sx={{ margin: 1 }}
						/>
						<div>
							{doc.nome
								? doc.nome + "." + doc.arquivo.name.split(".").pop()
								: doc.arquivo.name}
						</div>
						<IconButton
							color='error'
							onClick={() => {
								const updatedDocumentos = [...formulario.documentos];
								updatedDocumentos.splice(index, 1);
								setFormulario((prevState) => ({
									...prevState,
									documentos: updatedDocumentos,
								}));
							}}
						>
							<Delete />
						</IconButton>
					</ListItem>
				))}
			</List>
		</div>
	);
}

function ConfirmaFormulario({ valores }) {
	return (
		<div>
			<TableContainer component={Paper}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>Nome do Empreendimento</TableCell>
							<TableCell>{valores.nomeEmpreendimento}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default function CadastroEmpreendimento() {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");
	const handleSnackbarClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackbarOpen(false);
	};

	const mostrarSnackbar = (message, severity) => {
		setSnackbarMessage(message);
		setSnackbarSeverity(severity);
		setSnackbarOpen(true);
	};
	const [etapaAtual, setEtapaAtual] = useState(0);
	const [formulario, setFormulario] = useState({
		nomeEmpreendimento: "",
		tipoEmpreendimento: "",
		inscricao: "",
		cep: "",
		rua: "",
		numero: "",
		complemento: "",
		bairro: "",
		cidade: "",
		empresa: null,
		documentos: [],
		uid: "",
	});
	const steps = obterEtapas(formulario.tipoEmpreendimento);

	const [carregando, setCarregando] = useState(false);

	const alterarCampos = (fieldPath) => (event) => {
		const fieldPathArray = fieldPath.split(".");
		let updatedValue = event.target.value;
		let updatedFormulario = { ...formulario };

		let currentField = updatedFormulario;
		for (let i = 0; i < fieldPathArray.length - 1; i++) {
			currentField = currentField[fieldPathArray[i]];
		}

		currentField[fieldPathArray[fieldPathArray.length - 1]] = updatedValue;

		setFormulario(updatedFormulario);
	};

	const handleNext = () => {
		if (validarCampos(etapaAtual)) {
			setEtapaAtual((prevEtapaAtual) => prevEtapaAtual + 1);
		} else {
			console.log("Preencha todos os campos obrigatórios.");
		}
	};

	const handleBack = () => {
		setEtapaAtual((prevEtapaAtual) => prevEtapaAtual - 1);
	};

	const handleReset = () => {
		setEtapaAtual(0);
	};

	const [uid, setUid] = useState(uuidv4());
	const confirmarInfos = async () => {
		setCarregando(true);
		try {
			const novoEmpreendimentoRef = ref(
				database,
				`/hub-indcon/painel-administrativo/empreendimentos/${uid}`
			);

			for (const documento of formulario.documentos) {
				if (documento.arquivo) {
					const fileRef = refStorage(
						storage,
						`documentos/${uid}/${documento.nome}`
					);
					await uploadBytes(fileRef, documento.arquivo);

					const downloadURL = await getDownloadURL(fileRef);
					documento.arquivoURL = downloadURL;
				}
			}
			const novoEmpreendimento = { ...formulario, uid: uid };
			await set(novoEmpreendimentoRef, novoEmpreendimento);
			setFormulario({
				nomeEmpreendimento: "",
				tipoEmpreendimento: "",
				inscricao: "",
				cep: "",
				rua: "",
				numero: "",
				complemento: "",
				bairro: "",
				cidade: "",
				empresa: null,
				documentos: [],
				uid: "",
			});
			setEtapaAtual(0);
			setCarregando(false);
			mostrarSnackbar("Cadastro realizado com sucesso", "success");
			setUid(uuidv4());
		} catch (err) {
			console.error(err.message);
			setCarregando(false);
			mostrarSnackbar("Erro ao cadastrar. Verifique os campos.", "error");
			setUid(uuidv4());
		}
	};
	function validarApartamentos(modelos) {
		if (typeof modelos === "object" && !Array.isArray(modelos)) {
			for (const key in modelos) {
				if (modelos.hasOwnProperty(key)) {
					const modelo = modelos[key];
					if (modelo.tipoEmpreendimento !== "Apartamento") {
						return false;
					}
				}
			}
			return true;
		}
		return false;
	}

	const validarCampos = (etapa) => {
		switch (etapa) {
			case 0:
				return (
					formulario.nomeEmpreendimento !== "" &&
					formulario.tipoEmpreendimento !== "" &&
					formulario.inscricao !== "" &&
					formulario.cep !== "" &&
					formulario.rua !== "" &&
					formulario.numero !== "" &&
					formulario.bairro !== "" &&
					formulario.cidade !== ""
				);
			case 1:
				if (formulario.tipoEmpreendimento === "Apartamento") {
					return validarApartamentos(formulario.modelos);
				} else {
					return formulario.empresa !== null;
				}
			case 2:
				if (formulario.tipoEmpreendimento === "Apartamento") {
					return formulario.empresa !== null;
				} else {
					return (
						formulario.documentos.length > 0 &&
						formulario.documentos.every(
							(documento) => documento.nome !== ""
						)
					);
				}

			case 3:
				return (
					formulario.documentos.length > 0 &&
					formulario.documentos.every((documento) => documento.nome !== "")
				);

			default:
				return false;
		}
	};
	const [selectedImages, setSelectedImages] = useState([]);
	const [loadedImages, setLoadedImages] = useState([]);
	const itemsPerLoad = 9;
	const [loadMore, setLoadMore] = useState(true);

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);

		// Adicione os novos arquivos à lista existente
		setSelectedImages((prevImages) => prevImages.concat(files));

		// Certifique-se de que os novos arquivos estejam carregados corretamente
		setLoadedImages((prevLoadedImages) =>
			prevLoadedImages.concat(files.slice(0, itemsPerLoad))
		);

		// Ative o botão "Carregar mais" se houver mais imagens
		setLoadMore(files.length > itemsPerLoad);
	};

	const handleLoadMore = () => {
		const nextBatch = selectedImages.slice(
			loadedImages.length,
			loadedImages.length + itemsPerLoad
		);
		setLoadedImages([...loadedImages, ...nextBatch]);
		// Disable load more button if no more images to load
		setLoadMore(nextBatch.length > 0);
	};

	const [noPictures, setNoPictures] = useState(false);

	return (
		<div>
			<Stepper activeStep={etapaAtual} alternativeLabel>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<div>
				{etapaAtual === steps.length ? (
					<div>
						<Typography variant='h6'>Confirmação</Typography>
						<div>
							<ConfirmaFormulario valores={formulario} />
						</div>
						<Button onClick={handleReset}>Reiniciar</Button>
					</div>
				) : (
					<div>
						{etapaAtual === 0 && (
							<FormularioInformacoesBasicas
								valores={formulario}
								alterarCampos={alterarCampos}
							/>
						)}
						{etapaAtual === 1 &&
							formulario.tipoEmpreendimento === "Apartamento" && (
								<FormularioModelos
									formulario={formulario}
									setFormulario={setFormulario}
								/>
							)}
						{etapaAtual === 1 &&
							formulario.tipoEmpreendimento !== "Apartamento" && (
								<FormularioDadosEmpresa
									valores={formulario}
									alterarCampos={alterarCampos}
								/>
							)}
						{etapaAtual === 2 &&
							formulario.tipoEmpreendimento === "Apartamento" && (
								<FormularioDadosEmpresa
									valores={formulario}
									alterarCampos={alterarCampos}
								/>
							)}
						{etapaAtual === 2 &&
							formulario.tipoEmpreendimento !== "Apartamento" && (
								<FormularioDocumentosImovel
									setFormulario={setFormulario}
									formulario={formulario}
								/>
							)}

						{etapaAtual === 3 &&
							formulario.tipoEmpreendimento === "Apartamento" && (
								<FormularioDocumentosImovel
									setFormulario={setFormulario}
									formulario={formulario}
								/>
							)}
						{etapaAtual === 3 &&
							formulario.tipoEmpreendimento !== "Apartamento" && (
								<EmpreendimentoInfo
									empreendimento={formulario && formulario}
									handleImageUpload={handleImageUpload}
									loadedImages={loadedImages}
									selectedImages={selectedImages}
									loadMore={loadMore}
									handleLoadMore={handleLoadMore}
									noPictures={noPictures}
									setNoPictures={setNoPictures}
									setEmpreendimento={setFormulario && setFormulario}
									empreendimentoID={uid}
								/>
							)}

						{etapaAtual === 4 &&
							formulario.tipoEmpreendimento === "Apartamento" && (
								<EmpreendimentoInfo
									empreendimento={formulario && formulario}
									setEmpreendimento={setFormulario && setFormulario}
								/>
							)}
						<Box
							sx={{
								width: "100%",
								display: "flex",
								flexDirection: "row",
								justifyContent: "center",
								gap: "1rem",
								marginTop: "1rem",
							}}
						>
							{!carregando ? (
								<>
									{etapaAtual === 0 ? null : (
										<Button onClick={handleBack}>Voltar</Button>
									)}
									<Button
										variant='contained'
										color='primary'
										onClick={
											etapaAtual === steps.length - 1
												? confirmarInfos
												: handleNext
										}
										disabled={
											!validarCampos(etapaAtual) && etapaAtual < 4
										}
									>
										{etapaAtual === steps.length - 1
											? "Confirmar"
											: "Próximo"}
									</Button>
								</>
							) : (
								<Button variant='outlined' color='error'>
									Carregando
								</Button>
							)}
							<Snackbar
								open={snackbarOpen}
								autoHideDuration={6000}
								onClose={handleSnackbarClose}
							>
								<MuiAlert
									elevation={6}
									variant='filled'
									onClose={handleSnackbarClose}
									severity={snackbarSeverity}
								>
									{snackbarMessage}
								</MuiAlert>
							</Snackbar>
						</Box>
					</div>
				)}
			</div>
		</div>
	);
}
