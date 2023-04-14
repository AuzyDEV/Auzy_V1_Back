class JsonResponse {
    constructor(status, message) {
      this.status = status;
      this.message = message;
    }
  
    send(res) {
      return res.status(this.status).json({ message: this.message });
    }
  };
module.exports = JsonResponse;