"use client";
import { SetStateAction, useState } from "react";
import {
  Grid,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AirIcon from "@mui/icons-material/Air";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/hooks/SessionUtils";
import DashboardCard from "../../components/shared/DashboardCard";
import { api_sensores } from "@/hooks/Api";
import { useSnackbar } from "notistack";

interface Sensor {
  alias: string;
  tipo_medicion: string;
  cadena_conexion: string;
  external_id: string;
}

const SensorDisplayPage = () => {
  const router = useRouter();
  const token = getToken();
  const { enqueueSnackbar } = useSnackbar();

  const [sensors, setSensors] = useState<Sensor[]>([]);

  const [newSensor, setNewSensor] = useState<Sensor>({
    alias: "",
    tipo_medicion: "",
    cadena_conexion: "",
    external_id: "",
  });

  const [editSensor, setEditSensor] = useState<Sensor>({
    alias: "",
    tipo_medicion: "",
    cadena_conexion: "",
    external_id: "",
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const fetchSensors = async () => {
      const response = await api_sensores.listar(token);
      if (response.data.code !== 200) {
        enqueueSnackbar(response.data.msg, { variant: "error" });
        return;
      }
      setSensors(response.data.datos);
    };
    fetchSensors();
  }, [token]);

  const handleCreateOpen = () => {
    setCreateOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleEditOpen = (sensor: Sensor) => {
    setEditSensor(sensor);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteOpen = (external_id: string) => {
    setSensorToDelete(external_id);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setSensorToDelete(null);
    setDeleteOpen(false);
  };

  const handleAddSensor = async () => {

    const response = await api_sensores.crear(newSensor, token);

    if (response.data.code !== 201) {
      enqueueSnackbar(response.data.msg, { variant: "error" });
      return;
    }
    enqueueSnackbar(response.data.msg, { variant: "success" });

    const sensorToAdd = {
      ...newSensor,
      external_id: response.data.datos.external_id,
    };
    setSensors([...sensors, sensorToAdd]);
    setNewSensor({
      alias: "",
      tipo_medicion: "",
      cadena_conexion: "",
      external_id: "",
    });
    handleCreateClose();
  };

  const handleEditSensor = async () => {
    const response = await api_sensores.actualizar(editSensor.external_id, editSensor, token);
    
    if (response.data.code !== 200) {
      enqueueSnackbar(response.data.msg, { variant: "error" });
      return;
    }

    enqueueSnackbar(response.data.msg, { variant: "success" });

    const updatedSensors = sensors.map((sensor) =>
      sensor.external_id === editSensor.external_id ? editSensor : sensor
    );
    setSensors(updatedSensors);
    handleEditClose();
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setNewSensor((prevSensor) => ({
      ...prevSensor,
      [name]: value,
    }));
  };

  const handleEditChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setEditSensor((prevSensor) => ({
      ...prevSensor,
      [name]: value,
    }));
  };

  const handleDeleteSensor = async () => {
    if (!sensorToDelete) return;

    const response = await api_sensores.eliminar(sensorToDelete, token);

    if (response.data.code !== 200) {
      enqueueSnackbar(response.data.msg, { variant: "error" });
      setDeleteOpen(false);
      return;
    }

    enqueueSnackbar(response.data.msg, { variant: "success" });

    const updatedSensors = sensors.filter((sensor) => sensor.external_id !== sensorToDelete);
    setSensors(updatedSensors);
    setDeleteOpen(false);
  };

  const getSensorIcon = (tipo_medicion: string) => {
    switch (tipo_medicion) {
      case "CO2":
        return <AirIcon fontSize="large" />;
      case "Temperatura":
        return <ThermostatIcon fontSize="large" />;
      case "Humedad":
        return <OpacityIcon fontSize="large" />;
      default:
        return <LocalFireDepartmentIcon fontSize="large" />;
    }
  };

  return (
    <PageContainer title="Sensor" description="Vista de Sensores">
      <DashboardCard title="Sensores">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateOpen}
            >
              Agregar Sensor
            </Button>
          </Grid>
          {sensors.map((sensor) => (
            <Grid item key={sensor.external_id} xs={12} sm={6} md={4} lg={3}>
              <BlankCard>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <CardContent>
                    <Typography variant="h6">{sensor.alias}</Typography>

                    <Typography variant="body1" color="textSecondary">
                      Tipo: {sensor.tipo_medicion}
                    </Typography>
                  </CardContent>

                  <Box alignSelf="flex-start">{getSensorIcon(sensor.tipo_medicion)}</Box>
                </Box>

                <Box display="flex" alignItems="right" alignContent="end" justifyContent="end">
                  <IconButton
                    color="warning"
                    onClick={() => handleEditOpen(sensor)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleDeleteOpen(sensor.external_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </BlankCard>
            </Grid>
          ))}
        </Grid>
      </DashboardCard>

      <Dialog open={createOpen} onClose={handleCreateClose}>
        <DialogTitle>Agregar Nuevo Sensor</DialogTitle>
        <DialogContent>
          <TextField
            name="alias"
            label="Alias"
            value={newSensor.alias}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Select
            name="tipo_medicion"
            value={newSensor.tipo_medicion}
            onChange={handleChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona un tipo
            </MenuItem>
            <MenuItem value="CO2">CO2</MenuItem>
            <MenuItem value="Temperatura">Temperatura</MenuItem>
            <MenuItem value="Humedad">Humedad</MenuItem>
          </Select>
          <TextField
            name="cadena_conexion"
            label="Cadena de conexión"
            value={newSensor.cadena_conexion}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddSensor} color="primary" variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Modificar Sensor</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Nombre"
            value={editSensor.alias}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <Select
            name="tipo_medicion"
            value={editSensor.tipo_medicion}
            onChange={handleEditChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona un tipo
            </MenuItem>
            <MenuItem value="CO2">CO2</MenuItem>
            <MenuItem value="Temperatura">Temperatura</MenuItem>
            <MenuItem value="Humedad">Humedad</MenuItem>
          </Select>
          <TextField
            name="cadena_conexion"
            label="cadena_conexion"
            value={editSensor.cadena_conexion}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleEditSensor}
            color="primary"
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar este sensor?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteSensor} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default SensorDisplayPage;
