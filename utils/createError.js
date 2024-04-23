// Function to create custom error objects with specified status code and message
const createError = (status, message) => {
  // Create a new Error object
  const err = new Error();
  // Set the status and message properties of the error object
  err.status = status;
  err.message = message;

  // Return the error object
  return err;
};

// Export the createError function for use in other files
export default createError;
