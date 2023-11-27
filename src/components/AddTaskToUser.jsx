import { Box, Button, TextField } from "@mui/material";
import React from "react";

const AddTaskToUser = ({ addTask, task, handleTask, user }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "1rem",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
      }}
    >
      <TextField
        sx={{
          width: "60%",
        }}
        size="small"
        label={`${
          user.id !== "1"
            ? `Adicionar uma tarefa para o usuário ${user.name}`
            : "Selecione um usuário para adicionar uma nova tarefa"
        }`}
        variant="outlined"
        value={task}
        onChange={handleTask}
      />
      <Button variant="contained" color="primary" onClick={() => addTask()}>
        Adicionar tarefa
      </Button>
    </Box>
  );
};

export default AddTaskToUser;
