import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar, Box } from '@mui/material';
import { IconCircleX, IconExclamationCircle, IconCircleCheck, IconInfoCircle, IconCircleMinus } from '@tabler/icons-react';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from "react";
import { api_sensores } from "@/hooks/Api";

interface Medicion {
  fecha: string,
  hora: string,
  sensor: string,
  nivel?: string,
  nivelBg?: string,
  valor_medido: number,
  indicador?: string,
}

const validarNivel = (valor: number) => {
  let nivel = "";
  let nivelBg = "";
  let indicador = "";

  if (valor <= 400) {
    nivel = "Bajo";
    nivelBg = "#228B22";
    indicador = "Aire muy limpio";
  } else if (valor > 400 && valor <= 800) {
    nivel = "Normal";
    nivelBg = "#32CD32";
    indicador = "Aire aceptable";
  } else if (valor > 800 && valor <= 1000) {
    nivel = "Óptimo";
    nivelBg = "#7FFF00";
    indicador = "Aire de buena calidad";
  } else if (valor > 1000 && valor <= 1500) {
    nivel = "Alto";
    nivelBg = " #FFD700";
    indicador = "Aire ligeramente contaminado";
  } else if (valor > 1500 && valor <= 2000) {
    nivel = "Muy Alto";
    nivelBg = "#FFA500";
    indicador = "Aire contaminado";
  } else {
    nivel = "Peligroso";
    nivelBg = "#FF4500";
    indicador = "Aire muy contaminado";
  }

  return { nivel, nivelBg, indicador };
};

const getIconAndColor = (nivel?: string) => {
  let icon = <IconInfoCircle />;
  let color = "#000000";

  switch (nivel) {
    case "Bajo":
      icon = <IconCircleMinus />;
      color = "#228B22";
      break;
    case "Normal":
      icon = <IconCircleCheck />;
      color = "#32CD32";
      break;
    case "Óptimo":
      icon = <IconCircleCheck />;
      color = "#7FFF00";
      break;
    case "Alto":
      icon = <IconCircleX />;
      color = "#FFD700";
      break;
    case "Muy Alto":
      icon = <IconCircleX />;
      color = "#FFA500";
      break;
    case "Peligroso":
      icon = <IconExclamationCircle />;
      color = "#FF4500";
      break;
    default:
      icon = <IconInfoCircle />;
      color = "#000000";
      break;
  }

  return { icon, color };

}

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const NivelesAlerta = () => {
  const [medicion, setMedicion] = useState<Medicion[]>([]);

  // chart color
  const theme = useTheme();

  useEffect(() => {
    const fetchRegistro = async () => {
      const response = await api_sensores.ultimo_registro();

      const datos = response.data.datos;

      const medicionesmap = datos.map((medicion: any) => {
        const { nivel, nivelBg, indicador } = validarNivel(medicion.registro_climatico[0].valor_medido);
        return {
          fecha: medicion.registro_climatico[0].fecha,
          hora: medicion.registro_climatico[0].hora,
          sensor: medicion.tipo_medicion,
          nivel,
          nivelBg,
          indicador,
          valor_medido: medicion.registro_climatico[0].valor_medido,
        };
      });

      const medicion = medicionesmap.filter((medicion: any) => medicion.sensor === "CO2");

      setMedicion(medicion);
    };
    fetchRegistro();
  }, []);

  const { icon, color } = medicion.length > 0 ? getIconAndColor(medicion[0].nivel) : { icon: <IconInfoCircle />, color: "#000000" };

  return (
    <DashboardCard>
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Alerta de Nivel de Aire</Typography>
          {medicion.length > 0 && (
            <Typography variant="h6" fontWeight="300">{formatDate(medicion[0].fecha)}</Typography>
          )}
        </Box>
        <Grid container spacing={5}>
          <Grid item xs={7} sm={7}>
            <Typography variant="h3" fontWeight="700" mb={2}>
              Calidad: {medicion.length > 0 && medicion[0].indicador}
            </Typography>
            <Typography variant="h6" fontWeight="300" mb={2}>
              Hora: {medicion.length > 0 && medicion[0].hora.slice(0, 5)}
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar sx={{ bgcolor: color, width: 27, height: 27 }}>
                {icon}
              </Avatar>
              <Typography variant="subtitle2" fontWeight="600" color={color}>
                {medicion.length > 0 && medicion[0].nivel}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </>
    </DashboardCard>
  );
};

export default NivelesAlerta;
