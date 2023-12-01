import React, { useState } from "react";
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	ListItem,
	List,
	ListItemIcon,
	ListItemText,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Description } from "@mui/icons-material";
import GaleriaUpload from "./GaleriaUpload";

function EmpreendimentoInfo({
	empreendimento,
	handleImageUpload,
	loadedImages,
	selectedImages,
	loadMore,
	handleLoadMore,
	noPictures,
	setEmpreendimento,
	setNoPictures,
	empreendimentoID,
}) {
	const [showProprietario, setShowProprietario] = useState(false);
	const [showDocumentos, setShowDocumentos] = useState(false);
	const [selectedDocumento, setSelectedDocumento] = useState(null); // State para o documento selecionado
	const [openPreview, setOpenPreview] = useState(false); // State para controlar a exibição do modal
	const [galeriaOpen, setGaleriaOpen] = useState(false);

	const abrirGaleria = () => {
		setGaleriaOpen(true);
	};

	const fecharGaleria = () => {
		setGaleriaOpen(false);
	};

	const toggleProprietario = () => {
		setShowProprietario(!showProprietario);
	};

	const toggleDocumentos = () => {
		setShowDocumentos(!showDocumentos);
	};

	const openDocumentPreview = (documento) => {
		setSelectedDocumento(documento);
		setOpenPreview(true);
		console.log(documento);
	};

	const closeDocumentPreview = () => {
		setOpenPreview(false);
	};

	return (
		<div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
			<Typography variant='h6' fontWeight={"600"}>
				Informações do Empreendimento
			</Typography>
			<Typography>
				<strong> Nome do Empreendimento:</strong>{" "}
				{empreendimento.nomeEmpreendimento}
			</Typography>
			<Typography>
				<strong>CEP:</strong> {empreendimento.cep}
			</Typography>
			<Typography>
				<strong>Rua:</strong> {empreendimento.rua}
			</Typography>
			<Typography>
				<strong>Número:</strong> {empreendimento.numero}
			</Typography>
			<Typography>
				<strong>Bairro:</strong> {empreendimento.bairro}
			</Typography>
			<Typography>
				<strong>Cidade:</strong> {empreendimento.cidade}
			</Typography>
			{/* Dados do Proprietário */}
			<Accordion
				expanded={showProprietario}
				style={{
					border: showProprietario
						? "1px solid #363636"
						: "1px solid #007bff",
					backgroundColor: showProprietario ? "#363636" : "#fff",
					color: !showProprietario ? "#007bff" : "#fff",
					marginTop: "1rem",
					marginBottom: "1rem",
				}}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					onClick={toggleProprietario}
					style={{ backgroundColor: "inherit" }}
				>
					<Typography variant='h6'>
						<strong>Dados da Empresa</strong> - Clique aqui para
						visualizar
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{empreendimento.empresa && (
						<div>
							<Typography>
								Razão Social: {empreendimento.empresa.razaoSocial}
							</Typography>
							<Typography>
								Documento: {empreendimento.empresa.cnpj}
							</Typography>
							<Typography>
								E-mail: {empreendimento.empresa.email}
							</Typography>
							<Typography>
								Telefone: {empreendimento.empresa.telefone}
							</Typography>
							<Typography>
								Endereço: {empreendimento.empresa.endereco},{" "}
								{empreendimento.empresa.numero} -{" "}
								{empreendimento.empresa.bairro} -{" "}
								{empreendimento.cidade}/{empreendimento.empresa.estado}
							</Typography>
							<Typography>
								Ins. Municipal:{" "}
								{empreendimento.empresa.inscricaoMunicipal}
							</Typography>
							<Typography>
								Ins. Estadual:{" "}
								{empreendimento.empresa.inscricaoEstadual}
							</Typography>
						</div>
					)}
				</AccordionDetails>
			</Accordion>
			<Accordion
				expanded={showDocumentos}
				style={{
					border: showDocumentos
						? "1px solid #363636"
						: "1px solid #007bff",
					backgroundColor: showDocumentos ? "#363636" : "#fff",
					color: !showDocumentos ? "#007bff" : "#fff",
					marginTop: "1rem",
					marginBottom: "1rem",
				}}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					onClick={toggleDocumentos}
					style={{ backgroundColor: "inherit" }}
				>
					<Typography variant='h6'>
						<strong>Documentos</strong> - Clique aqui para visualizar
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<List>
						{empreendimento.documentos.map((documento, index) => (
							<ListItem
								key={index}
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<ListItemIcon>
									<Description color='primary' />
								</ListItemIcon>
								<ListItemText
									primary={documento?.nome || "Nome não disponível"}
									onClick={() => openDocumentPreview(documento)}
									style={{ cursor: "pointer" }}
								/>
							</ListItem>
						))}
					</List>
				</AccordionDetails>
			</Accordion>
			<Grid
				container
				spacing={2}
				mt={3}
				mb={3}
				justifyContent={!noPictures && "center"}
			>
				{!noPictures && (
					<>
						<Grid item xs={12} textAlign={"center"}>
							<Typography variant='h6' color={"primary"}>
								<strong>Desejar adicionar fotos à galeria?</strong>
							</Typography>
						</Grid>{" "}
						<Grid item xs={6}>
							<Button
								fullWidth
								variant='contained'
								color='success'
								onClick={abrirGaleria}
							>
								Adicionar
							</Button>
						</Grid>
						{!noPictures && (
							<Grid item xs={6}>
								<Button
									fullWidth
									variant='outlined'
									color='error'
									onClick={() => !noPictures && setNoPictures(true)}
								>
									Não, quero adicionar depois
								</Button>
							</Grid>
						)}
					</>
				)}
			</Grid>
			<Dialog open={openPreview} onClose={closeDocumentPreview}>
				<DialogTitle>Pré-visualização de Documento</DialogTitle>
				<DialogContent>
					{selectedDocumento && (
						<div>
							{selectedDocumento.arquivo.type === "application/pdf" && (
								<embed
									src={selectedDocumento.arquivo.url} // Use arquivo.url em vez de selectedDocumento.url
									type='application/pdf'
									width='100%'
									height='500'
								/>
							)}
							{selectedDocumento.arquivo.type === "image/jpeg" && (
								<img src={selectedDocumento.arquivo.url} alt='Imagem' />
							)}
							{selectedDocumento.arquivo.type === "image/png" && (
								<img src={selectedDocumento.arquivo.url} alt='Imagem' />
							)}
							{selectedDocumento.arquivo.type ===
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
								<iframe
									title='Documento'
									src={`https://view.officeapps.live.com/op/view.aspx?src=${selectedDocumento.arquivo.url}`}
									width='100%'
									height='500'
									frameBorder='0'
								/>
							)}
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDocumentPreview} color='primary'>
						Fechar
					</Button>
				</DialogActions>
			</Dialog>
			<GaleriaUpload
				open={galeriaOpen}
				handleClose={fecharGaleria}
				handleImageUpload={handleImageUpload}
				loadedImages={loadedImages}
				selectedImages={selectedImages}
				loadMore={loadMore}
				handleLoadMore={handleLoadMore}
				empreendimento={empreendimento}
				setEmpreendimento={setEmpreendimento}
				empreendimentoID={empreendimentoID}
				setNoPictures={setNoPictures}
			/>
		</div>
	);
}

export default EmpreendimentoInfo;
