class JsonResponse {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
  send(res, customMessage) {
    const Message = customMessage || this.message;
    return res.status(this.status).json({ message: Message });
  }
};

module.exports = JsonResponse;