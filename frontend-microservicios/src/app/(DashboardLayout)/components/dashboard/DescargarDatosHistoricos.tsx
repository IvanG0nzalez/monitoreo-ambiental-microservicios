import { Grid, Stack, Typography, Avatar, Box, TextField, Button } from '@mui/material';
import { IconCircleX, IconExclamationCircle, IconCircleCheck, IconInfoCircle, IconCircleMinus } from '@tabler/icons-react';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { getToken } from '@/hooks/SessionUtils';
import { api_registros } from '@/hooks/Api';

const DescargarDatosHistoricos = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const token = getToken();

  const handleDescargar = async () => {
    try {
      const response = await api_registros.listar_entre_fechas(fechaInicio, fechaFin, token);
      
    } catch (error) {
      enqueueSnackbar('Error al descargar los datos', { variant: 'error' });
    }
  };

  const minDate = '2024-07-26';
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <DashboardCard title="Descargar Datos Históricos">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Fecha de Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: minDate, max: fechaFin || currentDate }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Fecha de Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: fechaInicio || minDate, max: currentDate }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Button
                onClick={handleDescargar}
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                disabled={!fechaInicio || !fechaFin || fechaInicio < minDate || fechaFin > currentDate}
              >
                Descargar
              </Button>
            </Box>
          </Grid>
        </Grid>
    </DashboardCard>
  );
};

export default DescargarDatosHistoricos;
