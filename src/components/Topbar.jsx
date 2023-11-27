import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function TopBar() {
	const routes = [
		{
			path: "/painel-de-tarefas",
			name: "Tarefas",
		},
		{
			path: "/usuarios",
			name: "Usuários",
		},
		{
			path: "/painel-de-imoveis",
			name: "Imóveis",
		},
		{
			path: "/empresas",
			name: "Empresas",
		},
		{
			path: "/corretores",
			name: "Corretores",
		},
		{
			path: null,
			name: "Sair do sistema",
		},
	];

	const [subMenuUsuarios, setSubMenuUsuarios] = useState(null);
	const [subMenuImoveis, setSubMenuImoveis] = useState(null);
	const [subMenuEmpresas, setSubMenuEmpresas] = useState(null);
	const [subMenuCorretores, setSubMenuCorretores] = useState(null);
	const navigate = useNavigate();

	const abrirSubMenuUsuarios = (event) => {
		setSubMenuUsuarios(event.currentTarget);
	};

	const fecharSubMenuUsuarios = () => {
		setSubMenuUsuarios(null);
	};

	const abrirSubMenuEmppresas = (event) => {
		setSubMenuEmpresas(event.currentTarget);
	};
	const fecharSubMenuEmpresas = (event) => {
		setSubMenuEmpresas(null);
	};

	const abrirSubMenuImoveis = (event) => {
		setSubMenuImoveis(event.currentTarget);
	};

	const fecharSubMenuImoveis = () => {
		setSubMenuImoveis(null);
	};

	const abrirSubMenuCorretores = (event) => {
		setSubMenuCorretores(event.currentTarget);
	};
	const fecharSubMenuCorretores = (event) => {
		setSubMenuCorretores(null);
	};

	const sairDoSistema = async () => {
		console.log("logout...");
		try {
			signOut(auth)
				.then(() => {
					navigate("/login");
				})
				.catch((error) => {});
		} catch (error) {
			console.log(error.code);
		}
	};

	return (
		<AppBar position='static'>
			<Toolbar>
				<Typography variant='h6' sx={{ flexGrow: 1 }}>
					<strong>Portal Indcon</strong>
				</Typography>
				{routes.map((route, index) => (
					<Button
						key={index}
						aria-controls='usuario-menu'
						aria-haspopup='true'
						onClick={
							route.path === "/usuarios"
								? abrirSubMenuUsuarios
								: route.path === "/painel-de-imoveis"
								? abrirSubMenuImoveis
								: route.path === "/empresas"
								? abrirSubMenuEmppresas
								: route.path === "/corretores"
								? abrirSubMenuCorretores
								: route.path === null
								? sairDoSistema
								: null
						}
						color='inherit'
						href={
							route.path !== "/usuarios" &&
							route.path !== "/painel-de-imoveis" &&
							route.path !== "/empresas" &&
							route.path !== "/corretores" &&
							route.path !== null
								? route.path
								: null
						}
					>
						{route.name}
					</Button>
				))}

				<Menu
					id='usuario-menu'
					anchorEl={subMenuUsuarios}
					open={Boolean(subMenuUsuarios)}
					onClose={fecharSubMenuUsuarios}
				>
					<MenuItem
						component={Link}
						to='/usuarios/visualizar'
						onClick={() => fecharSubMenuUsuarios()}
					>
						Ver Usuários
					</MenuItem>
					<MenuItem
						component={Link}
						to='/usuarios/cadastrar'
						onClick={() => fecharSubMenuUsuarios()}
					>
						Cadastrar Usuário
					</MenuItem>
				</Menu>

				<Menu
					id='imoveis-menu'
					anchorEl={subMenuImoveis}
					open={Boolean(subMenuImoveis)}
					onClose={fecharSubMenuImoveis}
				>
					<MenuItem
						component={Link}
						to='/painel-de-imoveis/visualizar'
						onClick={() => fecharSubMenuImoveis()}
					>
						Visualizar Imóveis
					</MenuItem>
					<MenuItem
						component={Link}
						to='/painel-de-imoveis/cadastrar'
						onClick={() => fecharSubMenuImoveis()}
					>
						Cadastrar Imóvel
					</MenuItem>

					<MenuItem
						component={Link}
						to='/painel-de-imoveis/area-do-corretor'
						onClick={() => fecharSubMenuImoveis()}
					>
						Área do corretor
					</MenuItem>
				</Menu>

				<Menu
					id='empresas-menu'
					anchorEl={subMenuEmpresas}
					open={Boolean(subMenuEmpresas)}
					onClose={fecharSubMenuEmpresas}
				>
					<MenuItem
						component={Link}
						to='/empresas/cadastrar'
						onClick={() => fecharSubMenuEmpresas()}
					>
						Cadastrar Empresa
					</MenuItem>
					<MenuItem
						component={Link}
						to='/empresas/visualizar'
						onClick={() => fecharSubMenuEmpresas()}
					>
						Visualizar empresas
					</MenuItem>
				</Menu>

				<Menu
					id='corretores-menu'
					anchorEl={subMenuCorretores}
					open={Boolean(subMenuCorretores)}
					onClose={fecharSubMenuCorretores}
				>
					<MenuItem
						component={Link}
						to='/corretores/cadastrar'
						onClick={() => fecharSubMenuCorretores()}
					>
						Cadastrar Corretor
					</MenuItem>
					<MenuItem
						component={Link}
						to='/corretores/visualizar'
						onClick={() => fecharSubMenuCorretores()}
					>
						Visualizar corretores
					</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	);
}

export default TopBar;
