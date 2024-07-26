"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import YearlyBreakupUser from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakupUser"; 
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
import ProductPerformance from "@/app/(DashboardLayout)/components/dashboard/ProductPerformance";
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/hooks/SessionUtils";
import { api_registros } from "@/hooks/Api";
import { useSnackbar } from "notistack";
import SalesOverviewUser from "./(DashboardLayout)/components/dashboard/SalesOverviewUser";

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
      console.log(response);
      
      if (response.data.code !== 200) {
        enqueueSnackbar(response.data.msg, { variant: "error" });
        return;
      }

      setRegistros(response.data.datos);
    };
    fetchRegistros();
  }, []);
  
  return (
    <PageContainer title="Monitoreo" description="this is Dashboard">
      <Box display="flex" justifyContent="center" m={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={8} md={8}>
            <SalesOverviewUser />
          </Grid>
          <Grid item xs={8} md={8}>
            <YearlyBreakupUser />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
