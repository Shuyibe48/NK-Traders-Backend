const globalErrorHandler = (error, req, res, next) => {
  if (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export default globalErrorHandler;
