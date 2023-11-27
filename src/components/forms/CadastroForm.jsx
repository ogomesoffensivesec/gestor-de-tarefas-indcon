import React from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  SnackbarContent,
  Snackbar,
} from "@mui/material";

function CadastroForm({
  onSubmit,
  loading,
  success,
  errors,
  formData,
  setFormData,
  handleSnackbarClose,
  snackbarOpen,
  setSnackbarOpen,
}) {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={6} marginY={6}>
        <form onSubmit={onSubmit}>
          <Box marginY={2}>
            <Typography variant="h5" fontWeight={"600"} color={"primary"}>
              Cadastrar Usuários
            </Typography>
          </Box>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            error={Boolean(errors.nome)}
            helperText={errors.nome}
          />
          <TextField
            label="Sobrenome"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.sobrenome}
            onChange={(e) =>
              setFormData({ ...formData, sobrenome: e.target.value })
            }
            error={Boolean(errors.sobrenome)}
            helperText={errors.sobrenome}
          />
          <TextField
            label="Telefone"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.telefone}
            onChange={(e) =>
              setFormData({ ...formData, telefone: e.target.value })
            }
            error={Boolean(errors.telefone)}
            helperText={errors.telefone}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            label="Senha"
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            value={formData.senha}
            onChange={(e) =>
              setFormData({ ...formData, senha: e.target.value })
            }
            error={Boolean(errors.senha)}
            helperText={errors.senha}
          />
          <TextField
            label="Confirmar Senha"
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            value={formData.confirmarSenha}
            onChange={(e) =>
              setFormData({ ...formData, confirmarSenha: e.target.value })
            }
            error={Boolean(errors.confirmarSenha)}
            helperText={errors.confirmarSenha}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Cadastrar"}
          </Button>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
          >
            <SnackbarContent
              message="Cadastro realizado com sucesso!"
              style={{ backgroundColor: "green" }}
            />
          </Snackbar>
        </form>
      </Grid>
    </Grid>
  );
}

export default CadastroForm;
