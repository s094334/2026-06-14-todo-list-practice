const sendResponse = require("./response");

function errorHandle(response) {
  sendResponse(response, 400, {
      "status": "false",
      "data": "欄位未寫正確，或無此 id",
  })
}

module.exports = errorHandle;
