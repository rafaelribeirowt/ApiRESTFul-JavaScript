const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
    eAdmin: async function (request, response, next){
        const authHeader = request.headers.authorization;
        //console.log(authHeader);
        if(!authHeader){
            return response.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página! Faltam o token A!"
            });
        }

        const [, token ]= authHeader.split(' ');
        //console.log("Token: " + token);

        if(!token){
            return response.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página! Faltam o token B!"
            });
        }

        try{
            const decode = await promisify(jwt.verify)(token, "D62ST92Y7A6V7K5C6W9ZU6W8KS3");
            request.userId = decode.id;
            return next();
        }catch(err){
            return response.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o login para acessar a página! Token inválido!"
            });
        }

    }
}