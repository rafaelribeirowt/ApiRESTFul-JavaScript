# Introdução

Esta documentação tem objetivo de apresentar as principais rotas da Api e como o sistema foi desenvolvido

biblioteca  utilizadas:

#### - `Express`
#### - `Bcryptjs`
#### - `Jsonwebtoken`
#### - `Mysql2`
#### - `Sequelize`


## Rotas da Api

Arquivo com as rotas da api routes/clienteRouter.js


```javascript

const express = require("express");
const controller = require("../controller/controllerCliente");
const { eAdmin } = require("../middlewares/auth");

const router = express.Router();


router.get("/clientes/:id", eAdmin, controller.buscarUm);
router.get("/clientes", eAdmin, controller.buscarTodos);
router.post("/clientes", controller.criar);
router.put("/clientes/:id", eAdmin, controller.atualizar);
router.delete("/clientes/:id", eAdmin, controller.excluir);
router.post("/login", controller.login);
router.post("/transferir/:id/:value",eAdmin, controller.transferir);

```


## Model Cliente

Arquivo com model cliente.js para persistencia no banco de dados Mysql.

Sera utilizado para o cadastro de cliente, login e transferencias

model/cliente.js


```javascript

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
  },

  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
    createdAt: false,
    updatedAt: false
  });

module.exports = Cliente;

```

## Model transação 

Arquivo do model transacao.js para persistencia no banco de dados Mysql.

Sera utilizado para registar um historico simples das transações:

model/transacao.js

```javascript

const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const transacao = sequelize.define("transacao", {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    contaDest: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    contaOrigem: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    status: {
      allowNull: false,
      type: Sequelize.STRING(64),
      validate: {
        len: [1, 64]
      }
    },
    valor: {
      allowNull: false,
      type: Sequelize.FLOAT
    }
  }, {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    createdAt: true,
    updatedAt: true
  }


);

module.exports = transacao;

```

## Login 

O login do cliente é realizado pelo cliente e a resposta devolve um token para ser feita a autenticao 

```javascript

const Cliente = require("../model/cliente");
const status = require("http-status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.login = async (request, response) => {
    const email = request.body.email;
    const senha = request.body.senha;
  
    const user = await Cliente.findOne({
      attributes: ['id', 'nome', 'email', 'senha'],
      where: {
        email: email  
      }
    });
  
    if (user === null || !(await bcrypt.compare(senha, user.senha))) {
      return response.status(status.UNAUTHORIZED).json({
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


```



## Autenticação

Arquivo do middlewares auth.js responsavel de requisitar a headers com o token gerado no login e tambem responsavel de verificar se o token é valido ou não: 

```javascript

const jwt = require('jsonwebtoken');
const {
    decode
} = require('punycode');
const {
    promisify
} = require('util');

module.exports = {
    eAdmin: async function (request, response, next) {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return response.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página! Faltam o token A!"
            });
        }
        const [, token] = authHeader.split(' ');
        if (!token) {
            return response.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página! Faltam o token B!"
            });
        }
        try {
            const decode = await promisify(jwt.verify)(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
            request.userId = decode.id;

            return next();
        } catch (err) {
            return response.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página! Token inválido!"
            });
        }

    }
}



```

## Controller de clientes

Responsavel por: 
- `Buscar por Id - **buscarUm**`; 
- `Buscar todos - **buscarTodos**`;
- `Criar - **criar**`;
- `Atualiza - **atualizar**`;  
- `Excluir - **excluir**`;

Arquivo clienteController.js

```Javascript 



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
        { email: cpf_cnpj },
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

```

## Login Controller 

No Login controller é realizado de fato a solicitação do login para o cliente

são feitas algumas validaçôes, dentre elas é verificado se o email e a senha existem, 

 **bcrypt.compare** vai comparar a senha inserida com a senha criptocrafada no banco de dados, 
 e se a senha estiver errada ou o **user** returnar null o usuario receber uma resposta de erro:

 ```json
Error response:
HTTPS 401
 
        erro: true,
        mensagem: "Erro: Usuário ou a senha incorreta! Email ou Senha invalida!"
      

 ```

Codigo JavaScript: 

```Javascript 

const Cliente = require("../model/cliente");
const status = require("http-status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.login = async (request, response) => {
    const email = request.body.email;
    const senha = request.body.senha;
  
    const user = await Cliente.findOne({
      attributes: ['id', 'nome', 'email', 'senha'],
      where: {
        email: email  
      }
    });
  
    if (user === null || !(await bcrypt.compare(senha, user.senha))) {
      return response.status(status.UNAUTHORIZED).json({
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

```

## Controller Transação 


Controller resposponsavel por criar um log no banco de dados com cada transicao feita.

nela é possivel verificar os status das transações

status: 
#### - `**Valor invalido**`
#### - `**Nao permitido**`
#### - `**Saldo insuficiente**`
#### - `**Sucesso**`

Arquivo /controller/logTransacaoController.js

```JavaScript 
const logTransferencia = require("../model/transacao");

exports.transacao = function transacao(idlog, idDest, value, status) {

    logTransferencia.create({
        contaDest: idlog,
        contaOrigem: idDest,
        valor: value,
        status: status
    })

}

```


## Controller Transferência

O Controller de transferencia vai solicitar 2 dados do cliente

- id: O id do cliente destino 
- Value: valor a ser transferido

o id_log é capturado no token de autenticação

Esses parametros são passados para uma função que vai fazer as validaçoes, fazer a transferencia e returnar um json de sucesso ou falha.

Arquivo /controller/TransferenciaController.js

```JavaScript 

const jwt = require("jsonwebtoken");
const transf = require("../functions/tranferencia");
const status = require("http-status");

exports.transferir =  async (request, response, next) => {
    const id = request.params.id;
    const id_log = request.userId;
    const value = request.params.value;
  
      const res =  await transf.tranferencia(id, id_log, value);
  
      if (res.erro != true && res.erro != null) {
        return response.status(status.OK).json(res);
      } else {
        return response.status(status.BAD_REQUEST).json(res);
      }
  
  }

```

## Função Transferencia 

Função responsavel por fazer as validações de: 
#### - `Id`  
#### - `Valor`  
#### - `Saldo` 
#### - `Permissão`

Dependendo da  condição ser **true** ou **false**  a response sera diferente 
e o Status do log de transição sera diferente também.

Arquivo /controller/TransferenciaController.js

```JavaScript 

const Cliente = require("../model/cliente");
const status = require("http-status");
const logtranstController = require("../controller/logTransacaoController");


exports.tranferencia = async function tranferencia(id, id_log, value) {

  try {
    
    const user = await validaId(id);
    const userlogad = await validaId(id_log);

    const saldoDes = user.saldo;
    const saldolog = userlogad.saldo;
    const revenda = userlogad.revenda;


    if (id_log != id && revenda !== false && user && !isNaN(Number(value)) && Number(value) > 0 ) {

          if (saldolog >= value) {
              recebe(id, saldoDes, value, );
              return response = envia(id_log, saldolog, value, id_log);

                    } else {
                  logtranstController.transacao(id_log,id,value, "Saldo insuficiente");
                  return response = {
                    erro: false,
                    mensagem: "Saldo insuficiente",
                    value: value,
                    idUsuario: id_log,
                    saldo: saldolog
            };
          }
    } else if (isNaN(Number(value))){
      logtranstController.transacao(id_log,id, 0, "Valor invalido");
      return response = {
        erro: true,
        mensagem: "Valor invalido",
        IdLogado: id_log,
        IdDestinatario: id,
        revenda: revenda
      }
    }else{
      logtranstController.transacao(id_log,id, value, "Nao permitido");
      return response = {
        erro: true,
        mensagem: "Transferencia não permidida!",
        IdLogado: id_log,
        IdDestinatario: id,
        revenda: revenda
      }

    }

  } catch (e) {
    return response = {
      erro: true,
      mensagem: e.name  
    }
  }
}

 async function validaId(id) {

  const user = await Cliente.findOne({
    attributes: ['id', 'saldo', 'revenda'],
    where: {
      id: id
    }
  });
  if ( user === null && isNaN(Number(id))) {
    return false;
  } else {
    return user;
  }
}

 function envia(id, saldo, value, id_log) {

  let saldoatual = saldo - value;
   Cliente.update({
    saldo: saldoatual
  }, {
    where: {
      id: id
    }
  })
  logtranstController.transacao(id_log,id,value, "Sucesso");
  return response = {
    erro: false,
    mensagem: "Transferencia Realizada com Sucesso!",
    value: value,
    idUsuario: id,
    saldo: saldoatual
  };
  
}
function recebe(id, saldo, value) {
  var saldoatual = parseFloat(saldo) + parseFloat(value);
  Cliente.update({
    saldo: saldoatual
  }, {
    where: {
      id: id
    }
  })
}



```

