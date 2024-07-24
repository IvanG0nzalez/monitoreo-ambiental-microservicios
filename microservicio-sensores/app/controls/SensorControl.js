"use strict";
var models = require('../models');
var sensor = models.sensor;
var registros = models.registro_climatico;
const connectionStringRegex = /^Endpoint=sb:\/\/.*\.servicebus\.windows\.net\/;SharedAccessKeyName=.*;SharedAccessKey=.*;EntityPath=.*$/;
const { EventHubConsumerClient } = require("@azure/event-hubs");
const { v4: uuidv4 } = require('uuid');

const moment = require('moment-timezone');
class SensorControl {

    constructor() {
        this.activeClients = new Map();
    }

    async listar(req, res) {
        var lista = await sensor.findAll({
            attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
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
        var sensores = await sensor.findAll({
            include: [{
                model: models.registro_climatico, as: "registro_climatico",
                attributes: ['fecha', 'hora', 'valor_medido'],
                order: [['fecha', 'DESC'], ['hora', 'DESC']],
                limit: 1,
            }],
            attributes: ['alias', 'cadena_conexion', 'tipo_medicion', 'external_id'],
        });
        var lista = sensores.map(sensor => {
            let sensorJSON = sensor.toJSON();
            delete sensorJSON.id;
            return sensorJSON;
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async guardar(req, res) {
        if (req.body.hasOwnProperty('alias') &&
            req.body.hasOwnProperty('cadena_conexion') &&
            req.body.hasOwnProperty('tipo_medicion')) {
            if (!connectionStringRegex.test(req.body.cadena_conexion)) {
                res.status(400);
                res.json({ msg: "Error", tag: "La cadena de conexión no es válida", code: 400 });
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
                    res.status(401);
                    res.json({ msg: "Error", tag: "No se guardó el sensor", code: 401 });
                } else {
                    res.status(200);
                    res.json({ msg: "OK", tag: "Sensor guardado", code: 200 });
                }
            }
        } else {
            res.status(400);
            res.json({ msg: "Error", tag: "Faltan datos", code: 400 });
        }
    }

    async modificar(req, res) {
        const external = req.params.external;
        try {
            var sensors = await sensor.findOne({ where: { external_id: external } });
            var tipo_medicion = req.body.tipo_medicion;
            if (tipo_medicion && tipo_medicion != "Temperatura" && tipo_medicion != "Humedad" && tipo_medicion != "CO2") {
                return res.status(400).json({ msg: "Error", tag: "Los tipos disponibles son Temperatura, Humedad y CO2", code: 400 });
            }
            if (req.body.cadena_conexion && !connectionStringRegex.test(req.body.cadena_conexion)) {
                return res.status(400).json({ msg: "Error", tag: "La cadena de conexión no es válida", code: 400 });
            }
            try {
                const data = {
                    alias: req.body.alias !== undefined ? req.body.alias : sensors.alias,
                    cadena_conexion: req.body.cadena_conexion !== undefined ? req.body.cadena_conexion : sensors.cadena_conexion,
                    tipo_medicion: req.body.tipo_medicion !== undefined ? req.body.tipo_medicion : sensor.tipo_medicion,
                };
                await sensors.update(data);
                res.status(200);
                res.json({ msg: "OK", tag: "Sensor modificado", code: 200 })
            } catch (error) {
                return res.status(500).json({ msg: "Error", tag: "Error interno", code: 500 });
            }
        } catch (error) {
            res.status(404);
            res.json({ msg: "Error", tag: "Ese sensor no existe", code: 404 });
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
                    // Asegúrate de que la verificación de eventos sea correcta para cada sensor
                    if (event.systemProperties["iothub-connection-device-id"] === sensorData.alias) {
                        console.log(`Mensaje recibido para ${sensorData.alias}: ${JSON.stringify(event.body)}`);
                        const datos = event.body;
                        await registrosControl.guardar(sensorData, datos);
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