const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Cliente = sequelize.define("cliente", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  nome: {
    allowNull: false,
    type: Sequelize.STRING(255),
    validate: {
      len: [2, 255]
    }
  },
  cpf_cnpj: {
    allowNull: false,
    type: Sequelize.STRING(14),
    validate: {
      len: [11, 14]
    }
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING(255),
    validate: {
      len: [2, 255]
    }
  },
  senha: {
    allowNull: false,
    type: Sequelize.STRING(64),
    validate: {
      len: [6, 64]
    }
  },
  saldo: {
    type: Sequelize.FLOAT,
  },
  revenda: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      }

});

module.exports = Cliente;
