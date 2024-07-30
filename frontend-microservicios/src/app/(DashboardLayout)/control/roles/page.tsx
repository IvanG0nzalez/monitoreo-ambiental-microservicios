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

const Roles = () => {
  const router = useRouter();
  const token = getToken();
  const { enqueueSnackbar } = useSnackbar();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);

  const [newRole, setNewRole] = useState<Rol>({
    nombre: "",
    "external_id": "",
  });


  const [createOpen, setCreateOpen] = useState(false);

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
    const fetchRoles = async () => {
      try {
        const response = await api_roles.listar(token);

        if (response.data.code !== 200) {
          enqueueSnackbar(response.data.msg, { variant: "error" });
          return;
        }

        setRoles(response.data.datos);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar("Hubo un error inesperado.", { variant: "error" });
        setLoading(false);
        return;
      }
    };
    fetchRoles();
  }, [token, enqueueSnackbar]);

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
        <>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateOpen}
          >
            Crear rol
          </Button>
          <Box sx={{ overflow: "auto", display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: { xs: "100%", sm:"45%" , md: "35%", lg:"25%" } }}>
              <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Número
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        Nombre
                      </Typography>
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <TableRow key={index} >
                        {Array.from({ length: 2 }).map((_, index) => (
                          <TableCell key={index}>
                            <Skeleton variant="text" width="100%" height={30} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    roles.map((role, index) => (
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
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </>
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

export default Roles;
