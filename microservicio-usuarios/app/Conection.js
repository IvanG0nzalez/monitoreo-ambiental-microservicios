const axios = require('axios');

const URL_BASE_CUENTAS = 'http://servicio-cuentas:3000/api/cuentas';

const endpoints = {
    cuentas: {
        crear: `${URL_BASE_CUENTAS}/crear`,
        general: `${URL_BASE_CUENTAS}`,
    }
};

const api_cuentas = {
    crear: (datos) => axios.post(endpoints.cuentas.crear, datos),
    actualizar: (datos, id_usuario) => axios.put(`${endpoints.cuentas.general}/${id_usuario}`, datos),
    eliminar: (id_usuario) => axios.delete(`${endpoints.cuentas.general}/${id_usuario}`),
};

module.exports = api_cuentas;