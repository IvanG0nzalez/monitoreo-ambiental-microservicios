"use client";
import React, { useState, SetStateAction } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import PageContainer from "../../components/container/PageContainer";

const UserAccounts = () => {
  // Datos de ejemplo para las cuentas de usuario
  const [users, setUsers] = useState([
    {
      id: 1,
      nombre: "Tupu",
      apellidos: "Tamadre",
      correo: "example@gmail.comxd",
      identificacion: "1105966360",
      rol: "Administrador",
      clave: "password1",
    },
    {
      id: 2,
      nombre: "Yapapito",
      apellidos: "Descana",
      correo: "example@gmail.comxd",
      identificacion: "1105966360",
      rol: "Usuario",
      clave: "password2",
    },
  ]);

  const [newUser, setNewUser] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    identificacion: "",
    rol: "",
    clave: "",
  });

  const [editUser, setEditUser] = useState({
    id: 0,
    nombre: "",
    apellidos: "",
    correo: "",
    identificacion: "",
    rol: "",
    clave: "",
  });

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = (
    user: SetStateAction<{
      id: number;
      nombre: string;
      apellidos: string;
      correo: string;
      identificacion: string;
      rol: string;
      clave: string;
    }>
  ) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleAddUser = () => {
    const userToAdd = {
      id: users.length + 1,
      ...newUser,
    };
    setUsers([...users, userToAdd]);
    setNewUser({
      nombre: "",
      apellidos: "",
      correo: "",
      identificacion: "",
      rol: "",
      clave: "",
    });
    handleClose();
  };

  const handleEditUser = () => {
    const updatedUsers = users.map((user) =>
      user.id === editUser.id ? editUser : user
    );
    setUsers(updatedUsers);
    handleEditClose();
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleDeleteUser = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  return (
    <PageContainer
      title="Cuentas de Usuario"
      description="Vista de Cuenta de Usuario"
    >
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Crear cuenta
        </Button>
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  ID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Nombre
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Apellidos
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Correo
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Identificación
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Rol
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Opciones
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Typography variant="body1" color="textSecondary">
                    {user.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="textSecondary">
                    {user.nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="textSecondary">
                    {user.apellidos}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="textSecondary">
                    {user.correo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="textSecondary">
                    {user.identificacion}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="textSecondary">
                    {user.rol}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditOpen(user)}
                  >
                    Editar
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Nueva Cuenta</DialogTitle>
        <DialogContent>
          <TextField
            name="nombre"
            label="Nombre"
            value={newUser.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="apellidos"
            label="Apellidos"
            value={newUser.apellidos}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="correo"
            label="Correo"
            value={newUser.correo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="identificacion"
            label="Identificación"
            value={newUser.identificacion}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="clave"
            label="Clave"
            type="password"
            value={newUser.clave}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Select
            name="rol"
            value={newUser.rol}
            onChange={handleChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona un rol
            </MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Usuario">Usuario</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddUser} color="primary" variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Modificar Cuenta</DialogTitle>
        <DialogContent>
          <TextField
            name="nombre"
            label="Nombre"
            value={editUser.nombre}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="apellidos"
            label="Apellidos"
            value={editUser.apellidos}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="correo"
            label="Correo"
            value={editUser.correo}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="identificacion"
            label="Identificación"
            value={editUser.identificacion}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="clave"
            label="Clave"
            type="password"
            value={editUser.clave}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <Select
            name="rol"
            value={editUser.rol}
            onChange={handleEditChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona un rol
            </MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Usuario">Usuario</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEditUser} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default UserAccounts;
