"use strict";

const bcrypt = require('bcrypt');
let jwt = require("jsonwebtoken");
require('dotenv').config();

const models = require('../models');
const { sendMessage } = require('../rabbitmq');
let cuenta = models.cuenta;

class CuentaController {
    async listar(req, res) {
        const lista_cuentas = await cuenta.findAll({
            attributes: ['correo', 'nombre_usuario', 'id_usuario', 'external_id']
        });

        if (lista_cuentas.length === 0) {
            return res.status(204).json({ msg: 'No hay cuentas registradas', code: 204, datos: [] });
        }

        return res.status(200).json({ msg: 'Lista de cuentas', code: 200, datos: lista_cuentas });
    }

    /*async listar_rabbit(message) {
        const lista_cuentas = await cuenta.findAll({
            attributes: ['id_usuario','correo', 'nombre_usuario', 'external_id']
        });
        await sendMessage('cuentas', {cuentas:lista_cuentas});

    }*/

    async obtener(req, res) {
        const id_usuario = req.params.id_usuario;

        if (!id_usuario) {
            return res.status(202).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const cuentaAux = await cuenta.findOne({
            where: { id_usuario: id_usuario },
            attributes: ['correo', 'nombre_usuario', 'id_usuario', 'external_id']
        });

        if (!cuentaAux) {
            return res.status(202).json({ msg: 'Cuenta no encontrada', code: 404, datos: {} });
        }

        return res.status(200).json({ msg: 'Cuenta encontrada', code: 200, datos: cuentaAux });
    }

    async crear(message) {
        const { correo, nombre_usuario, clave, id_usuario } = message;

        const cuentaAux = await cuenta.findOne({ where: { correo: correo } });

        if (cuentaAux) {
            return await sendMessage('cuenta_creada', { success: false, msg: 'Ya existe una cuenta con ese correo' });
        }

        const transaction = await models.sequelize.transaction();

        try {
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
                await transaction.rollback();
                return await sendMessage('cuenta_creada', { success: false, msg: 'Error al crear la cuenta' });
            }

            await transaction.commit();
            return await sendMessage('cuenta_creada', { success: true, msg: 'Cuenta creada correctamente' });
        } catch (error) {
            await transaction.rollback();
            return await sendMessage('cuenta_creada', { success: false, msg: 'Error al crear la cuenta' });
        }
    }
    
    async actualizar(message) {
        const { correo, nombre_usuario, clave, id_usuario } = message;
        /*if (!correo && !nombre_usuario && !clave) {
            return res.status(400).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }*/

        const cuentaAux = await cuenta.findOne({ where: { id_usuario: id_usuario } });

        if (!cuentaAux) {
            return res.status(202).json({ msg: 'Cuenta no encontrada', code: 404, datos: {} });
        }

        let camposActualizar = {};
        if (correo) camposActualizar.correo = correo;
        if (nombre_usuario) camposActualizar.nombre_usuario = nombre_usuario;
        if (clave) camposActualizar.clave = await bcrypt.hash(clave, 10);

        try {
            const cuenta_actualizada = await cuenta.update(camposActualizar, { where: { id_usuario: id_usuario } });
            if (!cuenta_actualizada) {
                return await sendMessage('cuenta_actualizada', { success: false, msg: 'Error al actualizar la cuenta' });

            }
            return await sendMessage('cuenta_actualizada', { success: true, msg: 'Cuenta actualizada correctamente' });
        } catch (error) {
            return await sendMessage('cuenta_actualizada', { success: false, msg: 'Error al actualizar la cuenta' });
        }

    }

    async eliminar(message) {
        const id_usuario = message.id_usuario;

        if (!id_usuario) {
            return await sendMessage('cuenta_eliminada', { success: false, msg: 'Parámetros incorrectos' });
        }

        const cuentaAux = await cuenta.findOne({ where: { id_usuario: id_usuario } });

        if (!cuentaAux) {
            return await sendMessage('cuenta_eliminada', { success: false, msg: 'Cuenta no encontrada' });
        }

        const cuenta_eliminada = await cuenta.destroy({ where: { id_usuario: id_usuario } });

        if (!cuenta_eliminada) {
            return await sendMessage('cuenta_eliminada', { success: false, msg: 'Error al eliminar la cuenta' });
        }else{
            return await sendMessage('cuenta_eliminada', {success: true, msg: 'Cuenta eliminada correctamente'});
        }

        
    }

    /*async eliminar(req, res) {
        const id_usuario = req.params.id_usuario;

        if (!id_usuario) {
            return res.status(202).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const cuentaAux = await cuenta.findOne({ where: { id_usuario: id_usuario } });

        if (!cuentaAux) {
            return res.status(202).json({ msg: 'Cuenta no encontrada', code: 404, datos: {} });
        }

        const cuenta_eliminada = await cuenta.destroy({ where: { id_usuario: id_usuario } });

        if (!cuenta_eliminada) {
            return res.status(202).json({ msg: 'Error al eliminar cuenta', code: 500, datos: {} });
        }

        return res.status(200).json({ msg: 'Cuenta eliminada', code: 200, datos: cuenta_eliminada });
    }*/

    async inicio_sesion(req, res) {
        const { correo, clave } = req.body;

        if (!correo || !clave) {
            return res.status(202).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const cuentaAux = await cuenta.findOne({ where: { correo: correo } });

        if (!cuentaAux) {
            return res.status(202).json({ msg: 'Credenciales incorrectas', code: 404, datos: {} });
        }

        if (!cuentaAux.estado) {
            return res.status(202).json({ msg: 'Cuenta deshabilitada', code: 401, datos: {} });
        }

        const claveCorrecta = await bcrypt.compare(clave, cuentaAux.clave);

        if (!claveCorrecta) {
            return res.status(202).json({ msg: 'Credenciales incorrectas', code: 401, datos: {} });
        }

        const token_data = {
            external: cuentaAux.external_id,
            id_usuario: cuentaAux.id_usuario,
            check: true,
        };

        const key = process.env.KEY;
        const token = jwt.sign(token_data, key, { expiresIn: '4h' });

        var data = {
            token: token,
            external: cuentaAux.external_id,
            nombre_usuario: cuentaAux.nombre_usuario,
        };

        return res.status(200).json({ msg: `Bienvenido, ${cuentaAux.nombre_usuario}`, code: 200, datos: data });
    }
}

module.exports = CuentaController;