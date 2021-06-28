import base64
import datetime
import os

import requests

from main.consts import URL_SBIS
from main.models import Document
from main.utils import read_byte_file


def send_doc():
    doc = Document.objects.last()
    send_doc_to_sbis = SendDocToSBIS(doc)
    send_doc_to_sbis.authorization()
    send_doc_to_sbis.load_doc()
    send_doc_to_sbis.load_sign()


class SendDocToSBIS:
    def __init__(self, document):
        self.auth_token = None
        self.document = document
        self.login = "ukostrova"
        self.password = "ukostrova2021"

    def authorization(self):
        url = URL_SBIS + "auth/service/"

        data = {
            "jsonrpc": "2.0",
            "method": "СБИС.Аутентифицировать",
            "params": {"Параметр": {"Логин": self.login, "Пароль": self.password}},
            "id": 0,
        }
        res = requests.post(url, json=data)

        self.auth_token = res.json()["result"]
        # Получение токена аунтификации

    def load_doc(self):
        url = "https://online.sbis.ru/service/?srv=1"

        raw = read_byte_file(self.document.file.path)

        encoded_data = base64.b64encode(raw).decode("UTF-8")
        date_today = datetime.date.today().strftime("%d.%m.%Y")
        data = {
            "jsonrpc": "2.0",
            "method": "СБИС.ЗаписатьДокумент",
            "params": {
                "Документ": {
                    "Вложение": [
                        {
                            "Идентификатор": "e95dac53-1650-4e62-830f-f3456b6319c5",
                            "Файл": {
                                "ДвоичныеДанные": encoded_data,
                                "Имя": self.document.name,
                            },
                        }
                    ],
                    "Дата": date_today,
                    "Идентификатор": "f2a7c885-269a-44e4-8781-cb928df94163",
                    "Контрагент": {
                        "СвЮЛ": {
                            "ИНН": "7727325766",
                            "КПП": "772701001",
                            "Название": "Тестовый Получатель",
                        }
                    },
                    # "НашаОрганизация": {
                    #   "СвЮЛ": {
                    #     "ИНН": "7707371041",
                    #     "КПП": "772701001"
                    #   }
                    # },
                    # "Примечание": "Здесь обычно указывают примечание",
                    # "Редакция": [
                    #   {
                    #     "ПримечаниеИС": "РеализацияТоваровУслуг:1ee88d22-4ff7-4995-93dd-33363ebe9eae"
                    #   }
                    # ],
                    # "Тип": "ДокОтгрИсх"
                }
            },
            "id": 0,
        }
        headers = {"X-SBISSessionID": self.auth_token}

        res = requests.post(url, json=data, headers=headers)
        print(res.json())

    def load_sign(self):
        url = "https://online.sbis.ru/service/?srv=1"

        raw = read_byte_file(self.document.sign_file.path)

        encoded_data = base64.b64encode(raw).decode("UTF-8")
        date_today = datetime.date.today().strftime("%d.%m.%Y")
        data = {
            "jsonrpc": "2.0",
            "method": "СБИС.ВыполнитьДействие",
            "params": {
                "Документ": {
                    "Идентификатор": "f2a7c885-269a-44e4-8781-cb928df94163",
                    "Этап": {
                        "Вложение": [
                            {
                                "ВерсияФормата": "5.02",
                                "Дата": date_today,
                                "Идентификатор": "e95dac53-1650-4e62-830f-f3456b6319c5",
                                # "Модифицирован": "Да",
                                # "Название": "Фактура № 829766305 от 17.04.15 на сумму 1 026 996.48р., без НДС",
                                "Направление": "Входящий",
                                # "Номер": "829766305",
                                "Подпись": [
                                    {
                                        "Файл": {
                                            "ДвоичныеДанные": encoded_data,
                                            "Имя": os.path.basename(
                                                self.document.sign_file.path
                                            ),
                                        }
                                    }
                                ],
                                # "Подтип": "1115101",
                                # "Редакция": {
                                #   "ДатаВремя": "17.04.2015 13.19.57",
                                #   "Номер": "1"
                                # },
                                # "Служебный": "Нет",
                                # "СсылкаНаHTML": "https://online.sbis.ru/service/?method=%D0%A4%D0%AD%D0%94.%D0%9E%D1%82%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%B8%D1%82%D1%8C&params=eyLQmNC00J4iOiIzMiIsItCY0LzRj9Ce0LHRitC10LrRgtCwIjoi0JLQtdGA0YHQuNGP0JLQvdC10YjQvdC10LPQvtCU0L7QutGD0LzQtdC90YLQsCIsItCf0YDQtdC00YHRgtCw0LLQu9C10L3QuNC1Ijoi0J%2FRgNC%2B0YHQvNC%2B0YLRgCzQn9C10YfQsNGC0YwiLCLQn9Cw0YDQsNC80LXRgtGA0YsiOnsicyI6W3sibiI6ItCd0L7RgNC80LDQu9C40LfQvtCy0LDRgtGMIiwidCI6%0AItCb0L7Qs9C40YfQtdGB0LrQvtC1In0seyJuIjoi0KHQv9C10YbQuNCw0LvQuNC30LDRhtC40Y%2FQodC%2F0L7RgdC%2B0LHQsCIsInQiOiLQl9Cw0L%2FQuNGB0YwifV0sImQiOlt0cnVlLHsicyI6W3sibiI6ItCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGA0KHQv9C10YbQuNCw0LvQuNC30LDRhtC40LgiLCJ0Ijoi0KHRgtGA0L7QutCwIn1dLCJkIjpbIjExMTE2NTQzNTMsMTExMTAx%0AMDAxIl19XX0sItCY0LzRj9Cc0LXRgtC%2B0LTQsCI6ItCS0L3QtdGI0L3QuNC50JTQvtC60YPQvNC10L3Rgi7Qn9C%2B0LvRj9CU0LvRj9Cg0LDRgdC%2F0LXRh9Cw0YLQutC4Iiwi0J%2FQsNGA0LDQvNC10YLRgNGL0JzQtdGC0L7QtNCwIjp7InMiOlt7Im4iOiLQmNC00J4iLCJ0Ijoi0KfQuNGB0LvQviDRhtC10LvQvtC1In0seyJuIjoi0JjQvdC9IiwidCI6ItCh0YLRgNC%2B0LrQsCJ9%0AXSwiZCI6WzMyLG51bGxdfX0%3D&protocol=3&id=0",
                                # "СсылкаНаPDF": "https://online.sbis.ru/service/?method=%D0%A4%D0%AD%D0%94.%D0%A1%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B8%D1%82%D1%8C%D0%92PDF&params=eyLQmNC00J4iOiIzMiIsItCY0LzRj9Ce0LHRitC10LrRgtCwIjoi0JLQtdGA0YHQuNGP0JLQvdC10YjQvdC10LPQvtCU0L7QutGD0LzQtdC90YLQsCIsItCf0YDQtdC00YHRgtCw0LLQu9C10L3QuNC1Ijoi0J%2FQtdGH0LDRgtGMLNCf0YDQvtGB0LzQvtGC0YAiLCLQn9Cw0YDQsNC80LXRgtGA0YsiOm51bGwsItCY0LzRj9Cc0LXRgtC%2B0LTQsCI6ItCS0L3QtdGI0L3QuNC50JTQ%0AvtC60YPQvNC10L3Rgi7Qn9C%2B0LvRj9CU0LvRj9Cg0LDRgdC%2F0LXRh9Cw0YLQutC4Iiwi0J%2FQsNGA0LDQvNC10YLRgNGL0JzQtdGC0L7QtNCwIjp7InMiOlt7Im4iOiLQmNC00J4iLCJ0Ijoi0KfQuNGB0LvQviDRhtC10LvQvtC1In0seyJuIjoi0JjQvdC9IiwidCI6ItCh0YLRgNC%2B0LrQsCJ9XSwiZCI6WzMyLG51bGxdfX0%3D&protocol=3&id=0",
                                # "Сумма": "1026996.48",
                                # "Тип": "СчФктр",
                                # "Удален": "Нет",
                                # "УдаленКонтрагентом": "Нет"
                            }
                        ],
                        # "Действие": [
                        #   {
                        #     "Комментарий": "",
                        #     "Название": "Отправить",
                        #     "Сертификат": [
                        #       {
                        #         "Отпечаток": "6E3D6E662D33BF520312CAC4935912B039A5F5E2"
                        #       }
                        #     ]
                        #   }
                        # ],
                        # "Идентификатор": "",
                        # "Название": "Отправка",
                        # "Служебный": "Нет"
                    },
                }
            },
            "id": 0,
        }

        headers = {"X-SBISSessionID": self.auth_token}

        res = requests.post(url, json=data, headers=headers)
        print(res.json())
