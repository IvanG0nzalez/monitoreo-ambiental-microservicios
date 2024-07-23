'use client';
import { Grid, CardContent, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';

const SensorDisplayPage = () => {
  // Example sensor data
  const sensors = [
    {
      name: 'Sensor 1',
      type: 'CO2',
      ip: '192.168.1.101',
      estdo: 'Active',
    },
    {
      name: 'Sensor 2',
      type: 'Temperature',
      ip: '192.168.1.102',
      estdo: 'Inactive',
    },
    {
      name: 'Sensor 3',
      type: 'Humidity',
      ip: '192.168.1.103',
      estdo: 'Active',
    },
  ];

  return (
    <PageContainer title="Sensor Display" description="Displaying sensor information">
      <Grid container spacing={3}>
        {sensors.map((sensor, index) => (
          <Grid item key={index} sm={12}>
            <DashboardCard title={`Sensor ${index + 1}`}>
              <BlankCard>
                <CardContent>
                  <Typography variant="subtitle1">
                    Nombre: {sensor.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Tipo: {sensor.type}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    IP: {sensor.ip}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Estdo: {sensor.estdo}
                  </Typography>
                </CardContent>
              </BlankCard>
            </DashboardCard>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default SensorDisplayPage;
