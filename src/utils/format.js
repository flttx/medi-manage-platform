import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

/**
 * Format currency based on region
 * @param {number} amount 
 * @param {string} region 'cn' or 'us'
 * @returns {string}
 */
export const formatCurrency = (amount, region = 'cn') => {
    const locale = region === 'cn' ? 'zh-CN' : 'en-US';
    const currency = region === 'cn' ? 'CNY' : 'USD';
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format date based on region
 * @param {string|Date} date 
 * @param {string} region 'cn' or 'us'
 * @param {string} format optional dayjs format
 * @returns {string}
 */
export const formatDate = (date, region = 'cn', format) => {
    const locale = region === 'cn' ? 'zh-cn' : 'en';
    const defaultFormat = region === 'cn' ? 'YYYY.MM.DD' : 'MMM D, YYYY';
    
    return dayjs(date).locale(locale).format(format || defaultFormat);
};

/**
 * Format relative time
 * @param {string|Date} date 
 * @param {string} region 
 */
export const formatRelativeTime = (date, region = 'cn') => {
    // Basic implementation without full relativeTime plugin for brevity
    const diff = dayjs().diff(dayjs(date), 'day');
    if (diff === 0) return region === 'cn' ? '今天' : 'Today';
    if (diff === 1) return region === 'cn' ? '昨天' : 'Yesterday';
    return formatDate(date, region);
};
