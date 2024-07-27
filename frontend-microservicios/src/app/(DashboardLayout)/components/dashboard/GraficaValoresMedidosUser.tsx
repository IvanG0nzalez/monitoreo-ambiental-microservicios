import React, { useEffect, useState } from 'react';
import { Select, MenuItem, easing } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";
import { api_registros } from "@/hooks/Api";
import { useSnackbar } from "notistack";
import { getToken } from '@/hooks/SessionUtils';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const formatDate = (date: string) => {
    if (!date) {
        return "00/00/0000";
    }

    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

const GraficaValoresMedidosUser = () => {
    const token = getToken();
    const { enqueueSnackbar } = useSnackbar();
    const [registros, setRegistros] = useState<any>([
        {
            fecha: "",
        }
    ]);
    const [registrosCO2, setRegistrosCO2] = useState([]);
    const [registrosTempertura, setRegistrosTemperatura] = useState([]);
    const [registrosHumedad, setRegistrosHumedad] = useState([]);
    // select
    const [medida, setMedida] = React.useState('CO2');

    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const response = await api_registros.listar_hoy(token);

                if (response.data.code !== 200) {
                    enqueueSnackbar(response.data.msg, { variant: "error" });
                    return;
                }

                const datos = response.data.datos;

                const co2 = datos.filter((registro: any) => registro.tipo_medicion === "CO2");
                const temperatura = datos.filter((registro: any) => registro.tipo_medicion === "Temperatura");
                const humedad = datos.filter((registro: any) => registro.tipo_medicion === "Humedad");
                
                
                setRegistros(datos);
                setRegistrosCO2(co2);
                setRegistrosTemperatura(temperatura);
                setRegistrosHumedad(humedad);
            } catch (error) {
                enqueueSnackbar("Error al obtener los registros", { variant: "error" });
                return
            }
        };
        fetchRegistros();
    }, [token, enqueueSnackbar]);

    const handleChange = (event: any) => {
        setMedida(event.target.value);
    };

    // chart color
    const theme = useTheme();
    const colors: { [key: string]: string } = {
        CO2: theme.palette.primary.main,
        Temperatura: theme.palette.secondary.main,
        Humedad: theme.palette.success.main,
    };

    const registroPorTipo: { [key: string]: any[] } = {
        CO2: registrosCO2,
        Temperatura: registrosTempertura,
        Humedad: registrosHumedad,
    };

    const horas = registroPorTipo[medida].map((registro: any) => registro.hora.slice(0, 5));
    
    const valores = registroPorTipo[medida].map((registro: any) => registro.valor_medido);
    
    const getUnit = (measurement: string) => {
        switch (measurement) {
            case 'CO2':
                return 'ppm';
            case 'Temperatura':
                return '°C';
            case 'Humedad':
                return '%';
            default:
                return '';
        }
    };

    // chart options
    const optionsColumnChart: any = {
        chart: {
            type: 'area',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: false,
            },
            height: 370,
            animations: {
                easing: 'easeinout',
                animatedGradually: {
                    enabled: true,
                    delay: 150,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                }
            }
        },
        colors: [colors[medida]],
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
            borderColor: 'rgba(0, 0, 0, 0.5)',
            strokeDashArray: 1,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 6,
            labels: {
                formatter: (value: number) => `${value} ${getUnit(medida)}`,
            }
        },
        xaxis: {
            tickAmount: 30,
            categories: horas,
            axisBorder: {
                show: false,
            },
            labels: {
                rotate: 270,
            },
        },
        tooltip: {
            theme: 'dark',
            fillSeriesColor: true,
            y: {
                formatter: (value: number) => `${value} ${getUnit(medida)}`,
            }
        },
    };

    // chart data
    const chartData: any = [
        {
            name: medida,
            data: valores,
        }
    ];

    return (
        <DashboardCard title={`Valor Medidos - ${formatDate(registros[0].fecha)}`} action={
            <Select
                labelId="measurement-dd"
                id="measurement-dd"
                value={medida}
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
                series={chartData}
                type="area"
                height={450} 
                width={"100%"}
                animate={true}
            />
        </DashboardCard>
    );
};

export default GraficaValoresMedidosUser;
