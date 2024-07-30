"use strict";
var models = require('../models');
var registros = models.registro_climatico;
var sensor = models.sensor;
var sequelize = models.sequelize;
const { Op } = require('sequelize')

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

        if (lista.length !== 0) {
            const datos = lista.map(registro => {
                return {
                    fecha: registro.fecha,
                    hora: registro.hora,
                    valor_medido: registro.valor_medido,
                    external_id: registro.external_id,
                    tipo_medicion: registro.sensor.tipo_medicion,
                };
            });

            return res.status(200).json({ msg: "Registros cargados correctamente", code: 200, datos: datos });
        } else {
            const fechaAyer = new Date(fecha_hora_utc + offset - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

            lista = await registros.findAll({
                where: { fecha: fechaAyer },
                include: [{
                    model: models.sensor, as: "sensor",
                    attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
                },],
                attributes: ['fecha', 'hora', 'valor_medido', 'external_id'],
            });

            const datos = lista.map(registro => {
                return {
                    fecha: registro.fecha,
                    hora: registro.hora,
                    valor_medido: registro.valor_medido,
                    external_id: registro.external_id,
                    tipo_medicion: registro.sensor.tipo_medicion,
                };
            });

            if (lista.length === 0) {
                return res.status(200).json({ msg: "No se han registrado datos hace más de 48 horas", datos: datos });
            } else {
                return res.status(200).json({ msg: "No existen registros de hoy, se muestran registros de ayer", code: 202, datos: datos });
            }
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

        const datos = lista.map(registro => {
            return {
                fecha: registro.fecha,
                hora: registro.hora,
                valor_medido: registro.valor_medido,
                external_id: registro.external_id,
                tipo_medicion: registro.sensor.tipo_medicion,
            };
        });

        return res.status(200).json({ msg: "OK", code: 200, datos: datos });
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
            res.json({ msg:"No existen registros de la fecha " + fecha, datos: lista });
        } else {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: lista });
        }
    }

    async listar_entre_fechas(req, res) {
        const { fecha_inicio, fecha_fin } = req.params;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(202).json({ msg: "Fechas no proporcionadas", code: 400 });
        }

        const inicio = new Date(fecha_inicio);
        const fin = new Date(fecha_fin);

        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            return res.status(202).json({ msg: "Formato de fecha inválido", code: 400 });
        }

        if (inicio > fin) {
            return res.status(202).json({ msg: "La fecha de inicio no puede ser después de la fecha de fin", code: 400 });
        }

        try {
            var lista = await registros.findAll({
                where: {
                    fecha: {
                        [Op.between]: [fecha_inicio, fecha_fin]
                    }
                },
                include: [{
                    model: models.sensor, as: "sensor",
                    attributes: ['alias', 'tipo_medicion'],
                }],
                attributes: ['fecha', 'hora', 'valor_medido', 'external_id'],
            });

            if (lista.length === 0) {
                res.status(240).json({ msg: "No existen registros entre esas fechas", datos: lista });
            } else {
                const datos_registro = lista.map(registro => {
                    return {
                        fecha: registro.fecha,
                        hora: registro.hora,
                        valor_medido: registro.valor_medido,
                        tipo_medicion: registro.sensor.tipo_medicion,
                    }
                });
                res.status(200).json({ msg: "OK", code: 200, datos: datos_registro });
            }
        } catch (error) {
            console.error(`Error al listar registros entre fechas: ${error.message}`);
            res.status(202).json({ msg: "Error interno del servidor", code: 500 });
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