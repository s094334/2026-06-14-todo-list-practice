const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
  'Content-Type': 'application/json'
};

const sendResponse = (response, status, data) => {
  response.writeHead(status, headers);
  if (data !== undefined) {
      response.write(JSON.stringify(data));
  };
  response.end();
}

module.exports = sendResponse;