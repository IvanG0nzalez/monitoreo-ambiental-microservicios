import { Grid, Stack, Typography, Avatar, Box, TextField, Button, InputLabel, Select, MenuItem } from '@mui/material';
import { IconCircleX, IconExclamationCircle, IconCircleCheck, IconInfoCircle, IconCircleMinus } from '@tabler/icons-react';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { getToken } from '@/hooks/SessionUtils';
import { api_registros } from '@/hooks/Api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as yaml from 'js-yaml';

const DescargarDatosHistoricos = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [formato, setFormato] = useState('xlsx');
  const { enqueueSnackbar } = useSnackbar();
  const token = getToken();

  const handleDescargar = async () => {
    try {
      const response = await api_registros.listar_entre_fechas(fechaInicio, fechaFin, token);

      if (response.data.code === 240) {
        enqueueSnackbar(`${response.data.msg}`, { variant: 'warning' });
        return;
      } else if (response.data.code !== 200) {
        enqueueSnackbar(`${response.data.msg}`, { variant: 'error' });
        return;
      }

      const datos = response.data.datos;

      if (formato === 'xlsx') {
        descargarXLSX(datos);
      } else if (formato === 'csv') {
        descargarCSV(datos);
      } else if (formato === 'json') {
        descargarJSON(datos);
      } else if (formato === 'xml') {
        descargarXML(datos);
      } else if (formato === 'sql') {
        descargarSQL(datos);
      } else if (formato === 'yaml') {
        descargarYAML(datos);
      } else if (formato === 'txt') {
        descargarTXT(datos);
      } else if (formato === 'html') {
        descargarHTML(datos);
      } else if (formato === 'md') {
        descargarMD(datos);
      }

      enqueueSnackbar('Datos descargados correctamente', { variant: 'success' });

    } catch (error) {
      enqueueSnackbar('Error al descargar los datos', { variant: 'error' });
    }
  };

  const descargarXLSX = (datos: any) => {
    const co2Data = datos.filter((dato: any) => dato.tipo_medicion === "CO2");
    const temperaturaData = datos.filter((dato: any) => dato.tipo_medicion === "Temperatura");
    const humedadData = datos.filter((dato: any) => dato.tipo_medicion === "Humedad");

    const createSheet = (data: any) => {
      return data.map((dato: any) => ({
        "Fecha": dato.fecha,
        "Hora": dato.hora,
        "Valor Medido": dato.valor_medido,
      }));
    };

    const co2Sheet = XLSX.utils.json_to_sheet(createSheet(co2Data));
    const temperaturaSheet = XLSX.utils.json_to_sheet(createSheet(temperaturaData));
    const humedadSheet = XLSX.utils.json_to_sheet(createSheet(humedadData));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, co2Sheet, "CO2");
    XLSX.utils.book_append_sheet(workbook, temperaturaSheet, "Temperatura");
    XLSX.utils.book_append_sheet(workbook, humedadSheet, "Humedad");

    XLSX.writeFile(workbook, `Datos_Historicos_${fechaInicio}_${fechaFin}.xlsx`);
  };

  const descargarCSV = (datos: any) => {
    const co2Data = datos.filter((dato: any) => dato.tipo_medicion === "CO2");
    const temperaturaData = datos.filter((dato: any) => dato.tipo_medicion === "Temperatura");
    const humedadData = datos.filter((dato: any) => dato.tipo_medicion === "Humedad");

    const createCSV = (data: any) => {
      return data.map((dato: any) => `${dato.fecha},${dato.hora},${dato.valor_medido}`);
    };

    const co2CSV = createCSV(co2Data).join('\n');
    const temperaturaCSV = createCSV(temperaturaData).join('\n');
    const humedadCSV = createCSV(humedadData).join('\n');

    const csv = `CO2\n${co2CSV}\n\nTemperatura\n${temperaturaCSV}\n\nHumedad\n${humedadCSV}`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `Datos_Historicos_${fechaInicio}_${fechaFin}.csv`);
  };

  const descargarJSON = (datos: any) => {
    const co2Data = datos.filter((dato: any) => dato.tipo_medicion === "CO2");
    const temperaturaData = datos.filter((dato: any) => dato.tipo_medicion === "Temperatura");
    const humedadData = datos.filter((dato: any) => dato.tipo_medicion === "Humedad");

    const createJSON = (data: any) => {
      return data.map((dato: any) => ({
        "Fecha": dato.fecha,
        "Hora": dato.hora,
        "Valor Medido": dato.valor_medido,
      }));
    };

    const co2JSON = createJSON(co2Data);
    const temperaturaJSON = createJSON(temperaturaData);
    const humedadJSON = createJSON(humedadData);

    const json = JSON.stringify({
      CO2: co2JSON,
      Temperatura: temperaturaJSON,
      Humedad: humedadJSON,
    });

    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `Datos_Historicos_${fechaInicio}_${fechaFin}.json`);
  };

  const descargarXML = (datos: any) => {
    const createXML = (data: any, tipo : any) => {
      const registros = data.map((dato: any) => `
        <registro>
          <fecha>${dato.fecha}</fecha>
          <hora>${dato.hora}</hora>
          <valor_medido>${dato.valor_medido}</valor_medido>
        </registro>
      `).join('');

      return `
        <${tipo}>
          ${registros}
        </${tipo}>
      `;
    };
    
    const co2XML = createXML(datos.filter((dato: any) => dato.tipo_medicion === "CO2"), "CO2");
    const temperaturaXML = createXML(datos.filter((dato: any) => dato.tipo_medicion === "Temperatura"), "Temperatura");
    const humedadXML = createXML(datos.filter((dato: any) => dato.tipo_medicion === "Humedad"), "Humedad");

    const xml = `<DatosHistoricos>${co2XML}${temperaturaXML}${humedadXML}</DatosHistoricos>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, `Datos_Historicos_${fechaInicio}_${fechaFin}.xml`);
  };

  const descargarSQL = (datos: any) => {
    const createSQL = (data: any, tipo : any) => {
      const createTable = `CREATE TABLE IF NOT EXISTS Registro_${tipo} (\nfecha DATE, \nhora TIME, \nvalor_medido FLOAT \n);`;

      const values = data.map((dato: any) => `('${dato.fecha}', '${dato.hora}', ${dato.valor_medido})`).join(',\n');
      const insertData = `INSERT INTO Registro_${tipo}  (fecha, hora, valor_medido) VALUES\n${values};`;

      return `${createTable}\n\n${insertData}`;
    };

    const co2SQL = createSQL(datos.filter((dato: any) => dato.tipo_medicion === "CO2"), "CO2");
    const temperaturaSQL = createSQL(datos.filter((dato: any) => dato.tipo_medicion === "Temperatura"), "Temperatura");
    const humedadSQL = createSQL(datos.filter((dato: any) => dato.tipo_medicion === "Humedad"), "Humedad");

    const sql = `${co2SQL}\n\n${temperaturaSQL}\n\n${humedadSQL}`;

    const blob = new Blob([sql], { type: 'text/sql;charset=utf-8' });
    saveAs(blob, `Datos_Historicos_${fechaInicio}_${fechaFin}.sql`);
  };

  const descargarYAML = (datos: any) => {
    const co2Data = datos.filter((dato: any) => dato.tipo_medicion === "CO2");
    const temperaturaData = datos.filter((dato: any) => dato.tipo_medicion === "Temperatura");
    const humedadData = datos.filter((dato: any) => dato.tipo_medicion === "Humedad");

    const createYAML = (data: any) => {
      return data.map((dato: any) => ({
        "Fecha": dato.fecha,
        "Hora": dato.hora,
        "ValorMedido": dato.valor_medido,
      }));
    };

    const yamlData = {
      CO2: createYAML(co2Data),
      Temperatura: createYAML(temperaturaData),
      Humedad: createYAML(humedadData),
    };
    
    const yamlString = yaml.dump(yamlData);
    const blob = new Blob([yamlString], { type: 'application/x-yaml' });
    saveAs(blob, `Datos_Historicos_${fechaInicio}_${fechaFin}.yaml`);
  };

  const descargarTXT = (datos: any) => {
    const co2Data = datos.filter((dato: any) => dato.tipo_medicion === "CO2");
    const temperaturaData = datos.filter((dato: any) => dato.tipo_medicion === "Temperatura");
    const humedadData = datos.filter((dato: any) => dato.tipo_medicion === "Humedad");
  
    const createTXT = (data: any) => {
      return data.map((dato: any) => `\tFecha: ${dato.fecha}, Hora: ${dato.hora}, Valor Medido: ${dato.valor_medido}`).join('\n');
    };
  
    const co2Text = createTXT(co2Data);
    const temperaturaText = createTXT(temperaturaData);
    const humedadText = createTXT(humedadData);
  
    const blob = new Blob([`CO2:\n${co2Text}\n\nTemperatura:\n${temperaturaText}\n\nHumedad:\n${humedadText}`], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Datos_Historicos_${fechaInicio}_${fechaFin}.txt`);
  };

  const descargarHTML = (datos: any) => {
    const co2Data = datos.filter((dato: any) => dato.tipo_medicion === "CO2");
    const temperaturaData = datos.filter((dato: any) => dato.tipo_medicion === "Temperatura");
    const humedadData = datos.filter((dato: any) => dato.tipo_medicion === "Humedad");
  
    const createHTML = (data: any) => {
      return `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px;">Fecha</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Hora</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Valor Medido</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((dato: any) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${dato.fecha}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${dato.hora}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${dato.valor_medido}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    };
  
    const co2HTML = createHTML(co2Data);
    const temperaturaHTML = createHTML(temperaturaData);
    const humedadHTML = createHTML(humedadData);
  
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Datos Históricos</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            width: 90%;
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #0056b3;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f1f1f1;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>CO2</h1>
          ${co2HTML}
          <h1>Temperatura</h1>
          ${temperaturaHTML}
          <h1>Humedad</h1>
          ${humedadHTML}
        </div>
      </body>
      </html>
    `;
  
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `Datos_Historicos_${fechaInicio}_${fechaFin}.html`);
  };

  const descargarMD = (datos: any) => {
    const co2Data = datos.filter((dato: any) => dato.tipo_medicion === "CO2");
    const temperaturaData = datos.filter((dato: any) => dato.tipo_medicion === "Temperatura");
    const humedadData = datos.filter((dato: any) => dato.tipo_medicion === "Humedad");
  
    const createMD = (data: any) => {
      return data.map((dato: any) => `- **Fecha**: ${dato.fecha}, **Hora**: ${dato.hora}, **Valor Medido**: ${dato.valor_medido}`).join('\n');
    };
  
    const co2MD = createMD(co2Data);
    const temperaturaMD = createMD(temperaturaData);
    const humedadMD = createMD(humedadData);
  
    const blob = new Blob([`# CO2\n${co2MD}\n\n# Temperatura\n${temperaturaMD}\n\n# Humedad\n${humedadMD}`], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `Datos_Historicos_${fechaInicio}_${fechaFin}.md`);
  };

  const minDate = '2024-07-01';

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const localCurrentDate = `${year}-${month}-${day}`;
  
  return (
    <DashboardCard title="Descargar Datos Históricos">
      <Grid container spacing={5}>
        <Grid item xs={12} sm={3.5}>
          <TextField
            label="Fecha de Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ min: minDate, max: fechaFin || localCurrentDate }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={3.5}>
          <TextField
            label="Fecha de Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ min: fechaInicio || minDate, max: localCurrentDate }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={2.5}>
            <Select
              labelId="formato-label"
              id="formato"
              value={formato}
              onChange={(e) => setFormato(e.target.value as string)}
            >
              <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="xml">XML</MenuItem>
              <MenuItem value="sql">SQL</MenuItem>
              <MenuItem value="yaml">YAML</MenuItem>
              <MenuItem value="txt">TXT</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
              <MenuItem value="md">Markdown</MenuItem>
            </Select>
        </Grid>

        <Grid item xs={12} sm={2.5}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Button
              onClick={handleDescargar}
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              disabled={!fechaInicio || !fechaFin || fechaInicio < minDate || fechaFin > localCurrentDate}
            >
              Descargar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default DescargarDatosHistoricos;
