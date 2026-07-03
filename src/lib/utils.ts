import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCurrency(amount: string): string {
  return `₦${amount}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'gold';
    case 'confirmed':
      return 'success';
    case 'completed':
      return 'info';
    case 'cancelled':
      return 'error';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'smoke';
  }
}
