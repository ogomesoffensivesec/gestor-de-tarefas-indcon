import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	TablePagination,
} from "@mui/material";

import { database } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import EmpreendimentoModal from "./forms/EmpreendimentoModal";

const EmpreendimentoRow = ({ empreendimento, openModal }) => {
	return (
		<>
			{empreendimento && (
				<>
					<TableRow>
						<TableCell>{empreendimento.nomeEmpreendimento}</TableCell>
						<TableCell>{empreendimento.tipoEmpreendimento}</TableCell>
						<TableCell>{empreendimento.empresa.razaoSocial}</TableCell>
						<TableCell>
							<Button
								color='primary'
								onClick={() => openModal(empreendimento)}
							>
								Ver detalhes
							</Button>
						</TableCell>
					</TableRow>
				</>
			)}
		</>
	);
};

const TabelaEmpreendimentos = () => {
	const [empreendimentos, setEmpreendimentos] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [selectedEmpreendimento, setSelectedEmpreendimento] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false); // Controla a abertura/fechamento do modal

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
	}, []);

	const openModal = (empreendimento) => {
		setSelectedEmpreendimento(empreendimento);
		setIsModalOpen(true); // Abre o modal
	};

	const closeModal = () => {
		setSelectedEmpreendimento(null);
		setIsModalOpen(false); // Fecha o modal
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const paginatedEmpreendimentos = empreendimentos.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
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
									fontWeight: "bold",
								}}
							>
								Nome do Empreendimento
							</TableCell>
							<TableCell
								sx={{
									color: "white",
									fontWeight: "bold",
								}}
							>
								Tipo do Empreendimento
							</TableCell>
							<TableCell
								sx={{
									color: "white",
									fontWeight: "bold",
								}}
							>
								Empresa Responsável
							</TableCell>
							<TableCell
								sx={{
									color: "white",
									fontWeight: "bold",
								}}
							>
								Detalhes
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedEmpreendimentos.map((empreendimento, index) => (
							<EmpreendimentoRow
								key={index}
								empreendimento={empreendimento}
								openModal={() => openModal(empreendimento)}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component='div'
				count={empreendimentos.length}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>

			{/* Aqui você deve renderizar o modal com as informações do empreendimento selecionado */}
			{selectedEmpreendimento && (
				<EmpreendimentoModal
					empreendimento={selectedEmpreendimento}
					setSelectedEmpreendimento={setSelectedEmpreendimento}
					open={isModalOpen}
					onClose={closeModal}
				/>
			)}
		</>
	);
};

export default TabelaEmpreendimentos;
