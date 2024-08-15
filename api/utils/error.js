// function menghandler error
export const errorHandler = (statusCode, message) => {
  const error = new Error(); // ErrorConstructor
  error.statusCode = statusCode; // error berdasarkan 'code' yang di insert
  error.message = message; // error berdasarkan 'message' yang di insert
  return error; // return error
};
