import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import "./tableStyle.css";
import UserModal from "./UserModal"; // Importe o componente do modal aqui

const TabelaUsuarios = ({ users }) => {
	const [selectedUser, setSelectedUser] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	const handleUserClick = (user) => {
		setSelectedUser(user);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};
	return (
		<div>
			<TableContainer
				component={Paper}
				style={{
					marginTop: "20px",
					borderRadius: "8px",
					border: "0.25px solid rgba(0,0,0,0.15)",
				}}
			>
				<Table style={{ minWidth: "650px", boxSizing: "border-box" }}>
					<TableHead
						sx={{
							backgroundColor: "#007bff",
							color: "white",
							borderLeft: "10px solid #007bff",
							borderRight: "10px solid #007bff",

							padding: 0,
							margin: 0,
						}}
					>
						<TableRow>
							<TableCell
								style={{
									fontWeight: "bold",
									color: "white",
									textTransform: "uppercase",
									letterSpacing: 1.5,
								}}
							>
								Nome
							</TableCell>
							<TableCell
								style={{
									fontWeight: "bold",
									color: "white",
									textTransform: "uppercase",
									letterSpacing: 1.5,
								}}
							>
								Email
							</TableCell>
							<TableCell
								style={{
									fontWeight: "bold",
									color: "white",
									textTransform: "uppercase",
									letterSpacing: 1.5,
								}}
							>
								WhatsApp
							</TableCell>
							<TableCell
								style={{
									fontWeight: "bold",
									color: "white",
									textTransform: "uppercase",
									letterSpacing: 1.5,
								}}
							>
								Tarefas
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users &&
							users.map((user) => (
								<TableRow key={user.id} className='table-row'>
									<TableCell>{user.nomeCompleto}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.telefone}</TableCell>
									<TableCell onClick={() => handleUserClick(user)}>
										{user.tasks
											? user.tasks.length
											: "Nenhuma tarefa pendente"}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<UserModal
				user={selectedUser}
				open={openModal}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

export default TabelaUsuarios;
