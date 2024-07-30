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
  Skeleton,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/hooks/SessionUtils";
import { useSnackbar } from "notistack";
import { api_cuentas, api_roles, api_usuarios } from "@/hooks/Api";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface User {
  id?: Number,
  cedula: string,
  nombres: string,
  apellidos: string,
  external_id: string,
  rol?: any,
  external_rol: any,
  correo?: string,
  nombre_usuario?: string,
  clave?: string,
}

interface Cuenta {
  id_usuario: string,
  correo: string,
  nombre_usuario: string,
  clave: string,
}

interface Rol {
  nombre: string,
  external_id: string,
}

const UserAccounts = () => {
  const router = useRouter();
  const token = getToken();
  const { enqueueSnackbar } = useSnackbar();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState<User>({
    correo: "",
    nombre_usuario: "",
    clave: "",
    cedula: "",
    nombres: "",
    apellidos: "",
    external_id: "",
    external_rol: "",
    rol: "",
  });

  const [editUser, setEditUser] = useState<User>({
    correo: "",
    nombre_usuario: "",
    clave: "",
    cedula: "",
    nombres: "",
    apellidos: "",
    external_id: "",
    external_rol: "",
    rol: "",
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowEditPassword = () => setShowEditPassword(!showEditPassword);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await api_usuarios.validar_admin(token);
        if (response.data.code === 200) {
          setIsAdmin(response.data.datos);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      }

    };
    checkAdminStatus();

  }, [token]);

  useEffect(() => {
    if (isAdmin === false) {
      router.back();
    }
  }, [isAdmin, router]);

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        const response_usuarios = await api_usuarios.listar(token);
        const response_cuentas = await api_cuentas.listar(token);
        const response_roles = await api_roles.listar(token);

        if (response_usuarios.data.code !== 200) {
          enqueueSnackbar(response_usuarios.data.msg, { variant: "error" });
          return;
        }

        if (response_cuentas.data.code !== 200) {
          enqueueSnackbar(response_cuentas.data.msg, { variant: "error" });
          return;
        }

        if (response_roles.data.code !== 200) {
          enqueueSnackbar(response_roles.data.msg, { variant: "error" });
          return;
        }

        const cuentasMap = new Map(
          response_cuentas.data.datos.map((cuenta: Cuenta) => [cuenta.id_usuario, cuenta])
        );

        const combinedUsers = response_usuarios.data.datos.map((user: User) => {
          const cuenta = cuentasMap.get(user.id) as Cuenta;
          return {
            correo: cuenta ? cuenta.correo : '',
            nombre_usuario: cuenta ? cuenta.nombre_usuario : '',
            clave: cuenta ? cuenta.clave : '',
            cedula: user.cedula,
            nombres: user.nombres,
            apellidos: user.apellidos,
            external_id: user.external_id,
            rol: user.rol.nombre,
            external_rol: user.rol.external_id,
          }
        });

        setUsers(combinedUsers);
        setRoles(response_roles.data.datos);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar("Hubo un error inesperado.", { variant: "error" });
        setLoading(false);
        return;
      }
    };
    fetchUsersAndRoles();
  }, [token, enqueueSnackbar]);

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleEditOpen = (user: User) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteOpen = (external_id: string) => {
    setUserToDelete(external_id);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setUserToDelete(null);
    setDeleteOpen(false);
  };

  const handleAddUser = async () => {

    const response = await api_usuarios.crear(newUser, token);

    if (response.data.code !== 201) {
      enqueueSnackbar(response.data.msg, { variant: "error" });
      return;
    }

    enqueueSnackbar(response.data.msg, { variant: "success" });

    const userToAdd = {
      ...newUser,
      external_id: response.data.datos,
      clave: "",
    };
    setUsers([...users, userToAdd]);
    setNewUser({
      correo: "",
      nombre_usuario: "",
      clave: "",
      cedula: "",
      nombres: "",
      apellidos: "",
      external_id: "",
      external_rol: "",
      rol: "",
    });
    handleCreateClose();
  };

  const handleEditUser = async () => {

    const response = await api_usuarios.actualizar(editUser.external_id, editUser, token);

    if (response.data.code !== 200) {
      enqueueSnackbar(response.data.msg, { variant: "error" });
      return;
    }

    enqueueSnackbar(response.data.msg, { variant: "success" });

    const updatedUsers = users.map((user) =>
      user.external_id === editUser.external_id ? { ...editUser, rol: roles.find((rol) => rol.external_id === editUser.external_rol)?.nombre || "", clave: "" } : user,
    );

    setUsers(updatedUsers);
    handleEditClose();
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
      rol: roles.find((rol) => rol.external_id === value)?.nombre || "",
    }));
  };

  const handleEditChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
      rol: roles.find((rol) => rol.external_id === value)?.nombre,
    }));
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    const response = await api_usuarios.eliminar(userToDelete, token);

    if (response.data.code !== 200) {
      enqueueSnackbar(response.data.msg, { variant: "error" });
      return;
    }

    enqueueSnackbar(response.data.msg, { variant: "success" });

    const updatedUsers = users.filter((user) => user.external_id !== userToDelete);
    setUsers(updatedUsers);
    setDeleteOpen(false);
  };

  return (
    <PageContainer
      title="Cuentas de Usuario"
      description="Vista de Cuenta de Usuario"
    >
      <DashboardCard title="Cuentas de Usuario">
        <Box sx={{ overflow: "auto", width: "100%" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateOpen}
          >
            Crear cuenta
          </Button>
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Cedula
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Correo
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Nombres
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Apellidos
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Usuario
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Rol
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Opciones
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 7 }).map((_, index) => (
                      <TableCell key={index}>
                        <Skeleton variant="text" width="100%" height={30} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                users.map((user) => (
                  <TableRow key={user.external_id}>
                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        {user.cedula}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        {user.correo}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        {user.nombres}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        {user.apellidos}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        {user.nombre_usuario}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body1" color="textSecondary">
                        {user.rol}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="warning"
                        onClick={() => handleEditOpen(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      {user.rol !== 'Administrador' && (
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteOpen(user.external_id)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </DashboardCard>

      <Dialog open={createOpen} onClose={handleCreateClose}>
        <DialogTitle>Agregar Nueva Cuenta de Usuario</DialogTitle>
        <DialogContent>
          <TextField
            name="correo"
            label="Correo"
            value={newUser.correo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="nombre_usuario"
            label="Nombre de Usuario"
            value={newUser.nombre_usuario}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="clave"
            label="Clave"
            type={showPassword ? "text" : "password"}
            value={newUser.clave}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            name="cedula"
            label="Cedula"
            value={newUser.cedula}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="nombres"
            label="Nombres"
            value={newUser.nombres}
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
          <Select
            name="external_rol"
            value={newUser.external_rol}
            onChange={handleChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona un rol
            </MenuItem>
            {roles.map((rol) => (
              <MenuItem key={rol.external_id} value={rol.external_id}>
                {rol.nombre}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddUser} color="primary" variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Modificar Cuenta de Usuario</DialogTitle>
        <DialogContent>
          <TextField
            name="correo"
            label="Correo"
            value={editUser.correo}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="nombre_usuario"
            label="Nombre de Usuario"
            value={editUser.nombre_usuario}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="clave"
            label="Clave"
            type={showEditPassword ? "text" : "password"}
            value={editUser.clave}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowEditPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showEditPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            name="cedula"
            label="Cedula"
            value={editUser.cedula}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="nombres"
            label="Nombres"
            value={editUser.nombres}
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
          <Select
            name="external_rol"
            value={editUser.external_rol}
            onChange={handleEditChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona un rol
            </MenuItem>
            {roles.map((rol) => (
              <MenuItem key={rol.external_id} value={rol.external_id}>
                {rol.nombre}
              </MenuItem>
            ))}
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

      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar esta cuenta de usuario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default UserAccounts;
