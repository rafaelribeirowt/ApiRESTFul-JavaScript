const Cliente = require("../model/cliente");
const status = require("http-status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const trans = require("../functions/tranferencia");



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

  const user = await Cliente.findOne({
    attributes: ['email', 'cpf_cnpj'],
    where: {
      email: email
    }
  });
  if (user !== null && user.cpf_cnpj == cpf_cnpj) {
    response.status(status.UNPROCESSABLE_ENTITY).json({
      mensagem: "Usuario ja existe"
    })
  } else {
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
  }
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
          }).then(() => {
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


exports.login = async (request, response) => {
  // console.log(request.body.email, request.body.senha);
  const email = request.body.email;
  const senha = request.body.senha;

  const user = await Cliente.findOne({
    attributes: ['id', 'nome', 'email', 'senha'],
    where: {
      email: email
    }
  });

  if (user === null || !(await bcrypt.compare(senha, user.senha))) {
    return response.status(status.OK).json({
      erro: true,
      mensagem: "Erro: Usuário ou a senha incorreta! Email ou Senha invalida!"
    });
  }

  var token = jwt.sign({
    id: user.id
  }, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
    //expiresIn: 600 //10 min
    //expiresIn: 60 //1 min
    expiresIn: '7d' // 7 dia
  });

  return response.json({
    erro: false,
    mensagem: "Login Realizado com Sucesso!",
    email: email,
    idUsuario: user.id,
    token: token
  })
}


exports.transferir = async (request, response, next) => {
  const id = request.params.id;
  const id_log = request.userId;
  const value = request.params.value;

  // try{
  var res = await trans.tranferencia(id, id_log, value);

  if (res.erro != true) {
    return response.status(status.OK).json(res);
  } else {
    return response.status(status.BAD_REQUEST).json(res);
  } //}catch(err ){
  // return response.status(status.INTERNAL_SERVER_ERROR).json(err.name);
  //}




}