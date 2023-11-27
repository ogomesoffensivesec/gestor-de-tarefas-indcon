import { Box, Container, FormControl, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import DraggableList from "../components/DraggableList";
import AddTaskToUser from "../components/AddTaskToUser";

const Dashboard = () => {
	const [users, setUsers] = useState([
		{
			name: "Selecione um usuário",
			email: null,
			tasks: [],
			id: "1",
		},
		{
			name: "John",
			email: "john@example.com",
			tasks: [
				{ id: "task-1", text: "Task 1", column: "Em andamento" },
				{ id: "task-2", text: "Task 2", column: "Em andamento" },
				{ id: "task-3", text: "Task 3", column: "Em andamento" },
				{ id: "task-4", text: "Task 4", column: "Concluído" },
			],
			id: "2",
			whatsapp: "1234567890",
		},
		{
			name: "Mary",
			email: "mary@example.com",
			tasks: [
				{ id: "task-1", text: "Task 1", column: "Em andamento" },
				{ id: "task-2", text: "Task 2", column: "Em andamento" },
				{ id: "task-3", text: "Task 3", column: "Concluído" },
				{ id: "task-4", text: "Task 4", column: "Concluído" },
				{ id: "task-5", text: "Task 5", column: "Concluído" },
				{ id: "task-6", text: "Task 6", column: "Concluído" },
			],
			id: "3",
			whatsapp: "9876543210",
		},
		{
			name: "Peter",
			email: "peter@example.com",
			tasks: [
				{ id: "task-1", text: "Task 1", column: "Em andamento" },
				{ id: "task-2", text: "Task 2", column: "Em andamento" },
				{ id: "task-3", text: "Task 3", column: "Em andamento" },
				{ id: "task-4", text: "Task 4", column: "Concluído" },
				{ id: "task-5", text: "Task 5", column: "Concluído" },
				{ id: "task-6", text: "Task 6", column: "Concluído" },
			],
			id: "4",
			whatsapp: "5555555555",
		},
	]);
	const [selectedUser, setSelectedUser] = useState(users[0]);
	const [task, setTask] = useState("");

	const handleTask = (event) => {
		setTask(event.target.value);
	};

	const handleDragEnd = (result) => {
		if (selectedUser.tasks.length > 0) {
			const { source, destination } = result;
			if (!destination) {
				return;
			}

			const updatedTasks = [...selectedUser.tasks];

			if (source.droppableId === destination.droppableId) {
				const [movedTask] = updatedTasks.splice(source.index, 1);
				updatedTasks.splice(destination.index, 0, movedTask);

				setSelectedUser({
					...selectedUser,
					tasks: updatedTasks,
				});
			} else {
				//const sourceColumn = source.droppableId;
				const destinationColumn = destination.droppableId;
				const [movedTask] = updatedTasks.splice(source.index, 1);
				movedTask.column = destinationColumn;

				updatedTasks.splice(destination.index, 0, movedTask);

				setSelectedUser({
					...selectedUser,
					tasks: updatedTasks,
				});

				const updatedUsers = [...users];
				const userIndex = updatedUsers.findIndex(
					(user) => user.id === selectedUser.id
				);

				updatedUsers[userIndex] = {
					...selectedUser,
					tasks: updatedTasks,
				};

				setUsers(updatedUsers);
			}
		}
	};

	const addTask = () => {
		if (selectedUser.id === 1) {
			alert("Selecione um usário antes de prosseguir");
			setTask("");
			return;
		}
		if (task.trim() === "") {
			return;
		}

		const lastIndex = selectedUser.tasks.length;

		const newTask = {
			id: `task-${lastIndex + 1}`,
			text: task,
			column: "Em andamento",
		};

		const updatedUser = {
			...selectedUser,
			tasks: [...selectedUser.tasks, newTask],
		};

		const updatedUsers = users.map((user) =>
			user.id === selectedUser.id ? updatedUser : user
		);

		console.log(selectedUser);

		setTask("");
		setSelectedUser(updatedUser);
		setUsers(updatedUsers);
	};

	const handleUserChange = (event) => {
		const userId = event.target.value;
		const selectedUser = users.find((user) => user.id === userId);
		setSelectedUser(selectedUser);
	};

	const handleDeleteTask = (taskId) => {
		const userIndex = users.findIndex((user) => user.id === selectedUser.id);

		if (userIndex !== -1) {
			const updatedUsers = [...users];

			const taskIndex = updatedUsers[userIndex].tasks.findIndex(
				(task) => task.id === taskId
			);

			if (taskIndex !== -1) {
				updatedUsers[userIndex].tasks.splice(taskIndex, 1);

				setUsers(updatedUsers);
			}
		}
	};

	return (
		<Container maxWidth='lg' sx={{ marginTop: "3rem" }}>
			<Box
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "1rem",
				}}
			>
				<FormControl
					size='small'
					sx={{ width: "50%", paddingRight: "10px" }}
				>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={selectedUser.id}
						onChange={handleUserChange}
						size='small'
					>
						{users &&
							users.map((user) => (
								<MenuItem key={user.id} value={user.id}>
									{user.name}
								</MenuItem>
							))}
					</Select>
				</FormControl>
				<AddTaskToUser
					task={task}
					addTask={addTask}
					handleTask={handleTask}
					user={selectedUser}
				/>
			</Box>
			<Box
				sx={{
					flexDirection: "column",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<DraggableList
					tasks={selectedUser.tasks}
					setTasks={setSelectedUser}
					selectedUser={selectedUser}
					users={users}
					handleDeleteTask={handleDeleteTask}
					setUsers={setUsers}
					onDragEnd={handleDragEnd}
				/>
			</Box>
		</Container>
	);
};

export default Dashboard;
