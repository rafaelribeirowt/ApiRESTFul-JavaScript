const Cliente = require("../model/cliente");
const status = require("http-status");


 async function  tranferencia (id, id_log, value){
  
  try{
  var response = "";

  const user = await validaId(id);
  const userlogad = await validaId(id_log);

  const saldoDes = user.saldo;
  const saldolog = userlogad.saldo;
  const revenda = userlogad.revenda;
 
 if (id_log != id && revenda !== false && user){
 
  if (saldolog >= value ){
   
   var recebervalue =  parseFloat(saldoDes) + parseFloat(value);
   Cliente.update(
     {saldo: recebervalue},
     { where: { id: id } }
   )
   var saldoatual = saldolog - value ;    //enviar - subtrair do saldo 
   Cliente.update(
     {saldo: saldoatual},
     { where: { id: id_log } }
   )
   return  response = {
     erro:false,
     mensagem:"Transferencia Realizada com Sucesso!",
     value: value,
     idUsuario: id_log,
     saldo: saldoatual,
     revenda : revenda
   }
 } else {
     return response = {
       erro:false,
       mensagem:"Saldo insuficiente ",
       value: value,
       idUsuario: id_log,
       saldo: saldolog
     }
   }}else {
    console.log(revenda);
    return response = { 
     erro:true, 
     mensagem:"Transferencia não permidida!",
     IdLogado: id_log,
     IdDestinatario: id,
     revenda : revenda
   }}}catch (e){
    console.log(e);
   
  
  }}

 async function validaId(id){

  const user =  await Cliente.findOne({
    attributes: ['id', 'saldo', 'revenda'],
    where: {id: id}
  });
  console.log(user);
 if(user === null && !isNaN(id)){
  return false;
 }else {
  return user;
 }
}
 





 
   

 


 exports.tranferencia = tranferencia;