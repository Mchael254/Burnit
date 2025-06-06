//email
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


//multiple phone numbers
export const validateMpesaNumbers = (numbers: string[]): { valid: boolean; message?: string } => {
  if (!numbers || numbers.length === 0) {
    return { valid: false, message: 'Please enter at least one Mpesa number.' };
  }

  const invalidNumbers = numbers.filter(num => !/^2547\d{8}$/.test(num));

  if (invalidNumbers.length > 0) {
    return { valid: false, message: `Invalid Mpesa numbers: ${invalidNumbers.join(', ')}. Each must be 12 digits starting with 2547.` };
  }

  return { valid: true };
};
