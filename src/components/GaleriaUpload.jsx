import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { CloudUpload } from "@mui/icons-material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { ref, onValue, set } from "firebase/database";
import { database, storage } from "../firebase/firebase";

import {
	ref as refStorage,
	uploadBytes,
	getDownloadURL,
} from "firebase/storage";
import { CircularProgress } from "@mui/material";

const GaleriaUpload = ({
	open,
	handleClose,
	handleImageUpload,
	loadedImages,
	selectedImages,
	loadMore,
	handleLoadMore,
	empreendimento,
	setEmpreendimento,
	empreendimentoID,
	setNoPictures,
}) => {
	const [carregando, setCarregando] = useState(false);
	const enviarImagensDatabase = async () => {
		try {
			// Array para armazenar os links das imagens
			const linksDasImagens = [];

			// Iterar sobre as imagens carregadas
			for (const imagem of loadedImages) {
				if (imagem.name) {
					// Caminho no storage para salvar a imagem
					const storageRef = refStorage(
						storage,
						`documentos/${empreendimentoID}/galeria/${imagem.name}`
					);

					// Upload da imagem para o storage
					await uploadBytes(storageRef, imagem);

					// Obter o link de download da imagem
					const downloadURL = await getDownloadURL(storageRef);

					// Adicionar o link ao array
					linksDasImagens.push({
						name: imagem.name,
						arquivoURL: downloadURL,
					});
				}
			}

			// Atualizar o estado do empreendimento com os links das imagens
			setEmpreendimento({ ...empreendimento, galeria: linksDasImagens });

			// Sinalizar que não há mais imagens pendentes
			setNoPictures(true);

			console.log(empreendimento);

			handleClose();
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 400,
					bgcolor: "background.paper",
					boxShadow: 24,
					p: 4,
				}}
			>
				<Typography
					variant='h5'
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					Galeria do Empreendimento
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							gap: ".5rem",
						}}
					>
						{loadedImages && loadedImages.length > 0 && (
							<Button
								onClick={enviarImagensDatabase}
								variant='contained'
								color='success'
								size='small'
							>
								Enviar imagens
							</Button>
						)}
						<Button
							size='small'
							onClick={handleClose}
							variant='contained'
							color='error'
						>
							Fechar
						</Button>
					</Box>
				</Typography>
				<Box sx={{ display: "flex", flexDirection: "column" }}>
					<Box
						sx={{
							width: "100%",
						}}
					>
						<input
							type='file'
							multiple
							id='file-upload'
							onChange={handleImageUpload}
							accept='.jpg,.jpeg,.png,.gif'
							style={{ display: "none" }}
						/>
						<label
							htmlFor='file-upload'
							style={{
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "1rem",
							}}
						>
							<Typography variant='h6'>Selecione as imagens</Typography>
							<IconButton color='primary' component='span'>
								<CloudUpload />
							</IconButton>
						</label>

						<Typography variant='h7'></Typography>
					</Box>

					<Box>
						<ImageList cols={3}>
							{loadedImages &&
								loadedImages.map((image, index) => (
									<ImageListItem
										key={index}
										sx={{
											margin: "1rem",
										}}
									>
										{image instanceof Blob ||
										image instanceof File ? (
											<img
												src={URL.createObjectURL(image)}
												alt={`Image ${index}`}
											/>
										) : (
											<CircularProgress color='primary' />
										)}
									</ImageListItem>
								))}
						</ImageList>

						{selectedImages && selectedImages.length > 0 && loadMore && (
							<Button
								onClick={handleLoadMore}
								variant='contained'
								color='primary'
							>
								Carregar mais imagens
							</Button>
						)}
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default GaleriaUpload;
