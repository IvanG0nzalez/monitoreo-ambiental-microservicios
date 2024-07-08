"use strict";

module.exports = (sequelize, DataTypes) => {
    const usuario = sequelize.define('usuario', {
        nombres: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        apellidos: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        cedula: { type: DataTypes.STRING(10), defaultValue: "NONE" },
        estado: { type: DataTypes.BOOLEAN, defaultValue: true },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    usuario.associate = function (models) {
        usuario.belongsTo(models.rol, { foreignKey: 'id_rol' });
    };
    return usuario;
};