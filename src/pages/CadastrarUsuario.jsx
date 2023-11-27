import React from "react";
import CadastroForm from "../components/forms/CadastroForm";
import useCadastro from "../hooks/useCadastro";

const CadastrarUsuario = () => {
  const {
    formData,
    setFormData,
    errors,
    loading,
    success,
    handleSubmit,
    handleSnackbarClose,
    snackbarOpen,
    setSnackbarOpen,
  } = useCadastro();
  return (
    <CadastroForm
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      loading={loading}
      success={success}
      onSubmit={handleSubmit}
      handleSnackbarClose={handleSnackbarClose}
      snackbarOpen={snackbarOpen}
      setSnackbarOpen={setSnackbarOpen}
    />
  );
};

export default CadastrarUsuario;
