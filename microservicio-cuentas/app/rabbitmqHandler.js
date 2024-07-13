const models = require('./models');
const { sendMessage, connect, consumeMessage } = require('./rabbitmq');
let cuenta = models.cuenta;

const handleUsuarioCreado = async (message) => {
    const { correo, nombre_usuario, clave, id_usuario } = message;

    try {
        const UUID = require('uuid');
        const bcrypt = require('bcrypt');
        const claveCifrada = await bcrypt.hash(clave, 10);

        const nueva_cuenta = await cuenta.create({
            correo: correo,
            nombre_usuario: nombre_usuario,
            clave: claveCifrada,
            id_usuario: id_usuario,
            external_id: UUID.v4(),
        });

        if (!nueva_cuenta) {
            console.log('Error al crear cuenta');
        }

    } catch (error) {
        console.log(error, 'Error al crear cuenta');
    }
};

const startConsumer = async () => {
    await connect();
    await consumeMessage('usuario_creado', handleUsuarioCreado);
};

module.exports = { startConsumer };