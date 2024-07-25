"use strict";

const models = require('../models');
let rol = models.rol;

class RolController {
    async listar(req, res) {
        const lista_roles = await rol.findAll({
            attributes: ['nombre', 'external_id']
        });

        if (lista_roles.length === 0) {
            return res.status(204).json({ msg: 'No hay roles registrados', code: 204, datos: [] });
        }

        return res.status(200).json({ msg: 'Lista de roles', code: 200, datos: lista_roles });
    }

    async obtener(req, res) {
        const { external_id } = req.params;

        if (!external_id) {
            return res.status(202).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const rol_obtenido = await rol.findOne({
            where: { external_id: external_id },
            attributes: ['nombre', 'external_id']
        });

        if (!rol_obtenido) {
            return res.status(202).json({ msg: 'Rol no encontrado', code: 404, datos: {} });
        }

        return res.status(200).json({ msg: 'Rol encontrado', code: 200, datos: rol_obtenido });
    }

    async crear(req, res) {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(202).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const UUID = require('uuid');

        const nuevo_rol = await rol.create({ 
            nombre: nombre,
            external_id: UUID.v4()
        });

        if (!nuevo_rol) {
            return res.status(202).json({ msg: 'Error al crear el rol', code: 500, datos: {} });
        }

        return res.status(201).json({ msg: 'Rol creado', code: 201 });
    }

    async actualizar(req, res) {
        const { external_id } = req.params;
        const { nombre } = req.body;

        if (!external_id || !nombre) {
            return res.status(202).json({ msg: 'Parámetros incorrectos', code: 400, datos: {} });
        }

        const rol_obtenido = await rol.findOne({
            where: { external_id: external_id }
        });

        if (!rol_obtenido) {
            return res.status(202).json({ msg: 'Rol no encontrado', code: 404, datos: {} });
        }

        const rol_actualizado = await rol_obtenido.update({ nombre: nombre });

        if (!rol_actualizado) {
            return res.status(202).json({ msg: 'Error al actualizar el rol', code: 500, datos: {} });
        }

        return res.status(200).json({ msg: 'Rol actualizado', code: 200, datos: rol_actualizado });
    }
}

module.exports = RolController;