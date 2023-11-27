import { Container } from "@mui/material";
import React from "react";
import CadastroEmpreendimento from "../components/forms/CadastroEmpreendimento";

const PainelImoveis = () => {
  return (
    <Container>
      <h1>Painel de Imoveis</h1>
      <CadastroEmpreendimento />
    </Container>
  );
};

export default PainelImoveis;
