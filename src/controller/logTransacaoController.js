const logTransferencia = require("../model/transacao");

exports.transacao = function transacao(idlog, idDest, value, status) {

    logTransferencia.create({
        contaDest: idlog,
        contaOrigem: idDest,
        valor: value,
        status: status
    })

}