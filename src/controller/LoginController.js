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