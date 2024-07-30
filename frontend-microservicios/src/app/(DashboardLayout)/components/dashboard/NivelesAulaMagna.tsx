import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)//components/shared/DashboardCard";
import { useEffect, useState } from "react";
import { api_sensores } from "@/hooks/Api";
import { getToken } from "@/hooks/SessionUtils";

interface Medicion {
  fecha: string,
  hora: string,
  sensor: string,
  nivel?: string,
  nivelBg?: string,
  valor_medido: number,
  indicador?: string,
}

const validarNivel = (sensor: string, valor: number) => {
  let nivel = "";
  let nivelBg = "";
  let indicador = "";

  if (sensor === "CO2") {
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
  } else if (sensor === "Temperatura") {
    if (valor <= 10) {
      nivel = "Muy Frío";
      nivelBg = "#0000FF";
      indicador = "Temperatura muy baja";
    } else if (valor > 10 && valor <= 18) {
      nivel = "Frío";
      nivelBg = "#1E90FF";
      indicador = "Temperatura baja";
    } else if (valor > 18 && valor <= 24) {
      nivel = "Óptimo";
      nivelBg = "#7FFF00";
      indicador = "Temperatura confortable";
    } else if (valor > 24 && valor <= 30) {
      nivel = "Cálido";
      nivelBg = "#FFD700";
      indicador = "Temperatura alta";
    } else if (valor > 30 && valor <= 35) {
      nivel = "Muy Cálido";
      nivelBg = "#FFA500";
      indicador = "Temperatura muy alta";
    } else {
      nivel = "Peligroso";
      nivelBg = "#FF4500";
      indicador = "Temperatura peligrosa";
    }
  } else if (sensor === "Humedad") {
    if (valor <= 20) {
      nivel = "Muy Baja";
      nivelBg = "#0000FF";
      indicador = "Humedad muy baja";
    } else if (valor > 20 && valor <= 40) {
      nivel = "Baja";
      nivelBg = "#1E90FF";
      indicador = "Humedad baja";
    } else if (valor > 40 && valor <= 60) {
      nivel = "Óptimo";
      nivelBg = "#7FFF00";
      indicador = "Humedad ideal";
    } else if (valor > 60 && valor <= 80) {
      nivel = "Alta";
      nivelBg = "#FFD700";
      indicador = "Humedad alta";
    } else if (valor > 80 && valor <= 95) {
      nivel = "Muy Alta";
      nivelBg = "#FFA500";
      indicador = "Humedad muy alta";
    } else {
      nivel = "Peligroso";
      nivelBg = "#FF4500";
      indicador = "Humedad extremadamente alta";
    }
  }

  return { nivel, nivelBg, indicador };
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const getUnit = (sensor: string) => {
  if (sensor === "CO2") {
    return "ppm";
  } else if (sensor === "Temperatura") {
    return "°C";
  } else if (sensor === "Humedad") {
    return "%";
  }
  return "";
};

const NivelesAulaMagna = () => {
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(true);


  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const response = await api_sensores.ultimo_registro();

        const datos = response.data.datos;

        const medicionesmap = datos.map((medicion: any) => {
          const { nivel, nivelBg, indicador } = validarNivel(medicion.tipo_medicion, medicion.registro_climatico[0].valor_medido);
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

        setMediciones(medicionesmap);
        setLoading(false);
        setNoData(medicionesmap.length === 0);
      } catch (error) {
        setLoading(false);
        setNoData(true);
      }
    };
    fetchRegistros();
  }, []);

  return (
    <DashboardCard title="Aula Magna">
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600}>
                  Fecha
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600}>
                  Hora
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600}>
                  Sensor
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600}>
                  Nivel
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600}>
                  Indicador
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600}>
                  Valor Medido
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(loading || noData) ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" width="100%" height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              mediciones.map((medicion, index) => (
                <TableRow key={index + 1}>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      sx={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(medicion.fecha)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      sx={{
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      {medicion.hora.slice(0, 5)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      fontWeight={400}
                    >
                      {medicion.sensor}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        px: "4px",
                        backgroundColor: medicion.nivelBg,
                        color: "#fff",
                      }}
                      size="small"
                      label={medicion.nivel}
                    ></Chip>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      fontWeight={400}
                    >
                      {medicion.indicador}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">{`${medicion.valor_medido} ${getUnit(medicion.sensor)}`}</Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default NivelesAulaMagna;
