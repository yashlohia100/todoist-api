class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.statusText = statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    // err.message property is not shown by default
    this.errorMessage = message;
  }
}

export default AppError;
