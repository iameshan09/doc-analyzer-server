import ms from 'ms';

// Check if date is older than specified threshold
const isDateOlder = (date: Date, threshold: ms.StringValue): boolean => {
  const thresholdMs = ms(threshold); // Convert threshold to milliseconds
  return Date.now() - date.getTime() > thresholdMs; // Compare with current time
};

// Add specified number of days to a date
const addDaysToDate = (days: number, date = new Date()): Date =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000); // Add days in milliseconds

// Get deadline date by subtracting threshold from current time
const getDeadline = (threshold: ms.StringValue): Date => {
  const thresholdMs = ms(threshold); // Convert threshold to milliseconds
  return new Date(Date.now() - thresholdMs); // Return past date
};

export { addDaysToDate, isDateOlder, getDeadline };
