import { EMPTY_CHAR, SPACE_CHAR } from "./consts";
import parseISO from 'date-fns/esm/parseISO';
import format from 'date-fns/esm/format';
import isValid from 'date-fns/esm/isValid';
import isString from 'lodash-es/isString';

/**
 * Формат даты для отображения
 * (формат, в котором происходит ввод в поле ввода даты).
 */
 export const FRONTEND_DATE_FORMAT = 'dd.MM.yyyy';


export type MoneyValueType = number | string;

export const formatMoney = (value: MoneyValueType) => {
    const numberValue = Number(value);
    const fractionDigits = 2;

    if (Number.isNaN(numberValue) || value === null || value === '') {
        return EMPTY_CHAR
    }

    return new Intl.NumberFormat('ru-RU', {
        style: 'decimal',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(numberValue);
};

/**
 * Форматирование даты в ISO формате.
 *
 * @param {string} isoDate Дата в ISO формате.
 * @param {string} [displayFormat] Формат, к которому необходимо преобразовать.
 */
 export const formatDate = (isoDate: string, displayFormat: string = FRONTEND_DATE_FORMAT): string => {
    const parsedDate = parseISO(isoDate);

    return isValid(parsedDate) ? format(parsedDate, displayFormat) : '';
};

/**
 * Возвращает текст только с одинарными пробеламы внутри. Исключает null и undefined
 *
 * @param {string} value Исходный текст.
 */
 export const getTrimText = (value: string) =>
 isString(value)
     ? value
           .replace(/null|undefined/g, EMPTY_CHAR)
           .replace(/\s+/g, SPACE_CHAR)
           .replace('()', EMPTY_CHAR)
           .trim()
     : EMPTY_CHAR;
     