import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CadastroEmpreendimento from "../components/forms/CadastroEmpreendimento";

describe("CadastroEmpreendimento", () => {
	test("renderiza o componente corretamente", () => {
		render(<CadastroEmpreendimento />);

		// Verifica se elementos importantes estão presentes na tela
		expect(screen.getByText("Informações Básicas")).toBeInTheDocument();
		// Adicione mais verificações conforme necessário
	});

	test("navegação entre etapas", () => {
		render(<CadastroEmpreendimento />);

		// Verifica se está na primeira etapa inicialmente
		expect(screen.getByText("Informações Básicas")).toBeInTheDocument();

		// Avança para a próxima etapa
		fireEvent.click(screen.getByText("Próximo"));

		// Verifica se está na segunda etapa
		expect(screen.getByText("Dados da Empresa")).toBeInTheDocument();

		// Volta para a etapa anterior
		fireEvent.click(screen.getByText("Voltar"));

		// Verifica se está de volta à primeira etapa
		expect(screen.getByText("Informações Básicas")).toBeInTheDocument();
	});

	// Adicione mais testes conforme necessário
});
