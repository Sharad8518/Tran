export const errorMessage = e => {
  try {
    if (e.response && e.response.data) {
      return { status: e.response.status, message: e.response.data.message } || { message: e.message, status: e.response.status };
    }
    return e.message;
  } catch {
    return e;
  }
};
