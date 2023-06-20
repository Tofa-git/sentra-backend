module.exports = {
  responseSuccess(message, data = null) {
    return {
      success: true,
      message: message,
      data: data,
    };
  },

  responseError(error, data = null) {
    console.log(error);

    if (Array.isArray(error.errors) && error.errors.length > 0) {
      message = error.errors[0].message;
    } else if (error.message != null) {
      message = error.message;
    } else {
      message = error;
    }

    return {
      success: false,
      message: message,
      data: data,
    };
  },
}