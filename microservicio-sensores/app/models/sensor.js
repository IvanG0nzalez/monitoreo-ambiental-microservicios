"use strict";

module.exports = (sequelize, DataTypes) => {
    const sensor = sequelize.define('sensor', {
        alias: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        cadena_conexion: { type: DataTypes.STRING(500), defaultValue: "NONE" },
        tipo_medicion: { type: DataTypes.ENUM('Temperatura', 'Humedad', 'CO2') },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    sensor.associate = function (models) {
        sensor.hasMany(models.registro_climatico, { foreignKey: 'id_sensor', as: 'registro_climatico' });
    };
    return sensor;
};