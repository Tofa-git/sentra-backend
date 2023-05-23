module.exports = {
  responseSuccess(message, data = null) {
    return {
      success: true,
      message: message,
      data: data,
    };
  },

  responseError(message, data = null) {
    if (Array.isArray(message.errors) && message.errors.length > 0) {
      message = message.errors[0].message;
    }

    return {
      success: false,
      message: message,
      data: data,
    };
  },
}