import axios from 'axios';
import { save, saveToken } from './SessionUtils';

const URL_BASE = "http://localhost:80/api";

const endpoints = {
    cuentas: {
        inicio_sesion: `${URL_BASE}/cuentas/inicio_sesion`,
        obtener: `${URL_BASE}/cuentas/`,
    },
    usuarios: {
        obtener: `${URL_BASE}/usuarios/`,
        crear: `${URL_BASE}/usuarios/crear`,
        actualizar: `${URL_BASE}/usuarios/actualizar/`,
        eliminar: `${URL_BASE}/usuarios/eliminar/`,
    },
    roles: {
        obtener: `${URL_BASE}/roles/`,
        crear: `${URL_BASE}/roles/crear`,
        actualizar: `${URL_BASE}/roles/actualizar/`,
    },
    sensores: {
        obtener: `${URL_BASE}/sensores/`,
        crear: `${URL_BASE}/sensores/crear`,
        registros: `${URL_BASE}/sensores/registros/`,
        ultimo_registro: `${URL_BASE}/sensores/ultimo_registro`,
        actualizar: `${URL_BASE}/sensores/actualizar/`,
        eliminar: `${URL_BASE}/sensores/eliminar/`,
        iniciar_monitoreo: `${URL_BASE}/sensores/iniciar-monitoreo`,
        detener_monitoreo: `${URL_BASE}/sensores/detener-monitoreo`,
    },
    registros: {
        listar_hoy: `${URL_BASE}/registros/listar/hoy`,
        listar: `${URL_BASE}/registros/listar`,
        listar_por_fecha: `${URL_BASE}/registros/listar/fecha/`,
    },
};

export const api_cuentas = {
    inicio_sesion: async (datos) => {
        const response = await axios.post(endpoints.cuentas.inicio_sesion, datos);
        if (response && response.data.code === 200 && response.data.datos.token) {
            saveToken(response.data.datos.token);
            save('nombre_usuario', response.data.datos.nombre_usuario);
            save('external', response.data.datos.external);
        }
        return response;
    },
    listar: async (token) => await axios.get(endpoints.cuentas.obtener, { headers: { token: token }}),
    obtener: async (external_id, token) => await axios.get(endpoints.cuentas.obtener + external_id, { headers: { token: token }}),
};

export const api_usuarios = {
    listar: async (token) => await axios.get(endpoints.usuarios.obtener, { headers: { token: token }}),
    obtener: async (external_id, token) => await axios.get(endpoints.usuarios.obtener + external_id, { headers: { token: token }}),
    crear: async (datos, token) => await axios.post(endpoints.usuarios.crear, datos, { headers: { token: token }}),
    actualizar: async (external_id, datos, token) => await axios.patch(endpoints.usuarios.actualizar + external_id, datos, { headers: { token: token }}),
    eliminar: async (external_id, token) => await axios.delete(endpoints.usuarios.eliminar + external_id, { headers: { token: token }}),
};

export const api_roles = {
    listar: async (token) => await axios.get(endpoints.roles.obtener, { headers: { token: token }}),
    obtener: async (external_id, token) => await axios.get(endpoints.roles.obtener + external_id, { headers: { token: token }}),
    crear: async (datos, token) => await axios.post(endpoints.roles.crear, datos, { headers: { token: token }}),
    actualizar: async (external_id, datos, token) => await axios.patch(endpoints.roles.actualizar + external_id, datos, { headers: { token: token }}),
};

export const api_sensores = {
    listar: async (token) => await axios.get(endpoints.sensores.obtener, { headers: { token: token }}),
    obtener: async (external_id, token) => await axios.get(endpoints.sensores.obtener + external_id, { headers: { token: token }}),
    crear: async (datos, token) => await axios.post(endpoints.sensores.crear, datos, { headers: { token: token }}),
    registros: async (external_id, token) => await axios.get(endpoints.sensores.registros + external_id, { headers: { token: token }}),
    ultimo_registro: async () => await axios.get(endpoints.sensores.ultimo_registro),
    actualizar: async (external_id, datos, token) => await axios.patch(endpoints.sensores.actualizar + external_id, datos, token),
    eliminar: async (external_id, token) => await axios.delete(endpoints.sensores.eliminar + external_id, { headers: { token: token }}),
    iniciar_monitoreo: async (token) => await axios.post(endpoints.sensores.iniciar_monitoreo, {}, { headers: { token: token }}),
    detener_monitoreo: async (token) => await axios.post(endpoints.sensores.detener_monitoreo, {}, { headers: { token: token }}),
};

export const api_registros = {
    listar_hoy: async (token) => await axios.get(endpoints.registros.listar_hoy, { headers: { token: token }}),
    listar: async (token) => await axios.get(endpoints.registros.listar, { headers: { token: token }}),
    listar_por_fecha: async (fecha, token) => await axios.get(endpoints.registros.listar_por_fecha + fecha, { headers: { token: token }}),
};