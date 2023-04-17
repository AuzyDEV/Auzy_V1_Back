const JsonResponse = require("./json-response");
const error = new Error('Something went wrong');
errorResponse = new JsonResponse(400, error.message);
module.exports = errorResponse; 