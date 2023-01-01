const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const transacao = sequelize.define("transacao", {
  
  id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
  contaDest: { allowNull: false, type:Sequelize.INTEGER},
  contaOrigem: { allowNull: false, type: Sequelize.INTEGER },
  status: {allowNull: false, type: Sequelize.STRING(64), validate: { len: [1, 64] }},
  valor: { allowNull: false, type: Sequelize.FLOAT}},

  {
});

module.exports = transacao;
