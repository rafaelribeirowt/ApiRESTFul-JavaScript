const Cliente = require("../model/cliente");
const status = require("http-status");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");


exports.buscarUm = async (request, response, next) => {
  const id = request.params.id;
  await Cliente.findByPk(id).then((cliente) => {
    if (cliente) {
      response.status(status.OK).send(cliente);
    } else {
      response.status(status.NOT_FOUND).send();
    }
  }).catch((error) => next(error))
}

exports.buscarTodos = async (request, response, next) => {

  await Cliente.findAll({
      attributes: ['id', 'nome', 'cpf_cnpj', 'email', 'saldo', 'revenda'],
      order: [
        ['id', "DESC"]
      ]
    })
    .then((clientes) => {
      return response.json({
        clientes: clientes,
        id_usuario_logado: request.userId
      }).status(status.OK);
    }).catch(() => {
      return response.status(status.NOT_FOUND).json({
        erro: true,
        mensagem: "Erro: Nenhum usuário encontrado!"
      });
    });

};

exports.criar = async (request, response, next) => {

  const nome = request.body.nome;
  const cpf_cnpj = request.body.cpf_cnpj;
  const email = request.body.email;
  const senha = await bcrypt.hash(request.body.senha, 8);
  const saldo = request.body.saldo;
  const revenda = request.body.revenda;


   await Cliente.findOne({
    where: {
      [Op.or]: [
        { cpf_cnpj: cpf_cnpj },
        { email: email }]
    }})
    .then(user => {
    if(user === null){
      Cliente.create({
        nome: nome,
        cpf_cnpj: cpf_cnpj,
        email: email,
        senha: senha,
        saldo: saldo,
        revenda: revenda
      })
      .then(() => {
        response.status(status.CREATED).send();
      })
      .catch(error => next(error));
      
    }else { 
      response.status(status.UNPROCESSABLE_ENTITY).json({
          mensagem: "Usuario ja existe"})
      }
  })
      .catch((error) => {
      console.error('Unable to create table : ', error);
  });
}
  
  
  
exports.atualizar = (request, response, next) => {
  const id = request.params.id;
  const nome = request.body.nome;
  const revenda = request.body.revenda;

  Cliente.findByPk(id)
    .then(cliente => {
      if (cliente) {
        Cliente.update({
            nome: nome,
            revenda: revenda,
          }, {
            where: {
              id: id
            }
          })
          .then(() => {
            response.status(status.OK).send();
          })
          .catch(error => next(error));
      } else {
        response.status(status.NOT_FOUND).send();
      }
    })
    .catch(error => next(error));
};

exports.excluir = (request, response, next) => {
  const id = request.params.id;

  Cliente.findByPk(id)
    .then(cliente => {
      if (cliente) {
        Cliente.destroy({
            where: {
              id: id
            }
          })
          .then(() => {
            response.status(status.OK).send();
          })
          .catch(error => next(error));
      } else {
        response.status(status.NOT_FOUND).send("Não encontrado");
      }
    })
    .catch(error => next(error));
};



