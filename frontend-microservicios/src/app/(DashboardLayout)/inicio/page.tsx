"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
import ProductPerformance from "@/app/(DashboardLayout)/components/dashboard/ProductPerformance";
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/hooks/SessionUtils";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/");
    }
  }, []);
  
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <YearlyBreakup />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
