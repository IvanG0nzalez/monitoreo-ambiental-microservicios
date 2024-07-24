"use strict";
var models = require('../models');
var registros = models.registro_climatico;
var sensor = models.sensor;
var sequelize = models.sequelize;

var fecha_hora_actual = new Date();
// Ajustar la fecha y hora a la zona horaria de Ecuador (UTC-5)
var fecha_hora_utc = fecha_hora_actual.getTime();
var offset = -5 * 60 * 60 * 1000; // UTC-5 en milisegundos
var fecha_hora_local = new Date(fecha_hora_utc + offset);

class RegistroControl {
    async listar_hoy(req, res) {
        const fechaActual = fecha_hora_local.toISOString().slice(0, 10);
        var lista = await registros.findAll({
            where: { fecha: fechaActual },
            include: [{
                model: models.sensor, as: "sensor",
                attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
            },],
            attributes: ['fecha', 'hora', 'valor_medido', 'external_id'],
        });
        if (lista.length === 0) {
            res.status(200);
            res.json({ msg: "OK", tag: "No existen registros el día de hoy", datos: lista });
        } else {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: lista });
        }
    }

    async listar(req, res) {
        var lista = await registros.findAll({
            include: [{
                model: models.sensor, as: "sensor",
                attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
            },],
            attributes: ['fecha', 'hora', 'valor_medido', 'external_id'],
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async listar_por_fecha(req, res) {
        const fecha = req.params.fecha;
        var lista = await registros.findAll({
            where: { fecha: fecha },
            include: [{
                model: models.sensor, as: "sensor",
                attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
            },],
            attributes: ['fecha', 'hora', 'valor_medido', 'external_id'],
        });
        if (lista.length === 0) {
            res.status(200);
            res.json({ msg: "OK", tag: "No existen registros de la fecha " + fecha, datos: lista });
        } else {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: lista });
        }
    }

    async guardar(sensorData, datos) {
        let valor_medido;

        switch (sensorData.tipo_medicion) {
            case 'Temperatura':
                valor_medido = datos.Temperatura;
                break;
            case 'Humedad':
                valor_medido = datos.Humedad;
                break;
            case 'CO2':
                valor_medido = datos.CO2;
                break;
            default:
                console.log(`Tipo de medición no reconocido: ${sensorData.tipo_medicion}`);
                return;
        }

        if (valor_medido !== undefined && valor_medido !== null) {
            var uuid = require("uuid");
            try {
                const sensorAux = await sensor.findOne({
                    where: {
                        alias: sensorData.alias,
                        tipo_medicion: sensorData.tipo_medicion
                    }
                });

                if (!sensorAux) {
                    console.log(`Sensor no encontrado para ${sensorData.alias} - ${sensorData.tipo_medicion}`);
                    return;
                }

                const fecha_actual = fecha_hora_local.toISOString().slice(0, 10);
                const hora_actual = fecha_hora_local.toTimeString().slice(0, 8);

                const data = {
                    fecha: fecha_actual,
                    hora: hora_actual,
                    valor_medido: valor_medido,
                    id_sensor: sensorAux.id,
                    external_id: uuid.v4(),
                }

                await registros.create(data);

                console.log(`Registro guardado para ${sensorData.alias} - ${sensorData.tipo_medicion}: ${valor_medido}`);

            } catch (error) {
                console.error(`Error al guardar registro manual: ${error.message}`);
            }
        } else {
            console.log(`Valor nulo o indefinido para ${sensorData.alias} - ${sensorData.tipo_medicion}, no se guarda.`);
        }
    }
}

module.exports = RegistroControl;