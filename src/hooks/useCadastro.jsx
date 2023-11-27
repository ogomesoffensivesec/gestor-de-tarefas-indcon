// useCadastro.js
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { set, ref, child } from "firebase/database";
import { database, auth } from "../firebase/firebase";
//import bcrypt from "bcrypt";
import { useNavigate } from "react-router-dom";

const useCadastro = () => {
	const [formData, setFormData] = useState({
		nome: "",
		sobrenome: "",
		telefone: "",
		email: "",
		senha: "",
		confirmarSenha: "",
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors = {};
		if (formData.nome === "") {
			newErrors.nome = "Campo obrigatório";
		}
		if (formData.sobrenome === "") {
			newErrors.sobrenome = "Campo obrigatório";
		}
		if (formData.telefone === "") {
			newErrors.telefone = "Telefone inválido";
		}
		if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
			newErrors.email = "Email inválido";
		}
		if (formData.senha.length < 6) {
			newErrors.senha = "A senha deve ter pelo menos 6 caracteres";
		}
		if (!/[A-Z]/.test(formData.senha)) {
			newErrors.senha = "A senha deve conter pelo menos uma letra maiúscula";
		}
		if (formData.senha !== formData.confirmarSenha) {
			newErrors.confirmarSenha = "As senhas não coincidem";
		}

		return newErrors;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		console.log(formData);
		const validationErrors = validateForm();

		if (Object.keys(validationErrors).length === 0) {
			try {
				const referencia_usuarios = ref(
					database,
					"/hub-indcon/painel-administrativo/usuarios"
				);

				// Crie o usuário no Firebase Authentication
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					formData.email,
					formData.senha
				);

				const user = userCredential.user;

				// Gere um salt (neste caso, apenas um valor aleatório)
				const salt = crypto.getRandomValues(new Uint8Array(16));

				// Codifique a senha usando o salt
				const encoder = new TextEncoder();
				const data = encoder.encode(formData.senha);
				const concatenated = new Uint8Array(salt.length + data.length);
				concatenated.set(salt);
				concatenated.set(data, salt.length);

				// Crie o hash da senha
				const buffer = await crypto.subtle.digest("SHA-256", concatenated);
				const hashArray = Array.from(new Uint8Array(buffer));
				const hashHex = hashArray
					.map((byte) => byte.toString(16).padStart(2, "0"))
					.join("");

				// Atualize a senha no objeto formData
				formData.senha = hashHex;

				// Restante do seu código permanece inalterado
				const newUser = {
					nomeCompleto: `${formData.nome} &nbsp; ${formData.sobrenome}`,
					telefone: formData.telefone,
					email: formData.email,
					senha: formData.senha,
				};

				// Use o UID do usuário como chave para adicionar o novo usuário
				const novoUsuarioRef = child(referencia_usuarios, user.uid);

				set(novoUsuarioRef, newUser)
					.then(() => {
						console.log(
							"Usuário adicionado com sucesso ao banco de dados."
						);
						navigate("/usuarios/cadastrar");
					})
					.catch((error) => {
						console.error(
							"Erro ao adicionar usuário ao banco de dados:",
							error
						);
					});

				setSuccess(true);
				setSnackbarOpen(true);
				setLoading(false);
				setFormData({
					nome: "",
					sobrenome: "",
					telefone: "",
					email: "",
					senha: "",
					confirmarSenha: "",
				});
			} catch (error) {
				console.error("Erro ao enviar os dados:", error);
				setLoading(false);
			}
		} else {
			setErrors(validationErrors);
			setLoading(false);
		}
	};

	return {
		formData,
		setFormData,
		errors,
		loading,
		success,
		handleSubmit,
		handleSnackbarClose,
		snackbarOpen,
		setSnackbarOpen,
	};
};

export default useCadastro;
