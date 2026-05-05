import { Currency, DateFormat } from '../types';

export const formatCurrency = (amount: number | string, currency: Currency = 'CAD'): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  
  if (isNaN(numericAmount)) return String(amount);

  // Ensure we have a valid currency code for Intl.NumberFormat
  const currencyCode = currency || 'CAD';

  try {
    const formatter = new Intl.NumberFormat(currencyCode === 'CAD' ? 'en-CA' : 'en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return formatter.format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currencyCode === 'CAD' ? '$' : 'US$'} ${numericAmount.toLocaleString()}`;
  }
};

export const formatDate = (date: string | Date, format: DateFormat): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return String(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  } else {
    return `${month}/${day}/${year}`;
  }
};
