"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import GraficaValoresMedidos from "@/app/(DashboardLayout)/components/dashboard/GraficaValoresMedidos";
import NivelesAlerta from "@/app/(DashboardLayout)/components/dashboard/NivelesAlerta";
import NivelesAulaMagna from "@/app/(DashboardLayout)/components/dashboard/NivelesAulaMagna";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/hooks/SessionUtils";
import DescargarDatosHistoricos from "../components/dashboard/DescargarDatosHistoricos";

const Dashboard = () => {
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <PageContainer title="Inicio" description="Vista de Inicio">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <GraficaValoresMedidos />
          </Grid>
          <Grid item xs={12}>
            <DescargarDatosHistoricos />
          </Grid>
          <Grid item xs={12}>
            <NivelesAulaMagna />
          </Grid>
          <Grid item xs={12}>
            <NivelesAlerta />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
