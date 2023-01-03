const express = require("express");
const controller = require("../controller/clienteController");
const controllerLogin = require("../controller/LoginController")
const transferencia = require("../controller/TransferenciaController")
const { eAdmin } = require("../middlewares/auth");


const router = express.Router();


router.get("/clientes/:id", eAdmin, controller.buscarUm);
router.get("/clientes", eAdmin, controller.buscarTodos);
router.post("/clientes", controller.criar);
router.put("/clientes/:id", eAdmin, controller.atualizar);
router.delete("/clientes/:id", eAdmin, controller.excluir);
router.post("/login", controllerLogin.login);
router.post("/transferir/:id/:value",eAdmin, transferencia.transferir);

/**
 * @api {get}/clientes/:id Busca Cliente por Id
 * @apiVersion 0.1.0
 * @apiName ClientebyId
 * @apiGroup Cliente
 * @apiParam {Number} id  id Unico.
 * @apiSampleRequest off
 * @apiHeader (Header) {String} authorization Authorization value
 * 
 * */

/**
 * @api {get}/clientes/ Busca todos os clientes
 * @apiVersion 0.1.0
 * @apiName clientesAll
 * @apiGroup Cliente
 * @apiSampleRequest off
 * @apiHeader (Header) {String} authorization Authorization value
 * 
 * 
 */

/**
 * @api {post}/clientes/ Cadastro de clientes
 * @apiVersion 0.1.0
 * @apiName Postclientes
 * @apiGroup Cliente
 * @apiBody {String} Nome 
 * @apiBody {String} cpf_cnpj         
 * @apiBody {String} email      
 * @apiBody {string} senha          
 * @apiBody {string} revenda
 * @apiSampleRequest off
 */


/**
 * @api {put}/clientes/:id Atualização de clientes
 * @apiVersion 0.1.0
 * @apiName Putclientes
 * @apiGroup Cliente
 * @apiParam {Number} id 
 * @apiBody {String} Nome          
 * @apiBody {string} revenda
 * @apiSampleRequest off
 * @apiHeader (Header) {String} authorization Authorization value
 */
/**
 * @api {delete}/clientes/:id Excluir Clientes
 * @apiVersion 0.1.0
 * @apiName Deleteclientes
 * @apiGroup Cliente
 * @apiParam {Number} id
 * @apiSampleRequest off
 * @apiHeader (Header) {String} authorization Authorization value
 */
/**
 * 
 * @api {Post}/clientes/ Login de Clientes
 * @apiVersion 0.1.0
 * @apiName Loginclientes
 * @apiGroup Login
 * @apiBody {string} email 
 * @apiBody {string} senha
 * @apiSuccess (200) {string} json retorna um json com dados do cliente e token
 * @apiError (401) {json} json retorna um json com o erro.
 * @apiSuccessExample {json} Success response:
 * HTTPS 200 OK
 * {
 * "erro": false,
    "mensagem": "Login Realizado com Sucesso!",
    "email": "rafael@gmail.com",
    "idUsuario": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjcyNjI0OTUwLCJleHAiOjE2NzMyMjk3NTB9.Afxw1POPlfb6-O6mxpPlI7INRxcvDnqsmuF_BZbx-OA"}

 * @apiSampleRequest off
 * 
 *  
 */

/**
 * @api {Post}/transferir/:id/:value/ Transferencia entre clientes
 * @apiVersion 0.1.0
 * @apiName TransaçãoClientes
 * @apiGroup Transferencia
 * @apiDescription transferencia entre clientes com validação 
 * @apiParam {Number} id id do destinatario 
 * @apiParam {Number} value valor da transferencia  
 * @apiSuccess (200) {json} json retorna um json com dados da transferencia
 * @apiError (400) {json} json retorna um json com o erro.
 * @apiExample {curl} Examplo:
 *      http://localhost/api/transferir/1/100/
 * @apiSampleRequest off
 * @apiHeader (Header) {String} authorization Authorization value
 */ 


module.exports = router;
