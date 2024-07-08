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
                attributes: ['alias', 'ip', 'tipo_medicion', 'external_id'],
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
                attributes: ['alias', 'ip', 'tipo_medicion', 'external_id'],
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
                attributes: ['alias', 'ip', 'tipo_medicion', 'external_id'],
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

    async guardar_manual(req, res) {
        if (req.body.hasOwnProperty('valor_medido') &&
            req.body.hasOwnProperty('sensor')) {
            var uuid = require("uuid");
            try {
                var sensorAux = await sensor.findOne({ where: { external_id: req.body.sensor } });

                var fecha_actual = fecha_hora_local.toISOString().slice(0, 10);
                var hora_actual = fecha_hora_local.toTimeString().slice(0, 8);

                var data = {
                    fecha: fecha_actual,
                    hora: hora_actual,
                    valor_medido: req.body.valor_medido,
                    id_sensor: sensorAux.id,
                    external_id: uuid.v4(),
                }
                var result = await registros.create(data);
                if (result === null) {
                    res.status(401);
                    res.json({ msg: "Error", tag: "No se guardó el registro climático", code: 401 });
                } else {
                    res.status(200);
                    res.json({ msg: "OK", tag: "Registro climático guardado", code: 200 });
                }
            } catch (error) {
                res.status(404);
                res.json({ msg: "Error", tag: "El sensor no existe", code: 404 });
            }
        } else {
            res.status(400);
            res.json({ msg: "Error", tag: "Faltan datos", code: 400 });
        }
    }

}
module.exports = RegistroControl;