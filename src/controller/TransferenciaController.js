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