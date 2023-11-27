import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Card,
	CardContent,
} from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";

const UserModal = ({ user, open, onClose }) => {
	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth='xl'>
			{user && (
				<>
					<DialogTitle>{user.nomeCompleto}</DialogTitle>
					<DialogContent>
						<Typography>Email: {user.email}</Typography>

						<Typography>
							WhatsApp:
							<a
								href={`https://api.whatsapp.com/send/?phone=${user.telefone}`}
								target='_blank'
								rel='noopener noreferrer'
							>
								{user.telefone}
							</a>
						</Typography>

						<Accordion>
							<AccordionSummary
								expandIcon={<ExpandMoreRounded />}
								sx={{
									backgroundColor: "#007bff",
									color: "#fff",
									marginTop: "1rem",
								}}
							>
								<Typography>Tarefas</Typography>
							</AccordionSummary>
							<AccordionDetails
								sx={{
									padding: "1rem",
								}}
							>
								{user.tasks && user.tasks.length > 0 ? (
									user.tasks.map((task) => (
										<Card
											key={task.id}
											style={{ marginBottom: "8px" }}
										>
											<CardContent>
												<Typography>{task.title}</Typography>
												<Typography>{task.description}</Typography>
											</CardContent>
										</Card>
									))
								) : (
									<Typography>Nenhuma tarefa pendente</Typography>
								)}
							</AccordionDetails>
						</Accordion>
					</DialogContent>
				</>
			)}
		</Dialog>
	);
};

export default UserModal;
