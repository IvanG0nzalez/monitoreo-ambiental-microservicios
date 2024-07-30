"use strict";
var models = require('../models');
var sensor = models.sensor;
var registros = models.registro_climatico;

const connectionStringRegex = /^Endpoint=sb:\/\/.*\.servicebus\.windows\.net\/;SharedAccessKeyName=.*;SharedAccessKey=.*;EntityPath=.*$/;
const { EventHubConsumerClient } = require("@azure/event-hubs");
const { v4: uuidv4 } = require('uuid');

const moment = require('moment-timezone');

var fecha_hora_actual = new Date();
// Ajustar la fecha y hora a la zona horaria de Ecuador (UTC-5)
var fecha_hora_utc = fecha_hora_actual.getTime();
var offset = -5 * 60 * 60 * 1000; // UTC-5 en milisegundos
var fecha_hora_local = new Date(fecha_hora_utc + offset);
class SensorControl {

    constructor() {
        this.activeClients = new Map();
    }

    async listar(req, res) {
        var lista = await sensor.findAll({
            attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
        });

        if (lista.length === 0) {
            return res.status(200).json({ msg: "No hay sensores registrados.", code: 200, datos: [] });
        }
        return res.status(200).json({ msg: "Sensores cargados correctamente.", code: 200, datos: lista });
    }

    async obtener_sensor(req, res) {
        const external = req.params.external;
        try {
            var sensors = await sensor.findOne({
                where: { external_id: external },
                attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
            });
            if (sensors === undefined || sensors == null) {
                res.status(404);
                res.json({ msg: "No existe ese sensor", code: 404 })
            } else {
                res.status(200);
                res.json({ msg: "OK", code: 200, datos: sensors });
            }
        } catch (error) {
            res.status(404);
            res.json({ msg: "No existe ese sensor", code: 404 });
        }
    }

    async obtener_registros_climaticos(req, res) {
        const external = req.params.external;
        try {
            var sensors = await sensor.findOne({
                where: { external_id: external },
                attributes: ['id'],
            });
            var lista = await registros.findAll({
                where: { id_sensor: sensors.id },
                attributes: ['fecha', 'hora', 'valor_medido', 'external_id']
            });
            if (lista == undefined || lista == null) {
                res.status(200);
                res.json({ msg: "Este sensor no tiene registros climáticos", code: 200, datos: lista });
            } else {
                res.status(200);
                res.json({ msg: "OK", code: 200, datos: lista })
            }
        } catch (error) {
            res.status(404);
            res.json({ msg: "No existe ese sensor", code: 404 });
        }
    }

    async ultimo_registro(req, res) {
        const fechaActual = fecha_hora_local.toISOString().slice(0, 10);

        var sensores = await sensor.findAll({
            include: [{
                model: models.registro_climatico, as: "registro_climatico",
                attributes: ['fecha', 'hora', 'valor_medido'],
                where: { fecha: fechaActual },
                order: [['fecha', 'DESC'], ['hora', 'DESC']],
                limit: 1,
            }],
            attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
        });

        if (sensores.length === 0 || sensores.every(sensor => sensor.registro_climatico.length === 0)) {
            
            const fechaAyer = new Date(fecha_hora_utc + offset - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

            sensores = await sensor.findAll({
                include: [{
                    model: models.registro_climatico, as: "registro_climatico",
                    attributes: ['fecha', 'hora', 'valor_medido'],
                    where: { fecha: fechaAyer },
                    order: [['fecha', 'DESC'], ['hora', 'DESC']],
                    limit: 1,
                }],
                attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
            });

            if (sensores.length === 0 || sensores.every(sensor => sensor.registro_climatico.length === 0)) {
                return res.status(200).json({ msg: "No se han registrado datos hace más de 48 horas", datos: [] });
            }
        }

        var lista = sensores.map(sensor => {
            let sensorJSON = sensor.toJSON();
            delete sensorJSON.id;
            return sensorJSON;
        });
        return res.status(200).json({ msg: "OK", code: 200, datos: lista });
    }

    async crear(req, res) {
        if (req.body.hasOwnProperty('alias') &&
            req.body.hasOwnProperty('cadena_conexion') &&
            req.body.hasOwnProperty('tipo_medicion')) {
            if (!connectionStringRegex.test(req.body.cadena_conexion)) {
                return res.status(202).json({ msg: "La cadena de conexión no es válida.", code: 400 });
            } else {
                var uuid = require('uuid');
                var data = {
                    alias: req.body.alias,
                    cadena_conexion: req.body.cadena_conexion,
                    tipo_medicion: req.body.tipo_medicion,
                    external_id: uuid.v4()
                }

                var result = await sensor.create(data);
                if (result === null) {
                    return res.status(202).json({ msg: "Error al crear el sensor.", code: 401 });
                } else {
                    const datos = {
                        alias: result.alias,
                        cadena_conexion: result.cadena_conexion,
                        tipo_medicion: result.tipo_medicion,
                        external_id: result.external_id
                    };
                    return res.status(201).json({ msg: "Sensor creado correctamente.", code: 201, datos });
                }
            }
        } else {
            return res.status(202).json({ msg: "Faltan datos.", code: 400 });
        }
    }

    async actualizar(req, res) {
        const external = req.params.external;
        try {
            var sensors = await sensor.findOne({ where: { external_id: external } });
            var tipo_medicion = req.body.tipo_medicion;
            if (tipo_medicion && tipo_medicion != "Temperatura" && tipo_medicion != "Humedad" && tipo_medicion != "CO2") {
                return res.status(202).json({ msg: "Los tipos disponibles son Temperatura, Humedad y CO2", code: 400 });
            }
            if (req.body.cadena_conexion && !connectionStringRegex.test(req.body.cadena_conexion)) {
                return res.status(202).json({ msg: "La cadena de conexión no es válida", code: 400 });
            }
            try {
                const data = {
                    alias: req.body.alias !== undefined ? req.body.alias : sensors.alias,
                    cadena_conexion: req.body.cadena_conexion !== undefined ? req.body.cadena_conexion : sensors.cadena_conexion,
                    tipo_medicion: req.body.tipo_medicion !== undefined ? req.body.tipo_medicion : sensor.tipo_medicion,
                };
                await sensors.update(data);
                return res.status(200).json({ msg: "Sensor modificado", code: 200 })
            } catch (error) {
                return res.status(202).json({ msg: "Error interno", code: 500 });
            }
        } catch (error) {
            return res.status(202).json({ msg: "Ese sensor no existe", code: 404 });
        }
    }

    async eliminar(req, res) {
        const { external } = req.params;

        if (!external) {
            return res.status(202).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const transaction = await models.sequelize.transaction();

        try {
            const sensorAux = await sensor.findOne({ where: { external_id: external }, transaction });

            if (!sensorAux) {
                return res.status(202).json({ msg: 'El sensor no existe', code: 404, datos: {} });
            }

            await registros.destroy({ where: { id_sensor: sensorAux.id }, transaction });

            await sensorAux.destroy({ transaction });

            await transaction.commit();
            return res.status(200).json({ msg: "Sensor eliminado correctamente", code: 200 });
        } catch (error) {
            await transaction.rollback();
            return res.status(202).json({ msg: "Error al eliminar el sensor", code: 404 });
        }
    }


    async iniciarMonitoreo() {
        const sensores = await sensor.findAll({
            attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
        });

        for (const sensorData of sensores) {
            this.monitorearSensor(sensorData);
        }
    }

    async monitorearSensor(sensorData) {
        const client = new EventHubConsumerClient("$Default", sensorData.cadena_conexion);

        console.log(`Iniciando monitoreo para sensor ${sensorData.alias} - ${sensorData.tipo_medicion}`);

        const subscription = client.subscribe({
            processEvents: async (events, context) => {
                for (const event of events) {
                    if (event.systemProperties["iothub-connection-device-id"] === sensorData.alias) {
                        console.log(`Mensaje recibido para ${sensorData.alias}: ${JSON.stringify(event.body)}`);
                        const datos = event.body;
                        await this.guardarRegistro(sensorData, datos);
                    }
                }
            },
            processError: async (err, context) => {
                console.error(`Error en sensor ${sensorData.alias}: ${err.message}`);
            }
        });

        // Guardamos el cliente y la suscripción
        this.activeClients.set(sensorData.external_id, { client, subscription });
    }

    async guardarRegistro(sensorData, datos) {
        let valorMedido;

        switch (sensorData.tipo_medicion) {
            case 'Temperatura':
                valorMedido = datos.Temperatura;
                break;
            case 'Humedad':
                valorMedido = datos.Humedad;
                break;
            case 'CO2':
                valorMedido = datos.CO2;
                break;
            default:
                console.log(`Tipo de medición no reconocido: ${sensorData.tipo_medicion}`);
                return;
        }

        if (valorMedido !== undefined && valorMedido !== null) {
            try {
                const sensorEncontrado = await sensor.findOne({
                    where: {
                        external_id: sensorData.external_id
                    }
                });

                if (!sensorEncontrado) {
                    console.log(`Sensor no encontrado para ${sensorData.alias} - ${sensorData.tipo_medicion}`);
                    return;
                }

                const fechaHoraEcuador = moment().tz('America/Guayaquil');
                const fecha_actual = fechaHoraEcuador.format('YYYY-MM-DD');
                const hora_actual = fechaHoraEcuador.format('HH:mm:ss');

                await registros.create({
                    fecha: fecha_actual,
                    hora: hora_actual,
                    valor_medido: valorMedido,
                    id_sensor: sensorEncontrado.id,
                    external_id: uuidv4()
                });
                console.log(`Registro guardado para ${sensorData.alias} - ${sensorData.tipo_medicion}: ${valorMedido}`);
            } catch (error) {
                console.error(`Error al guardar registro: ${error.message}`);
            }
        } else {
            console.log(`Valor nulo o indefinido para ${sensorData.alias} - ${sensorData.tipo_medicion}, no se guarda.`);
        }
    }

    async obtenerEstadoMonitoreo(req, res) {
        const hayClientesActivos = this.activeClients.size > 0;
        return res.status(200).json({ code: 200, datos: hayClientesActivos });
    }

    async iniciarMonitoreoTodosSensores(req, res) {
        try {
            await this.iniciarMonitoreo();
            res.status(200).json({ msg: "Monitoreo de sensores iniciado", code: 200 });
        } catch (error) {
            res.status(500).json({ msg: "Error al iniciar el monitoreo", code: 500, error: error.message });
        }
    }

    async detenerMonitoreo(req, res) {
        try {
            for (const [sensorId, { client, subscription }] of this.activeClients) {
                await subscription.close();
                await client.close();
                console.log(`Monitoreo detenido para sensor ${sensorId}`);
            }
            this.activeClients.clear();
            res.status(200).json({ msg: "Monitoreo de sensores detenido", code: 200 });
        } catch (error) {
            res.status(500).json({ msg: "Error al detener el monitoreo", code: 500, error: error.message });
        }
    }

}

module.exports = SensorControl;