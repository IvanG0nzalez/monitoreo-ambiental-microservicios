"use strict";

const models = require('../models');
const api_cuentas = require('../Conection');
const { sendMessage, connect } = require('../rabbitmq');
let rol = models.rol;
let usuario = models.usuario;
class UsuarioController {
    async listar(req, res) {
        const lista_usuarios = await usuario.findAll({
            attributes: ['cedula', 'nombres', 'apellidos', 'external_id'],
            include: [{
                model: rol,
                as: 'rol',
                attributes: ['nombre', 'external_id']
            }]
        });

        if (!lista_usuarios) {
            return res.status(204).json({ msg: 'No hay usuarios registrados', code: 204, datos: [] });
        }

        return res.status(200).json({ msg: 'Lista de usuarios', code: 200, datos: lista_usuarios });
    }

    async obtener(req, res) {
        const { external_id } = req.params;

        if (!external_id) {
            return res.status(400).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const usuario_obtenido = await usuario.findOne({
            where: { external_id: external_id },
            attributes: ['cedula', 'nombres', 'apellidos', 'external_id'],
            include: [{
                model: rol,
                as: 'rol',
                attributes: ['nombre', 'external_id']
            }]
        });

        if (!usuario_obtenido) {
            return res.status(404).json({ msg: 'Usuario no encontrado', code: 404, datos: {} });
        }

        return res.status(200).json({ msg: 'Usuario encontrado', code: 200, datos: usuario_obtenido });
    }

    async crear(req, res) {
        const { correo, nombre_usuario, clave, cedula, nombres, apellidos, external_rol } = req.body;

        if (!correo || !nombre_usuario || !clave || !external_rol || !cedula) {
            return res.status(400).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const rolAux = await rol.findOne({ where: { external_id: external_rol } });

        if (!rolAux) {
            return res.status(404).json({ msg: 'Rol no encontrado', code: 404, datos: {} });
        }

        const transaction = await models.sequelize.transaction();

        try {
            const UUID = require('uuid');

            const nuevo_usuario = await usuario.create({
                cedula: cedula,
                nombres: nombres,
                apellidos: apellidos,
                id_rol: rolAux.id,
                external_id: UUID.v4(),
            }, { transaction });

            if (!nuevo_usuario) {
                await transaction.rollback();
                return res.status(500).json({ msg: 'Error al crear usuario', code: 500, datos: {} });
            }

            await connect();
            await sendMessage('usuario_creado', { 
                correo,
                nombre_usuario,
                clave,
                id_usuario: nuevo_usuario.id
            });

            await transaction.commit();
            return res.status(201).json({ msg: 'Usuario creado', code: 201 });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ msg: 'Error al crear usuario', code: 500, datos: {} });
        }
    }

    async actualizar(req, res) {
        const { external_id } = req.params;
        const { correo, nombre_usuario, clave, cedula, nombres, apellidos } = req.body;

        if (!external_id) {
            return res.status(400).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const usuarioAux = await usuario.findOne({ where: { external_id: external_id } });

        if (!usuarioAux) {
            return res.status(404).json({ msg: 'Usuario no encontrado', code: 404, datos: {} });
        }

        let camposActualizar = {};
        if (cedula) camposActualizar.cedula = cedula;
        if (nombres) camposActualizar.nombres = nombres;
        if (apellidos) camposActualizar.apellidos = apellidos;

        const transaction = await models.sequelize.transaction();

        try {
            const usuario_actualizado = await usuario.update(camposActualizar, { where: { external_id: external_id }, transaction });

            if (!usuario_actualizado) {
                await transaction.rollback();
                return res.status(500).json({ msg: 'Error al actualizar usuario', code: 500, datos: {} });
            }

            if (correo || nombre_usuario || clave) {
                const response = await api_cuentas.actualizar({
                    correo: correo,
                    nombre_usuario: nombre_usuario,
                    clave: clave,
                }, usuarioAux.id);

                if (response.status !== 200) {
                    await transaction.rollback();
                    return res.status(500).json({ msg: 'Error al actualizar cuenta', code: 500, datos: {} });
                }
            }

            await transaction.commit();
            return res.status(200).json({ msg: 'Usuario actualizado', code: 200 });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ msg: 'Error al actualizar usuario', code: 500, datos: {} });
        }
    }

    async eliminar(req, res) {
        const { external_id } = req.params;

        if (!external_id) {
            return res.status(400).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const usuarioAux = await usuario.findOne({ where: { external_id: external_id } });

        if (!usuarioAux) {
            return res.status(404).json({ msg: 'Usuario no encontrado', code: 404, datos: {} });
        }

        const transaction = await models.sequelize.transaction();

        try {
            const usuario_eliminado = await usuario.destroy({ where: { external_id: external_id }, transaction });

            if (!usuario_eliminado) {
                await transaction.rollback();
                return res.status(500).json({ msg: 'Error al eliminar usuario', code: 500, datos: {} });
            }

            const response = await api_cuentas.eliminar(usuarioAux.id);

            if (response.status !== 200) {
                await transaction.rollback();
                return res.status(500).json({ msg: 'Error al eliminar cuenta', code: 500, datos: {} });
            }

            await transaction.commit();
            return res.status(200).json({ msg: 'Usuario eliminado', code: 200 });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ msg: 'Error al eliminar usuario', code: 500, datos: {} });
        }
    }
}

module.exports = UsuarioController;