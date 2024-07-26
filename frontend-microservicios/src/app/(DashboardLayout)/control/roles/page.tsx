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
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/hooks/SessionUtils";
import { useSnackbar } from "notistack";
import { api_cuentas, api_roles, api_usuarios } from "@/hooks/Api";

interface Rol {
  nombre: string,
  external_id: string,
}

const UserAccounts = () => {
  const router = useRouter();
  const token = getToken();
  const { enqueueSnackbar } = useSnackbar();

  const [roles, setRoles] = useState<Rol[]>([]);

  const [newRole, setNewRole] = useState<Rol>({
    nombre: "",
    "external_id": "",
  });


  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api_roles.listar(token);
  
        if (response.data.code !== 200) {
          enqueueSnackbar(response.data.msg, { variant: "error" });
          return;
        }

        setRoles(response.data.datos);

      } catch (error) {
        enqueueSnackbar("Hubo un error inesperado.", { variant: "error" });
      }
    };
    fetchRoles();
  }, [token]);

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };


  const handleAddRole = async () => {
    
    const response = await api_roles.crear(newRole, token);
    
    if (response.data.code !== 201) {
      enqueueSnackbar(response.data.msg, { variant: "error" });
      return;
    }

    enqueueSnackbar(response.data.msg, { variant: "success" });

    const roleToAdd = {
      ...newRole,
      external_id: response.data.datos.external_id,
    };

    setRoles([...roles, roleToAdd]);

    setNewRole({
      nombre: "",
      external_id: "",
    });
    handleCreateClose();
  };

 
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    
    setNewRole((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <PageContainer
      title="Roles"
      description="Vista de Roles"
    >
      <DashboardCard title="Roles">
        <Box sx={{ overflow: "auto", width: "100%" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateOpen}
          >
            Crear rol
          </Button>
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Número
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Nombre
                  </Typography>
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role, index) => (
                <TableRow key={role.external_id}>
                  <TableCell>
                    <Typography variant="body1" color="textSecondary">
                      {index + 1}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body1" color="textSecondary">
                      {role.nombre}
                    </Typography>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DashboardCard>

      <Dialog open={createOpen} onClose={handleCreateClose}>
        <DialogTitle>Agregar Nuevo Rol</DialogTitle>
        <DialogContent>
          <TextField
            name="nombre"
            label="Nombre"
            value={newRole.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddRole} color="primary" variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default UserAccounts;
