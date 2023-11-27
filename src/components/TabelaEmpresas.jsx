import React from "react";
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

const TabelEmpresas = ({ empresas }) => {
	return (
		<TableContainer
			fullWidth
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
							Razão Social
						</TableCell>
						<TableCell
							style={{
								fontWeight: "bold",
								color: "white",
								textTransform: "uppercase",
								letterSpacing: 1.5,
							}}
						>
							CNPJ
						</TableCell>
						<TableCell
							style={{
								fontWeight: "bold",
								color: "white",
								textTransform: "uppercase",
								letterSpacing: 1.5,
							}}
						>
							Inscrição Estadual
						</TableCell>
						<TableCell
							style={{
								fontWeight: "bold",
								color: "white",
								textTransform: "uppercase",
								letterSpacing: 1.5,
							}}
						>
							Inscrição Municipal
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
							Telefone
						</TableCell>
						<TableCell
							style={{
								fontWeight: "bold",
								color: "white",
								textTransform: "uppercase",
								letterSpacing: 1.5,
							}}
						>
							Endereço
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{empresas.map((empresa) => (
						<TableRow key={empresa.id} className='table-row'>
							<TableCell>{empresa.razaoSocial}</TableCell>
							<TableCell>{empresa.cnpj}</TableCell>
							<TableCell>{empresa.inscricaoEstadual}</TableCell>
							<TableCell>{empresa.inscricaoMunicipal}</TableCell>
							<TableCell>{empresa.email}</TableCell>
							<TableCell>{empresa.telefone}</TableCell>
							<TableCell>
								Rua: {empresa.endereco}, {empresa.numero} -{" "}
								{empresa.bairro} - {empresa.cidade}/{empresa.estado}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default TabelEmpresas;
