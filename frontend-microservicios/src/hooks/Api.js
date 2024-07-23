import axios from 'axios';
import { save, saveToken } from './SessionUtils';

const URL_BASE = "http://kong:8000/api";

const endpoints = {
    cuentas: {
        inicio_sesion: `${URL_BASE}/cuentas/inicio_sesion`,
        obtener: `${URL_BASE}/cuentas`,
    },
    usuarios: {

    },
    sensores: {

    }
};

export const api_cuentas = {
    inicio_sesion: async (datos) => {
        const response = await axios.post(endpoints.cuentas.inicio_sesion, datos);
        if (response && response.code === 200 && response.datos.token) {
            saveToken(response.datos.token);
            save('nombre_usuario', response.datos.nombre_usuario);
            save('external', response.datos.external);
        }
        return response;
    },
    listar: async (token) => await axios.get(endpoints.cuentas.obtener, token),
    obtener: async (external_id, token) => await axios.get(endpoints.cuentas.obtener`/${external_id}`, token),
};

export const api_usuarios = {

};
