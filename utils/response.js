module.exports = {
  responseSuccess(message, data = null) {
    return {
      success: true,
      message: message,
      data: data,
    };
  },

  responseError(message, data = null) {
    return {
      success: false,
      message: message,
      data: data,
    };
  },
}