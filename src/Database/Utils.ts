export let units = {
  1: "U",
  2: "Kg",
  3: "L"
}

export function formatInput(value: string): string {
  // Remove any non-digit characters
  let cleanValue = value.replace(/[^0-9]/g, '');

  // Strip leading zeros, but leave one if the number is less than 1
  cleanValue = cleanValue.replace(/^0+(?!$)/, '');

  // Add leading zero if input is less than 100 (to ensure a whole number part)
  while (cleanValue.length < 3) {
    cleanValue = '0' + cleanValue;
  }

  // Split the value into whole part and decimal part
  const wholePart = cleanValue.slice(0, -2);
  const decimalPart = cleanValue.slice(-2);

  // Format the result as "0.00"
  return `${wholePart}.${decimalPart}`;
}

export function formatToTwoDecimals(value: string | number): number {
  // Convert the input to a number, and round it to two decimal places
  let num = typeof value === 'string' ? parseFloat(value) : value;

  // Round to two decimal places
  num = Math.round(num * 100) / 100;

  // If the number is an integer (e.g., 12.00), return it as an integer
  if (num % 1 === 0) {
    return Math.round(num);
  }

  // Otherwise, return the number with two decimals
  return num;
}