/**
 * Utility functions for formatting values
 */

/**
 * Round a number to 2 decimal places
 * @param value - The number or string to round
 * @returns The formatted string with 2 decimal places
 */
export const toFixed2 = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
};

