"use strict";

const bcrypt = require('bcrypt');
const models = require('../models');
let cuenta = models.cuenta;

class CuentaController {
    async crear(req, res) {
        const { correo, nombre_usuario, clave, id_usuario } = req.body;

        if (!correo || !nombre_usuario || !clave || !id_usuario) {
            return res.status(400).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const cuentaAux = await cuenta.findOne({ where: { correo: correo } });

        if(cuentaAux) {
            return res.status(400).json({ msg: 'Correo ya registrado', code: 400, datos: {} });
        }

        const UUID = require('uuid');
        const claveCifrada = await bcrypt.hash(clave, 10);

        const nueva_cuenta = await cuenta.create({
            correo: correo,
            nombre_usuario: nombre_usuario,
            clave: claveCifrada,
            id_usuario: id_usuario,
            external_id: UUID.v4(),
        });

        if (!nueva_cuenta) {
            return res.status(500).json({ msg: 'Error al crear cuenta', code: 500, datos: {} });
        }

        return res.status(201).json({ msg: 'Cuenta creada', code: 201 });
    }

    async actualizar(req, res) {
        const id_usuario = req.params.id_usuario;
        const { correo, nombre_usuario, clave } = req.body;

        if (!correo && !nombre_usuario && !clave) {
            return res.status(400).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const cuentaAux = await cuenta.findOne({ where: { id_usuario: id_usuario } });

        if(!cuentaAux) {
            return res.status(404).json({ msg: 'Cuenta no encontrada', code: 404, datos: {} });
        }

        let camposActualizar = {};
        if (correo)  camposActualizar.correo = correo;
        if (nombre_usuario)  camposActualizar.nombre_usuario = nombre_usuario;
        if (clave)  camposActualizar.clave = await bcrypt.hash(clave, 10);

        const cuenta_actualizada = await cuenta.update(camposActualizar, { where: {id_usuario: id_usuario} });

        if (!cuenta_actualizada) {
            return res.status(500).json({ msg: 'Error al actualizar cuenta', code: 500, datos: {} });
        }

        return res.status(200).json({ msg: 'Cuenta actualizada', code: 200 });
    }

    async eliminar(req, res) {
        const id_usuario = req.params.id_usuario;

        if (!id_usuario) {
            return res.status(400).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const cuentaAux = await cuenta.findOne({ where: { id_usuario: id_usuario } });

        if(!cuentaAux) {
            return res.status(404).json({ msg: 'Cuenta no encontrada', code: 404, datos: {} });
        }

        const cuenta_eliminada = await cuenta.destroy({ where: { id_usuario: id_usuario } });

        if (!cuenta_eliminada) {
            return res.status(500).json({ msg: 'Error al eliminar cuenta', code: 500, datos: {} });
        }

        return res.status(200).json({ msg: 'Cuenta eliminada', code: 200, datos: cuenta_eliminada });
    }

    async inicio_sesion(req, res) {
        
    }
}

module.exports = CuentaController;