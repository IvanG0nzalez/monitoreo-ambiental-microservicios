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
import Chatbot from "@/app/chatbot/chatbot";

const SensorDisplayPage = () => {
  const [sensors, setSensors] = useState([
    {
      id: 1,
      name: "Sensor 1",
      type: "CO2",
      ip: "192.168.1.101",
      estado: "Activo",
    },
    {
      id: 2,
      name: "Sensor 2",
      type: "Temperatura",
      ip: "192.168.1.102",
      estado: "Activo",
    },
    {
      id: 3,
      name: "Sensor 3",
      type: "Humedad",
      ip: "192.168.1.103",
      estado: "Activo",
    },
  ]);

  const [newSensor, setNewSensor] = useState({
    name: "",
    type: "",
    ip: "",
    estado: "Inactivo",
  });

  const [editSensor, setEditSensor] = useState({
    id: 0,
    name: "",
    type: "",
    ip: "",
    estado: "Inactivo",
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
    sensor: SetStateAction<{
      id: number;
      name: string;
      type: string;
      ip: string;
      estado: string;
    }>
  ) => {
    setEditSensor(sensor);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleAddSensor = () => {
    const sensorToAdd = {
      id: sensors.length + 1,
      ...newSensor,
    };
    setSensors([...sensors, sensorToAdd]);
    setNewSensor({
      name: "",
      type: "",
      ip: "",
      estado: "Inactivo",
    });
    handleClose();
  };

  const handleEditSensor = () => {
    const updatedSensors = sensors.map((sensor) =>
      sensor.id === editSensor.id ? editSensor : sensor
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

  const handleDeleteSensor = (id: number) => {
    const updatedSensors = sensors.filter((sensor) => sensor.id !== id);
    setSensors(updatedSensors);
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Agregar Sensor
          </Button>
        </Grid>
        {sensors.map((sensor) => (
          <Grid item key={sensor.id} xs={12} sm={6} md={4} lg={3}>
            <BlankCard>
              <Box display="flex" justifyContent="space-between">
                <CardContent>
                  <Typography variant="h6">{sensor.name}</Typography>
                  <Typography variant="body1" color="textSecondary">
                    Tipo: {sensor.type}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    IP: {sensor.ip}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Estado: {sensor.estado}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditOpen(sensor)}
                  >
                    Editar
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteSensor(sensor.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
                <Box alignSelf="flex-start">{getSensorIcon(sensor.type)}</Box>
              </Box>
            </BlankCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Nuevo Sensor</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Nombre"
            value={newSensor.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Select
            name="type"
            value={newSensor.type}
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
            name="ip"
            label="IP"
            value={newSensor.ip}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Select
            name="estado"
            value={newSensor.estado}
            onChange={handleChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="Activo">Activo</MenuItem>
            <MenuItem value="Inactivo">Inactivo</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
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
            value={editSensor.name}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <Select
            name="type"
            value={editSensor.type}
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
            name="ip"
            label="IP"
            value={editSensor.ip}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <Select
            name="estado"
            value={editSensor.estado}
            onChange={handleEditChange}
            fullWidth
            displayEmpty
          >
            <MenuItem value="Activo">Activo</MenuItem>
            <MenuItem value="Inactivo">Inactivo</MenuItem>
          </Select>
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
      <Chatbot />
    </PageContainer>
  );
};

export default SensorDisplayPage;
