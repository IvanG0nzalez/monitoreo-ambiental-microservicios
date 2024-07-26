"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import GraficaValoresMedidos from "@/app/(DashboardLayout)/components/dashboard/GraficaValoresMedidos";
import NivelesAlerta from "@/app/(DashboardLayout)/components/dashboard/NivelesAlerta";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/hooks/SessionUtils";
import { api_registros } from "@/hooks/Api";
import { useSnackbar } from "notistack";
import Header from "./(DashboardLayout)/layout/header/Header";

const Dashboard = () => {
  const router = useRouter();
  const token = getToken();
  const { enqueueSnackbar } = useSnackbar();
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const fetchRegistros = async () => {
      const response = await api_registros.listar(token);
      
      if (response.data.code !== 200) {
        enqueueSnackbar(response.data.msg, { variant: "error" });
        return;
      }

      setRegistros(response.data.datos);
    };
    fetchRegistros();
  }, []);

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  
  return (
    <>
    <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />

    <PageContainer title="Monitoreo" description="this is Dashboard">
      <Box display="flex" justifyContent="center" m={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={8} md={8}>
            <GraficaValoresMedidos />
          </Grid>
          <Grid item xs={8} md={8}>
            <NivelesAlerta />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
    </>
  );
};

export default Dashboard;
