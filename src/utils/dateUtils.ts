import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/**
 * Converts a UTC datetime string to local time and formats it as "Dec 17, 2024 2:30 PM"
 */
export const formatDateTime = (utcDate: string | null | undefined): string => {
  if (!utcDate) return '';
  return dayjs.utc(utcDate).local().format('MMM DD, YYYY h:mm A');
};

/**
 * Converts a UTC datetime string to local time and formats it as "December 17, 2024"
 */
export const formatDateLong = (utcDate: string | null | undefined): string => {
  if (!utcDate) return '';
  return dayjs.utc(utcDate).local().format('MMMM DD, YYYY');
};

/**
 * Converts a UTC datetime string to local time and formats it as "Dec 17, 2024"
 */
export const formatDateShort = (utcDate: string | null | undefined): string => {
  if (!utcDate) return '';
  return dayjs.utc(utcDate).local().format('MMM DD, YYYY');
};

/**
 * Converts a UTC datetime string to local time and formats it as "17-12-2024"
 */
export const formatDateNumeric = (utcDate: string | null | undefined): string => {
  if (!utcDate) return '';
  return dayjs.utc(utcDate).local().format('DD-MM-YYYY');
};

/**
 * Converts a UTC datetime string to local time and formats it as "17-12-2024 14:30"
 */
export const formatDateTimeNumeric = (utcDate: string | null | undefined): string => {
  if (!utcDate) return '';
  return dayjs.utc(utcDate).local().format('DD-MM-YYYY HH:mm');
};

/**
 * Converts a UTC datetime string to local time and formats it as "2:30 PM"
 */
export const formatTime = (utcDate: string | null | undefined): string => {
  if (!utcDate) return '';
  return dayjs.utc(utcDate).local().format('h:mm A');
};

/**
 * Returns a relative time string like "2 hours ago", "3 days ago"
 */
export const formatRelative = (utcDate: string | null | undefined): string => {
  if (!utcDate) return '';
  return dayjs.utc(utcDate).local().fromNow();
};

/**
 * Returns the underlying dayjs object for custom formatting (already converted to local time)
 */
export const toLocalDayjs = (utcDate: string | null | undefined) => {
  if (!utcDate) return null;
  return dayjs.utc(utcDate).local();
};
