export function success(res, statusCode, message, data, token = "") {
  return res.status(statusCode).json({ message, data, token });
}
