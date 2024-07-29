"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import NivelesAlerta from "@/app/(DashboardLayout)/components/dashboard/NivelesAlerta";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/hooks/SessionUtils";
import GraficaValoresMedidosUser from "./(DashboardLayout)/components/dashboard/GraficaValoresMedidosUser";
import HeaderUser from "./(DashboardLayout)/layout/header/HeaderUser";

const Dashboard = () => {
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [router, token]);
  
  return (
    <>
    <HeaderUser/>

    <PageContainer title="Monitoreo" description="this is Dashboard">
      <Box display="flex" justifyContent="center" m={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <GraficaValoresMedidosUser />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <NivelesAlerta />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
    </>
  );
};

export default Dashboard;
