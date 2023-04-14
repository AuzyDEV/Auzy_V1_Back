const JsonResponse = require("./json-response");
const error = new Error('Something went wrong');
response1 = new JsonResponse(400, error.message);
module.exports = response1; 