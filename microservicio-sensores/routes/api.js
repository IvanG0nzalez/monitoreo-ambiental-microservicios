var express = require('express');
var router = express.Router();
const sensorC = require('../app/controls/SensorControl');
let sensorControl = new sensorC();
const registrosC = require('../app/controls/RegistroControl');
let registrosControl = new registrosC();

//API sensores
router.get('/sensores',sensorControl.listar);
router.get('/sensores/buscar/:external', sensorControl.obtener_sensor);
router.post('/sensores/guardar', sensorControl.guardar);
router.get('/sensores/registros/buscar/:external', sensorControl.obtener_registros_climaticos);
router.patch('/sensores/modificar/:external',sensorControl.modificar);
router.get('/sensores/ultimo_registro', sensorControl.ultimo_registro);

//API registros
router.get('/registros/listar/hoy', registrosControl.listar_hoy);
router.get('/registros/listar', registrosControl.listar);
router.get('/registros/listar/fecha/:fecha',registrosControl.listar_por_fecha);
router.post('/registros/guardar/manual', registrosControl.guardar_manual);

module.exports = router;
