const Cliente = require("../model/cliente");
const status = require("http-status");


async function tranferencia(id, id_log, value) {

  try {
    var response = "";

    const user = await validaId(id);
    const userlogad = await validaId(id_log);

    const saldoDes = user.saldo;
    const saldolog = userlogad.saldo;
    const revenda = userlogad.revenda;

    if (id_log != id && revenda !== false && user) {

      if (saldolog >= value) {
        await recebe(id, saldoDes, value);
        console.log(response);
        return response = envia(id_log, saldolog, value);

      } else {
        return response = {
          erro: false,
          mensagem: "Saldo insuficiente ",
          value: value,
          idUsuario: id_log,
          saldo: saldolog
        };
      }
    } else {
      console.log(revenda);
      return response = {
        erro: true,
        mensagem: "Transferencia não permidida!",
        IdLogado: id_log,
        IdDestinatario: id,
        revenda: revenda
      }
    }
  } catch (e) {

  }
}

async function validaId(id) {

  const user = await Cliente.findOne({
    attributes: ['id', 'saldo', 'revenda'],
    where: {
      id: id
    }
  });

  if (user === null && !isNaN(id)) {
    return false;
  } else {
    return user;
  }
}

async function envia(id, saldo, value) {
  var response = "";
  var saldoatual = saldo - value;
  await Cliente.update({
    saldo: saldoatual
  }, {
    where: {
      id: id
    }
  })
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