// YearlyBreakup.js
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconAlertCircle } from '@tabler/icons-react';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const AirQualityAlert = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const danger = theme.palette.error.main;
  const warning = theme.palette.warning.main;

  // chart
  const optionsDonutChart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
      width: '100%', // Ajustar anchura
    },
    colors: [primary, warning, danger],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriesDonutChart = [30, 40, 30];

  return (
    <DashboardCard title="Alerta de Nivel de Aire">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            Calidad del Aire: Malo
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: danger, width: 27, height: 27 }}>
              <IconAlertCircle width={20} color="#fff" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600" color={danger}>
              Peligroso
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Bueno
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: warning, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Medio
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: danger, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Malo
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionsDonutChart}
            series={seriesDonutChart}
            type="donut"
            height="155"
            width={"100%"} // Ajustar anchura
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default AirQualityAlert;
