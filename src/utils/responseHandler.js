const successResponse = (h, { message, data, responseCode = 200 }) => {
  const response = {
    status: 'success',
  };

  if (message) {
    response.message = message;
  } if (data) {
    response.data = data;
  }

  return h.response(response).code(responseCode);
};

const failResponse = (h, error) => {
  const response = h.response({
    status: 'fail',
    message: error.message,
  });
  response.code(error.statusCode);
  return response;
};

const serverErrorResponse = (h) => {
  const response = h.response({
    status: 'error',
    message: 'Maaf, sedang terjadi kegagalan pada server. Coba lagi nanti',
  });
  response.code(500);
  return response;
};

const errorResponse = (h, error) => {
  const response = h.response({
    status: 'fail',
    message: error.output.payload.message,
  }).code(error.output.statusCode);

  return response;
};

module.exports = {
  successResponse, failResponse, serverErrorResponse, errorResponse,
};
