const validationHelper = {
  isEmailValid: (email: string): boolean =>
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email),
};

export default validationHelper;
