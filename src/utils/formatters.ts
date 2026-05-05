import { Currency, DateFormat } from '../types';

export const formatCurrency = (amount: number | string, currency: Currency): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
  
  if (isNaN(numericAmount)) return String(amount);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(numericAmount);
};

export const formatDate = (dateStr: string, format: DateFormat): string => {
  // Simple date parser for common formats in app
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  if (format === 'YYYY-MM-DD') {
    return date.toISOString().split('T')[0];
  } else {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
};
