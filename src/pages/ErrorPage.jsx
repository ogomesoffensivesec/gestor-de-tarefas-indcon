import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
	const navigation = useNavigate();
	document.title = "Erro 404 - Página não encontrada";

	const [count, setCount] = useState(5);

	const counter = () => {
		if (count === 0) {
			document.title = "Redirecionando...";
			setTimeout(() => {
				document.title = "Portal de tarefas";
				navigation("/");
			}, 2000);
		} else {
			setCount(count - 1);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			counter();
		}, 1000);
	}, [count]);
	return (
		<Box
			sx={{
				width: "100%",
				height: "100vh",
				backgroundColor: "#ba181b",
				display: "flex",
				placeItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				color: "white",
			}}
		>
			{" "}
			<h1> 404 - PÁGINA NÃO ENCONTRADA!</h1>
			<h3>Redirecionando em ...{count}</h3>
			<Button
				variant='outlined'
				sx={{
					borderColor: "#fff",
					color: "#fff",
					padding: "0.5rem 3rem",

					"&:hover": {
						borderColor: "#fff",
						backgroundColor: "#fff",
						color: "#d90429",
					},
				}}
				onClick={() => navigation("/")}
			>
				Página Inicial
			</Button>
		</Box>
	);
};

export default ErrorPage;
