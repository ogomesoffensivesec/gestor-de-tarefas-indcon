import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Container, Typography } from "@mui/material";
import { ref, child, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";

const CadastrarEmpresas = () => {
	const [empresa, setEmpresa] = useState({
		razaoSocial: "",
		nomeFantasia: "",
		endereco: "",
		bairro: "",
		numero: "",
		cidade: "",
		estado: "",
		cep: "",
		email: "",
		telefone: "",
		cnpj: "",
		inscricaoEstadual: "",
		inscricaoMunicipal: "",
	});

	const navigate = useNavigate();

	const alterarCampos = (e) => {
		e.preventDefault();
		const { name, value } = e.target;
		setEmpresa({
			...empresa,
			[name]: value,
		});
	};
	const cadastrarEmpresa = async (e) => {
		e.preventDefault();

		try {
			const referencia_empresas = ref(
				database,
				"/hub-indcon/painel-administrativo/empresas"
			);
			const uid = uuidv4();
			const novaEmpresaRef = child(referencia_empresas, uid);

			set(novaEmpresaRef, empresa);
			console.log("Empresa adicionado com sucesso ao banco de dados.");
			navigate("/empresas/cadastrar");
			setEmpresa({
				razaoSocial: "",
				nomeFantasia: "",
				endereco: "",
				bairro: "",
				numero: "",
				cidade: "",
				estado: "",
				cep: "",
				email: "",
				telefone: "",
				cnpj: "",
				inscricaoEstadual: "",
				inscricaoMunicipal: "",
			});
		} catch (error) {
			console.error("Erro ao enviar os dados:", error);
		}
	};

	return (
		<Container maxWidth='lg'>
			<form
				onSubmit={cadastrarEmpresa}
				style={{
					display: "flex",
					flexDirection: "column",
					height: "80vh",
				}}
			>
				<Typography
					variant='h5'
					sx={{
						marginY: "1rem",
					}}
				>
					Cadastro de empresas
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Razão Social'
							name='razaoSocial'
							value={empresa.razaoSocial}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Nome Fantasia'
							name='nomeFantasia'
							value={empresa.nomeFantasia}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							size='small'
							fullWidth
							label='Endereço'
							name='endereco'
							value={empresa.endereco}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Bairro'
							name='bairro'
							value={empresa.bairro}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Número'
							name='numero'
							value={empresa.numero}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Cidade'
							name='cidade'
							value={empresa.cidade}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Estado'
							name='estado'
							value={empresa.estado}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='CEP'
							name='cep'
							value={empresa.cep}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Email'
							name='email'
							type='email'
							value={empresa.email}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Telefone (com DDD)'
							name='telefone'
							value={empresa.telefone}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='CNPJ'
							name='cnpj'
							value={empresa.cnpj}
							onChange={alterarCampos}
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Inscrição Estadual'
							name='inscricaoEstadual'
							value={empresa.inscricaoEstadual}
							onChange={alterarCampos}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							size='small'
							fullWidth
							label='Inscrição Municipal'
							name='inscricaoMunicipal'
							value={empresa.inscricaoMunicipal}
							onChange={alterarCampos}
						/>
					</Grid>
					<Grid item xs={12} justifyContent='center'>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
						>
							Cadastrar Empresa
						</Button>
					</Grid>
				</Grid>
			</form>
		</Container>
	);
};

export default CadastrarEmpresas;
