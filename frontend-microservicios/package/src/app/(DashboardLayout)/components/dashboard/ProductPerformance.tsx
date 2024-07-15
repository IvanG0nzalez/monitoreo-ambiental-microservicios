import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)//components/shared/DashboardCard";

const mediciones = [
  {
    id: "2024-07-10",
    time: "10:00:00",
    sensor: "Temperatura",
    level: "Bajo",
    levelBg: "primary.main",
    value: "25.3 ºC",
  },
  {
    id: "2024-07-10",
    time: "11:00:00",
    sensor: "Humedad",
    level: "Medio",
    levelBg: "secondary.main",
    value: "54%",
  },
  {
    id: "2024-07-10",
    time: "12:00:00",
    sensor: "CO2",
    level: "Alto",
    levelBg: "error.main",
    value: "1200 ppm",
  },
  {
    id: "2024-07-10",
    time: "01:00:00",
    sensor: "Tempertura",
    level: "Optimo",
    levelBg: "success.main",
    value: "22.5 ºC",
  },
];

const ProductPerformance = () => {
  return (
    <DashboardCard title="Sala Magna">
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
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Fecha
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Hora
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Sensor
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Nivel
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Valor Medido
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mediciones.map((measurement) => (
              <TableRow key={measurement.id + measurement.time}>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {measurement.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {measurement.time}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight={400}
                  >
                    {measurement.sensor}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      px: "4px",
                      backgroundColor: measurement.levelBg,
                      color: "#fff",
                    }}
                    size="small"
                    label={measurement.level}
                  ></Chip>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">{measurement.value}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default ProductPerformance;
