const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('restaurantpartner', {
    restaurantPartnerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'userID'
      }
    },
    licenseUrl: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    commissionRate: {
      type: DataTypes.DECIMAL(3,2),
      allowNull: true
    },
    negotiationHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON array lưu lịch sử đàm phán'
    }
  }, {
    sequelize,
    tableName: 'restaurantpartner',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "restaurantPartnerID" },
        ]
      },
    ]
  });
};
