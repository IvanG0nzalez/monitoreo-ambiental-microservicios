"use strict";
var models = require('../models');
var sensor = models.sensor;
var registros = models.registro_climatico;
const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;


class SensorControl {
    async listar(req, res) {
        var lista = await sensor.findAll({
            attributes: ['alias', 'ip', 'tipo_medicion', 'external_id'],
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async obtener_sensor(req, res) {
        const external = req.params.external;
        try {
            var sensors = await sensor.findOne({
                where: { external_id: external },
                attributes: ['alias', 'ip', 'tipo_medicion', 'external_id'],
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

    async guardar(req, res) {
        if (req.body.hasOwnProperty('alias') &&
            req.body.hasOwnProperty('ip') &&
            req.body.hasOwnProperty('tipo_medicion')) {
            if (!ipv4Regex.test(req.body.ip)) {
                res.status(400);
                res.json({ msg: "Error", tag: "La dirección IP no es válida", code: 400 });
            } else {
                var uuid = require('uuid');
                var data = {
                    alias: req.body.alias,
                    ip: req.body.ip,
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
            if (req.body.ip && !ipv4Regex.test(req.body.ip)) {
                return res.status(400).json({ msg: "Error", tag: "La dirección IP no es válida", code: 400 });
            }
            try {
                const data = {
                    alias: req.body.alias !== undefined ? req.body.alias : sensors.alias,
                    ip: req.body.ip !== undefined ? req.body.ip : sensors.ip,
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

}

module.exports = SensorControl;