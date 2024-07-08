"use strict";

module.exports = (sequelize, DataTypes) => {
    const cuenta = sequelize.define('cuenta', {
        correo: { type: DataTypes.STRING(100), allowNull: false, unique: true},
        nombre_usuario: { type: DataTypes.STRING(100), allowNull: false},
        clave: { type: DataTypes.STRING(100), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, defaultValue: true },
        id_usuario: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    return cuenta;
};