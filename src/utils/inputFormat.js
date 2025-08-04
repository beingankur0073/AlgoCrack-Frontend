export const formatInput = (input) => {
  // Return the input directly if it's already a simple value (string, number, etc.).
  if (typeof input !== 'object' || input === null) {
    return String(input);
  }

  // Handle arrays explicitly.
  if (Array.isArray(input)) {
    return `[${input.join(', ')}]`;
  }

  // Check if the object has exactly one key.
  const keys = Object.keys(input);
  if (keys.length === 1) {
    // If so, return the value of that key directly for a cleaner display.
    return formatInput(input[keys[0]]);
  }

  // For all other objects (with multiple keys), return a formatted JSON string.
  return JSON.stringify(input, null, 2);
};