const { rol, usuario } = require('../app/models');
const usuarioC = require('../app/controllers/UsuarioController');
let usuarioControl = new usuarioC();
const UUID = require('uuid');

async function init() {
    try {
        let rolAdmin = await rol.findOne({ where: { nombre: 'Administrador' } });
        
        if(!rolAdmin) {
            rolAdmin = await rol.create({ nombre: 'Administrador', external_id: UUID.v4() });
            console.log('\x1b[36m%s\x1b[0m', 'Rol "Administrador" creado correctamente.');
        } else {
            console.log('\x1b[35m%s\x1b[0m', 'El rol "Administrador" ya existe en la base de datos.');
        }

        const usuarioAdmin = await usuario.findOne({ where: { id: 1 } });

        if(!usuarioAdmin) {
            const req = {
                body: {
                    correo: 'admin@admin.admin',
                    nombre_usuario: 'Admin',
                    clave: 'Admin12345',
                    cedula: '0000000000',
                    nombres: 'Admin',
                    apellidos: 'Admin',
                    external_rol: rolAdmin.external_id
                }
            };
            const res = {
                status: (code) => ({ json: (data) => {
                    if (code !== 201) {
                        console.error('Error al crear usuario "Administrador"', data);
                    } else {
                        console.log('\x1b[36m%s\x1b[0m', 'Usuario "Admin" creado exitosamente.');
                    }
                }})
            };
            await usuarioControl.crear(req, res);
        } else {
            console.log('\x1b[35m%s\x1b[0m', 'El usuario "Admin" ya existe en la base de datos.');
        }
    } catch (error) {
        console.error('Error al inicializar Rol y/o Administrador', error);
    }
}

module.exports = init;