"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import NivelesAlerta from "@/app/(DashboardLayout)/components/dashboard/NivelesAlerta";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/hooks/SessionUtils";
import Header from "./(DashboardLayout)/layout/header/Header";
import GraficaValoresMedidosUser from "./(DashboardLayout)/components/dashboard/GraficaValoresMedidosUser";

const Dashboard = () => {
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, []);

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  
  return (
    <>
    <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />

    <PageContainer title="Monitoreo" description="this is Dashboard">
      <Box display="flex" justifyContent="center" m={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={8} md={8}>
            <GraficaValoresMedidosUser />
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
