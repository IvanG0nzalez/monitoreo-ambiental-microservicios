"use strict";

module.exports = (sequelize, DataTypes) => {
    const registro_climatico = sequelize.define('registro_climatico', {
        fecha: { type: DataTypes.DATEONLY, allowNull: false },
        hora: { type: DataTypes.TIME, allowNull: false },
        valor_medido: { type: DataTypes.FLOAT.UNSIGNED, defaultValue: 0 },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    registro_climatico.associate = function (models) {
        registro_climatico.belongsTo(models.sensor, { foreignKey: 'id_sensor' });

    };
    return registro_climatico;
};