// SalesOverviewUser.js
import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesOverviewUser = () => {
    // select
    const [measurement, setMeasurement] = React.useState('CO2');

    const handleChange = (event) => {
        setMeasurement(event.target.value);
    };

    // chart color
    const theme = useTheme();
    const colors = {
        CO2: theme.palette.primary.main,
        Temperatura: theme.palette.secondary.main,
        Humedad: theme.palette.success.main,
    };

    // chart options
    const optionsColumnChart = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: false,
            },
            height: 370,
            width: '100%', // Ajustar anchura
        },
        colors: [colors[measurement]],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '40%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08', '23/08', "24/08"],
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: 'dark',
            fillSeriesColor: false,
        },
    };

    // chart data
    const chartData = {
        CO2: [
            {
                name: 'CO2',
                data: [355, 390, 300, 350, 390, 180, 355, 390, 300],
            },
        ],
        Temperatura: [
            {
                name: 'Temperatura',
                data: [280, 250, 325, 215, 250, 310, 280, 250, 240],
            },
        ],
        Humedad: [
            {
                name: 'Humedad',
                data: [180, 150, 225, 115, 150, 210, 180, 150, 120],
            },
        ],
    };

    return (
        <DashboardCard title="Valores Medidos" action={
            <Select
                labelId="measurement-dd"
                id="measurement-dd"
                value={measurement}
                size="small"
                onChange={handleChange}
            >
                <MenuItem value="CO2">CO2</MenuItem>
                <MenuItem value="Temperatura">Temperatura</MenuItem>
                <MenuItem value="Humedad">Humedad</MenuItem>
            </Select>
        }>
            <Chart
                options={optionsColumnChart}
                series={chartData[measurement]}
                type="bar"
                height={370}
                width={"100%"} // Ajustar anchura
            />
        </DashboardCard>
    );
};

export default SalesOverviewUser;
