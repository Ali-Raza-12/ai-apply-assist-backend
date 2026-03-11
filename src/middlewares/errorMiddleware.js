import { errorResponse } from "../utils/apiResponse.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  return errorResponse(res, statusCode, message);
};
