import React, { useEffect, useState } from "react";
import {
	Modal,
	Backdrop,
	Fade,
	Typography,
	Paper,
	IconButton,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Button,
	TextField,
	FormControl,
	Select,
	InputLabel,
	MenuItem,
	List,
	ListItem,
	Grid,
} from "@mui/material";
import { CloudUpload, Delete, ExpandMore, GetApp } from "@mui/icons-material";
import { onValue, ref, set, update } from "firebase/database";
import { database, storage } from "../../firebase/firebase";

import {
	ref as refStorage,
	uploadBytes,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage";

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
				{formulario.documentos &&
					formulario.documentos.map((doc, index) => (
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
									? doc.nome +
									  "." +
									  (doc.arquivo
											? doc.arquivo.name.split(".").pop()
											: "")
									: doc.arquivo
									? doc.arquivo.name
									: ""}
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
const Pagination = ({ totalItems, currentPage, paginate }) => {
	const pageNumbers = [];
	const itemsPerPage = 8;
	for (let i = 0; i < Math.ceil(totalItems / itemsPerPage - 1); i++) {
		pageNumbers.push(i + 1);
	}

	return (
		<div style={{ marginTop: "20px", textAlign: "center" }}>
			<ul style={{ listStyleType: "none", padding: 0 }}>
				{pageNumbers.map((number) => (
					<li
						key={number}
						style={{
							display: "inline-block",
							border: "0.5px solid #007bff",
							borderRadius: "5px",
							padding: ".5rem 1rem",
							margin: "0 07px",
							cursor: "pointer",
							backgroundColor:
								currentPage === number ? "#007bff" : "white",
							color: currentPage === number ? "white" : "#007bff",
						}}
						onClick={() => paginate(number)}
					>
						{number}
					</li>
				))}
			</ul>
		</div>
	);
};
const EmpreendimentoModal = ({
	empreendimento,
	open,
	onClose,
	setSelectedEmpreendimento,
}) => {
	const [novosDocumentos, setNovosDocumentos] = useState({
		documentos: [],
	});
	const [isEditMode, setIsEditMode] = useState(false);
	const [editedEmpreendimento, setEditedEmpreendimento] = useState({
		...empreendimento,
	});

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const [currentSection, setCurrentSection] = useState([
		{
			id: 0,
			section: "Informações",
		},
		{
			id: 1,
			section: "Modelos",
		},
		{
			id: 2,
			section: "Galeria",
		},
	]);

	const [selectedSection, setSelectedSection] = useState(0);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	const startIndex2 = (currentPage - 1) * 8;
	const endIndex2 = startIndex + 8;

	const [empresas, setEmpresas] = useState([]);

	useEffect(() => {
		console.log(empreendimento);
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
	const [carregando, setCarregando] = useState(false);
	const salvarAlteracoes = async () => {
		setCarregando(true);
		try {
			const referenciaEmpreendimento = ref(
				database,
				`hub-indcon/painel-administrativo/empreendimentos/${empreendimento.uid}`
			);

			for (const documento of novosDocumentos.documentos) {
				if (documento.arquivo) {
					const fileRef = refStorage(
						storage,
						`documentos/${empreendimento.uid}/${documento.nome}`
					);
					const uploadTask = await uploadBytes(fileRef, documento.arquivo);

					const downloadURL = await getDownloadURL(fileRef);
					documento.arquivoURL = downloadURL;
				}
			}

			for (const documento of novosDocumentos.documentos) {
				setEditedEmpreendimento({
					...editedEmpreendimento,
					documentos: [...editedEmpreendimento.documentos, documento],
				});
				setSelectedEmpreendimento({
					...empreendimento,
					documentos: [...empreendimento.documentos, documento],
				});
			}

			const empreendimentoAtualizado = editedEmpreendimento;

			await set(referenciaEmpreendimento, empreendimentoAtualizado);

			setEditedEmpreendimento({ ...empreendimento });
			setNovosDocumentos({ documentos: [] });
			setIsEditMode(false);
			setCarregando(false);
			console.log(editedEmpreendimento);
		} catch (error) {
			console.error(error);
			setCarregando(false);
		}
	};

	const enviarImagensGaleria = async (event) => {
		try {
			const files = event.target.files;
			const linksDasImagens = [];

			for (const img of files) {
				if (img.name) {
					const imgRef = refStorage(
						storage,
						`documentos/${empreendimento.uid}/galeria/${img.name}`
					);
					await uploadBytes(imgRef, img);
					const downloadUrl = await getDownloadURL(imgRef);
					linksDasImagens.push({
						name: img.name,
						url: downloadUrl,
					});
				}
			}

			// Atualiza a lista de imagens na galeria local
			const novaGaleria = [...empreendimento.galeria, ...linksDasImagens];

			// Atualiza o Realtime Database
			const empreendimentoRef = ref(
				database,
				`hub-indcon/painel-administrativo/empreendimentos/${empreendimento.uid}`
			);

			await update(empreendimentoRef, {
				galeria: novaGaleria,
			});
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			slotProps={{ backdrop: { invisible: false } }}
			closeAfterTransition
		>
			<Fade in>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100%",
					}}
				>
					<Paper
						style={{
							padding: "2rem",
							border: "1px solid #007bff",
							backgroundColor: "#fff",
							width: "60%",
							height: "80%",
						}}
					>
						<Box
							sx={{
								width: "90%",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Typography
								variant='h4'
								align='center' // Texto centralizado
								style={{
									color: "#000",
									fontWeight: "bold",
								}}
							>
								{empreendimento.nomeEmpreendimento}
							</Typography>

							<Box
								sx={{
									display: "flex",
									gap: "1rem",
								}}
							>
								{!carregando ? (
									<>
										<Button
											variant='contained'
											color={isEditMode ? "primary" : "secondary"}
											onClick={() => {
												if (isEditMode) {
													salvarAlteracoes();
												} else {
													setIsEditMode(true);
												}
											}}
										>
											{isEditMode ? "Salvar" : "Editar"}
										</Button>

										{selectedSection === 1 && (
											<>
												<h1>Modelos</h1>
											</>
										)}
										{selectedSection === 2 && (
											<>
												<input
													accept='image/*'
													style={{ display: "none" }}
													id='image-upload'
													multiple
													type='file'
													onChange={enviarImagensGaleria}
												/>
												<label htmlFor='image-upload'>
													<Button
														variant='contained'
														color={
															selectedSection === 2
																? "primary"
																: "secondary"
														}
														component='span'
														onClick={() => {
															if (selectedSection === 2) {
																// Nada acontece no clique se selectedSection for 2
															} else {
																console.log("edit");
															}
														}}
													>
														{isEditMode
															? "Salvar"
															: "Carregar imagens"}
													</Button>
												</label>
											</>
										)}
									</>
								) : (
									<Button variant='outlined' color='error'>
										SALVANDO INFORMAÇÕES
									</Button>
								)}
								<Button
									variant='contained'
									color='error'
									onClick={onClose}
								>
									Fechar
								</Button>
							</Box>
						</Box>
						<Box
							sx={{
								width: "100%",
								height: 50,
								marginBottom: "1rem",
								display: "flex",
								justifyContent: "left",
								gap: ".5rem",
							}}
						>
							{currentSection.map((section) => (
								<Typography
									key={section.id}
									variant='h7'
									onClick={() => setSelectedSection(section.id)}
									sx={{
										fontWeight: "600",
										cursor: "pointer",
										padding: "1rem 2rem",
										transition: ".4s ease all",
										borderBottom: `${
											selectedSection === section.id
												? "4px solid #007bff"
												: "4px solid #fff"
										}`,
									}}
								>
									{section.section}
								</Typography>
							))}
						</Box>
						{selectedSection === 0 && (
							<>
								<Accordion
									style={{
										marginBottom: "10px",
										border: "1px solid #007bff",
									}}
								>
									<AccordionSummary expandIcon={<ExpandMore />}>
										<Typography
											variant='h5'
											style={{
												color: "#007bff",
											}}
										>
											Dados do Imóvel
										</Typography>
									</AccordionSummary>
									<AccordionDetails
										sx={{ display: "flex", flexDirection: "column" }}
									>
										{isEditMode ? (
											<>
												<TextField
													sx={{
														marginBottom: "1rem",
													}}
													label='Nome do Empreendimento'
													value={
														editedEmpreendimento.nomeEmpreendimento
													}
													onChange={(e) =>
														setEditedEmpreendimento({
															...editedEmpreendimento,
															nomeEmpreendimento: e.target.value,
														})
													}
												/>
												<TextField
													sx={{
														marginBottom: "1rem",
													}}
													label='Tipo do Empreendimento'
													value={
														editedEmpreendimento.tipoEmpreendimento
													}
													onChange={(event) =>
														setEditedEmpreendimento({
															...editedEmpreendimento,
															tipoEmpreendimento:
																event.target.value,
														})
													}
												/>
												<TextField
													sx={{
														marginBottom: "1rem",
													}}
													label='Rua'
													value={editedEmpreendimento.rua}
													onChange={(event) =>
														setEditedEmpreendimento({
															...editedEmpreendimento,
															rua: event.target.value,
														})
													}
												/>
												<TextField
													sx={{
														marginBottom: "1rem",
													}}
													label='Número'
													value={editedEmpreendimento.numero}
													onChange={(event) =>
														setEditedEmpreendimento({
															...editedEmpreendimento,
															numero: event.target.value,
														})
													}
												/>
												<TextField
													sx={{
														marginBottom: "1rem",
													}}
													label='Bairro'
													value={editedEmpreendimento.bairro}
													onChange={(event) =>
														setEditedEmpreendimento({
															...editedEmpreendimento,
															bairro: event.target.value,
														})
													}
												/>
												<TextField
													sx={{
														marginBottom: "1rem",
													}}
													label='Cidade'
													value={editedEmpreendimento.cidade}
													onChange={(event) =>
														setEditedEmpreendimento({
															...editedEmpreendimento,
															cidade: event.target.value,
														})
													}
												/>
											</>
										) : (
											<>
												<Typography variant='h7'>
													<strong>Nome do Empreendimento:</strong>{" "}
													{empreendimento.nomeEmpreendimento}
												</Typography>
												<Typography variant='h7'>
													<strong>Inscrição Estadual:</strong>{" "}
													{empreendimento.inscricao}
												</Typography>
												<Typography variant='h7'>
													<strong>Tipo do Empreendimento:</strong>{" "}
													{empreendimento.tipoEmpreendimento}
												</Typography>
												<Typography variant='h7'>
													<strong>Endereço:</strong>{" "}
													{`${empreendimento.rua}, ${empreendimento.numero}-${empreendimento.bairro}/${empreendimento.cidade}`}
												</Typography>
											</>
										)}
									</AccordionDetails>
								</Accordion>
								<Accordion
									style={{
										marginBottom: "10px",
										border: "1px solid #007bff",
									}}
								>
									<AccordionSummary expandIcon={<ExpandMore />}>
										<Typography
											variant='h5'
											style={{
												color: "#007bff",
											}}
										>
											Dados da Empresa
										</Typography>
									</AccordionSummary>
									<AccordionDetails
										sx={{
											display: "flex",
											flexDirection: "column",
										}}
									>
										{isEditMode ? (
											<FormControl fullWidth>
												<InputLabel htmlFor='empresa'>
													Selecione a Empresa
												</InputLabel>
												<Select
													labelId='empresa'
													id='empresa'
													value={editedEmpreendimento.empresa}
													onChange={(event) =>
														setEditedEmpreendimento({
															...editedEmpreendimento,
															empresa: event.target.value,
														})
													}
												>
													{empresas.map((empresa, index) => (
														<MenuItem key={index} value={empresa}>
															{empresa.razaoSocial}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										) : (
											<>
												<Typography variant='h7'>
													<strong>Razão Social: </strong>
													{empreendimento.empresa.razaoSocial}
												</Typography>
												<Typography variant='h7'>
													<strong>CNPJ: </strong>
													{empreendimento.empresa.cnpj}
												</Typography>
												<Typography variant='h7'>
													{" "}
													<strong>Endereço: </strong>
													{`${empreendimento.empresa.endereco}-${empreendimento.empresa.cidade}/${empreendimento.empresa.estado}/`}
												</Typography>
											</>
										)}
									</AccordionDetails>
								</Accordion>
								<Accordion
									style={{
										marginBottom: "10px",
										border: "1px solid #007bff",
									}}
								>
									<AccordionSummary expandIcon={<ExpandMore />}>
										<Typography
											variant='h5'
											style={{
												color: "#007bff",
											}}
										>
											Documentos do Imóvel
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{isEditMode ? (
											<FormularioDocumentosImovel
												formulario={novosDocumentos}
												setFormulario={setNovosDocumentos}
											/>
										) : (
											<>
												{empreendimento.documentos
													.slice(startIndex, endIndex) // Paginação
													.map((documento, index) => (
														<div key={index}>
															<strong>
																<a
																	href={documento.arquivoURL}
																	download={documento.nome}
																	target='_blank'
																	rel='noopener noreferrer'
																	style={{ color: "#007bff" }}
																>
																	<IconButton
																		aria-label='download'
																		size='small'
																	>
																		<GetApp />
																	</IconButton>
																	{documento.nome}
																</a>
															</strong>
														</div>
													))}
											</>
										)}
									</AccordionDetails>
								</Accordion>
								<div
									style={{ display: "flex", justifyContent: "center" }}
								>
									{empreendimento.documentos.length > 8 && (
										<div>
											{Array.from(
												{
													length: Math.ceil(
														empreendimento.documentos.length /
															itemsPerPage
													),
												},
												(_, index) => (
													<button
														key={index}
														onClick={() =>
															handlePageChange(index + 1)
														}
														style={{
															backgroundColor:
																currentPage === index + 1
																	? "#007bff"
																	: "white",
															color:
																currentPage === index + 1
																	? "white"
																	: "#007bff",
															border: "1px solid #007bff",
															margin: "5px",
															padding: "5px 10px",
														}}
													>
														{index + 1}
													</button>
												)
											)}
										</div>
									)}
								</div>
							</>
						)}
						{selectedSection === 2 && (
							<>
								<AccordionDetails>
									{empreendimento.galeria && empreendimento.galeria.length > 0 && (
										<React.Fragment>
											<Grid container spacing={2}>
												{empreendimento.galeria
													.slice(startIndex2, endIndex2) // Paginação
													.map((documento, index) => (
														<Grid
															item
															key={index}
															xs={12}
															sm={6}
															md={4}
															lg={3}
														>
															<img
																src={documento.arquivoURL}
																style={{
																	width: "100%",
																	marginBottom: "10px",
																	borderRadius: "8px",
																}}
															/>
														</Grid>
													))}
											</Grid>
											<Pagination
												sx={{
													bottom: "1px",
												}}
												totalItems={empreendimento.galeria.length}
												currentPage={currentPage}
												paginate={handlePageChange}
											/>
										</React.Fragment>
									)}
								</AccordionDetails>
							</>
						)}
					</Paper>
				</div>
			</Fade>
		</Modal>
	);
};

export default EmpreendimentoModal;
