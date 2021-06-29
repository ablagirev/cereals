import request from 'superagent';
import { appConfig } from '../../config';

import {
    HTTP_CODE_400,
    HTTP_CODE_403,
    HTTP_CODE_404,
    HTTP_CODE_500,
    HTTP_CODE_503,
    RESPONSE_HEADERS,
} from './consts';


/**
 * Модель параметров фабрики по созданию функций для осуществления запросов к серверу.
 */
interface IRequestMethodFactoryParams {
    url: string;
    data?: object;
    queryParams?: object | string;
}

/**
 * Модель параметров запроса при ошибке (для обработки филтрации пушей)
 *
 * @prop string url запроса.
 * @prop string errorType Тип ошибки в ответе запроса.
 */
export interface IResponseErrorType {
    url: string;
    errorType: string;
}

/**
 * Кодирует переданную строку в соответствии с RFC5987 (набор символов параметров полей заголовка HTTP запроса).
 *
 * @param {string} string Переданная строка.
 */
export const encodeRFC5987ValueChars = (string: string): string =>
    encodeURIComponent(string)
        .replace(/['()]/g, escape)
        .replace(/\*/g, '%2A')
        .replace(/%(?:7C|60|5E)/g, unescape);


/**
 * Сохраняет файл.
 *
 * @param {Blob} blob Объект blob для сохраняемого файла.
 * @param {string} filename Имя файла.
 */
export const saveAs = (blob: Blob, filename: string) => {
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0);
    }
};

/**
 * Отобразить собщение о возникшей ошибке при вызове сервиса.
 *
 * @param {string} url Адрес сервиса.
 * @param {any} error Полученная ошибка.
 * @param {string} auxMsg Дополнительное сообщение.
 */
const showError = (url: string, error: any, auxMsg?: string) => {
   // console.error('error on: ', url)  TODO: доработать с появлением БТ
};

/**
 * Создает функцию для осуществления запросов к серверу с использованием указанного метода и параметров.
 *
 * @param {'POST' | 'GET' | 'PUT' | 'DELETE'} method Метод.
 * @param {IRequestMethodFactoryParams} params Параметры запроса.
 */
const requestMethodFactory = <TResponse>(method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH', params: IRequestMethodFactoryParams) =>
    new Promise<TResponse>((resolve, reject) => {
        const {data, queryParams, url} = params;
        const req = request(method, `${url}`)
            .set('Accept', 'application/json; charset=UTF-8')
            .set('Authorization', `${appConfig.api.tokenType} ${appConfig.api.token}`); // TODO: вернуть при наличии авторизации
            // .set('Authorization', `Basic YWRtaW46YWRtaW4=`);
        !!data && req.send(data);

        !!queryParams && req.query(queryParams);


        req.then((response) => {
            resolve(response.body);
        }).catch((error) => {
           
            showError(url, error);

            if (error?.response?.status === HTTP_CODE_403) {
                reject(error?.response);
            } else {
                reject(error);
            }
        });
    });

/**
 * Производит GET-запрос по указанному URL.
 *
 * @param {string} url URL.
 * @param {string | object} [queryParams] Параметры запроса.
 */
export const GET = <TResponse = any>(url: string, queryParams?: object | string) => requestMethodFactory<TResponse>('GET', {url, queryParams});

/**
 * Производит DELETE-запрос по указанному URL.
 *
 * @param {string} url URL.
 * @param {string | object} [queryParams] Параметры запроса.
 */
export const DELETE = <TResponse = any>(url: string, queryParams?: object | string) => requestMethodFactory<TResponse>('DELETE', {url, queryParams});

/**
 * Произвести POST-запрос к серверу по указанному URL.
 *
 * @param {string} url URL.
 * @param {object} [data] Данные для передачи в теле запроса.
 * @param {object} [queryParams] Данные для передачи в строке запроса.
 */
export const POST = <TResponse = any>(url: string, data?: object, queryParams?: object) =>
    requestMethodFactory<TResponse>('POST', {url, data, queryParams});

/**
 * Произвести PUT-запрос к серверу по указанному URL.
 *
 * @param {string} url URL.
 * @param {object} [data] Данные для передачи в теле запроса.
 * @param {object} [queryParams] Данные для передачи в строке запроса.
 */
export const PUT = <TResponse = any>(url: string, data?: object, queryParams?: object) =>
    requestMethodFactory<TResponse>('PUT', {url, data, queryParams});


    /**
 * Произвести PATCH-запрос к серверу по указанному URL.
 *
 * @param {string} url URL.
 * @param {object} [data] Данные для передачи в теле запроса.
 * @param {object} [queryParams] Данные для передачи в строке запроса.
 */
export const PATCH = <TResponse = any>(url: string, data?: object, queryParams?: object) =>
    requestMethodFactory<TResponse>('PATCH', {url, data, queryParams});