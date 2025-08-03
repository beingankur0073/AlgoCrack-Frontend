export const formatInput = (input) => {
  if (typeof input === 'string') return input;

  try {
    const values = Object.values(input);
    if (values.length === 1) {
      return values[0]; // If only one key, show the inner value
    }
    return JSON.stringify(input, null, 2);
  } catch {
    return JSON.stringify(input);
  }
};