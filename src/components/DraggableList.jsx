import { Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const grid = 12;

const getItemStyle = (isDragging, draggableStyle, props) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "1rem",
	userSelect: "none",
	padding: `${props.coluna === "Concluído" ? grid * 2 : grid * 1}px`, // Corrigido props.coluna em vez de props.coluna
	margin: `0 0 ${grid}px 0`,
	border: isDragging ? "1px solid #007bff" : "1px solid rgba(0,0,0,0.2)",
	background: isDragging ? "#007bff" : "white",
	color: isDragging ? "white" : "rgba(0,0,0,0.8)",
	...draggableStyle,
});

const getColumnStyle = (isDraggingOver) => ({
	background: isDraggingOver ? "rgba(0,0,0,0.2)" : "white",
	width: "90%",
	float: "left",
	padding: "1rem 1rem",
	display: "flex",
	flexDirection: "column",
});

const DraggableList = ({ tasks, handleDeleteTask, onDragEnd }) => {
	const columns = ["Em andamento", "Concluído"];
	const [showCompleted, setShowCompleted] = useState(true);
	const [showInProgress, setShowInProgress] = useState(true);

	const handleToggleCompleted = () => {
		setShowCompleted((prevShowCompleted) => !prevShowCompleted);
	};

	const handleToggleInProgress = () => {
		setShowInProgress((prevShowInProgress) => !prevShowInProgress);
	};

	const handleDeleteClick = (taskId) => {
		handleDeleteTask(taskId);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div style={{ overflow: "hidden", display: "flex" }}>
				{columns.map((column) => (
					<div key={column} style={getColumnStyle()}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-around",
								alignItems: "center",
							}}
						>
							<h3>{column}</h3>
							{column === "Concluído" && (
								<IconButton
									onClick={handleToggleCompleted}
									aria-label={
										showCompleted
											? "Ocultar Concluído"
											: "Mostrar Concluído"
									}
									color='primary'
								>
									{showCompleted ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							)}
							{column === "Em andamento" && (
								<IconButton
									onClick={handleToggleInProgress}
									aria-label={
										showInProgress
											? "Ocultar Em andamento"
											: "Mostrar Em andamento"
									}
									color='primary'
								>
									{showInProgress ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							)}
						</div>
						{(column === "Concluído" && showCompleted) ||
						(column === "Em andamento" && showInProgress) ? (
							<Droppable droppableId={column}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										style={getColumnStyle(snapshot.isDraggingOver)}
									>
										{tasks &&
											tasks.map((task, index) => {
												if (task.column === column) {
													return (
														<Draggable
															key={task.id}
															draggableId={task.id}
															index={index}
														>
															{(provided, snapshot) => (
																<div>
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																		style={getItemStyle(
																			snapshot.isDragging,
																			provided.draggableProps
																				.style,
																			task.column
																		)}
																	>
																		<div
																			style={{
																				width: `${
																					task.column !==
																					"Concluído"
																						? "50%"
																						: "100%"
																				}`,
																			}}
																		>
																			{task.text}
																		</div>
																		{task.column !==
																		"Concluído" ? (
																			<IconButton
																				sx={{
																					width: "50%",
																				}}
																				color='error'
																				onClick={() =>
																					handleDeleteClick(
																						task.id
																					)
																				}
																				aria-label='Excluir'
																			>
																				<Delete />
																			</IconButton>
																		) : null}
																	</div>
																</div>
															)}
														</Draggable>
													);
												}
												return null;
											})}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						) : null}
					</div>
				))}
			</div>
		</DragDropContext>
	);
};

export default DraggableList;
