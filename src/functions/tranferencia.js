const Cliente = require("../model/cliente");
const status = require("http-status");
const logtranstController = require("../controller/logTransacaoController");


async function tranferencia(id, id_log, value) {

  try {
    
    const user = await validaId(id);
    const userlogad = await validaId(id_log);

    const saldoDes = user.saldo;
    const saldolog = userlogad.saldo;
    const revenda = userlogad.revenda;

    if (id_log != id && revenda !== false && user) {

      if (saldolog >= value) {
        recebe(id, saldoDes, value, );
        return response = envia(id_log, saldolog, value, id_log);

      } else {
        logtranstController.transacao(id_log,id,value, "falha");
        return response = {
          erro: false,
          mensagem: "Saldo insuficiente ",
          value: value,
          idUsuario: id_log,
          saldo: saldolog
        };
      }
    } else {
      logtranstController.transacao(id_log,id,value, "nao permitido");
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

 function validaId(id) {

  const user =  Cliente.findOne({
    attributes: ['id', 'saldo', 'revenda'],
    where: {
      id: id
    }
  });

  if (user === null && isNaN(Number(id))) {
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














exports.tranferencia = tranferencia;