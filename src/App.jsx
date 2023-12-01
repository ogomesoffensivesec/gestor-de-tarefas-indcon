import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ViewUsuarios from "./pages/ViewUsuarios";
import CadastrarUsuario from "./pages/CadastrarUsuario";
import PainelImoveis from "./pages/Painel-Imoveis";
import VisualizarImoveis from "./pages/Visualizar-Imoveis";
import Entrar from "./pages/Auth/Entrar";
import CadastrarEmpresas from "./pages/CadastrarEmpresas";
import VisualizarEmpresas from "./pages/VisualizarEmpresas";
import CadastrarCorretores from "./pages/CadastrarCorretores";
import HomePage from "./pages/HomePage";
import VisualizarCorretores from "./pages/VisualizarCorretores";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import ErrorPage from "./pages/ErrorPage";
import AreaDoCorretor from "./pages/AreaDoCorretor";
import Destaques from "./pages/Destaques";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<ProtectedRoute>
					<HomePage />
				</ProtectedRoute>
			),
			errorElement: <ErrorPage />,
		},
		{
			path: "/usuarios/visualizar",
			element: (
				<ProtectedRoute>
					<ViewUsuarios />
				</ProtectedRoute>
			),
		},
		{
			path: "/usuarios/cadastrar",
			element: (
				<ProtectedRoute>
					<CadastrarUsuario />
				</ProtectedRoute>
			),
		},
		{
			path: "/painel-de-imoveis/visualizar",
			element: (
				<ProtectedRoute>
					<VisualizarImoveis />
				</ProtectedRoute>
			),
		},
		{
			path: "/painel-de-imoveis/cadastrar",
			element: (
				<ProtectedRoute>
					<PainelImoveis />
				</ProtectedRoute>
			),
		},
		{
			path: "/painel-de-imoveis/area-do-corretor",
			element: (
				<ProtectedRoute>
					<AreaDoCorretor />
				</ProtectedRoute>
			),
		},
		{
			path: "/painel-de-imoveis/area-do-corretor/destaques",
			element: (
				<ProtectedRoute>
					<Destaques />
				</ProtectedRoute>
			),
		},
		{
			path: "/empresas/cadastrar/",
			element: (
				<ProtectedRoute>
					<CadastrarEmpresas />
				</ProtectedRoute>
			),
		},
		{
			path: "/empresas/visualizar/",
			element: (
				<ProtectedRoute>
					<VisualizarEmpresas />
				</ProtectedRoute>
			),
		},
		{
			path: "/corretores/cadastrar",
			element: (
				<ProtectedRoute>
					<CadastrarCorretores />
				</ProtectedRoute>
			),
		},
		{
			path: "/corretores/visualizar",
			element: (
				<ProtectedRoute>
					<VisualizarCorretores />
				</ProtectedRoute>
			),
		},
		{
			path: "/login",
			element: <Entrar />,
		},
	]);
	return (
		<AuthContext>
			<RouterProvider router={router}></RouterProvider>
		</AuthContext>
	);
};

export default App;
