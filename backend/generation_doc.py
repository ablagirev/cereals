from docxtpl import DocxTemplate



def gen_doc():
    # Документ 2
    name_of_contract = '113/ДМА'
    name_of_provider = 'Общество с ограниченной ответственностью "Маныч-Агро"'
    head_of_provider = 'Директора Ротко Анатолия Викторовича'
    basis_of_doc = 'Устава'
    name_of_product = 'КУКУРУЗА'
    harvest_year = '2020'
    address_load = '344002, г. Ростов-на-Дону, ул. 1-я Луговая, 42'
    volume_product = '2 200'
    volume_product_in_words = 'Две тысячи двести'
    sum_per_tonne = '18 150,00'
    sum_per_tonne_in_words = 'Восемнадцать тысяч сто пятьдесят рублей 00 копеек'
    date_start_shipment = '29 января 2021 г.'
    date_finish_shipment = '28 февраля 2021 г.'
    size_NDS_per_tonne = '1 650,00'
    total_sum = '39 930 000,00'
    total_sum_in_words = 'Тридцать девять миллионов девятьсот тридцать тысяч рублей 00 копеек'
    size_NDS = '3 630 000,00'
    number_of_spec = '1'
    date_of_contract = '27 января 2021 г.'
    date_of_spec = '28 января 2021 г.'
    TEXT1 = 'Датой поставки считается дата передачи Товара уполномоченному представителю Покупателя'
    TEXT2 = ' Приёмка Товара по качеству и количеству осуществляется при погрузке товара в автотранспорт Покупателя. ' \
            'После приемки Товара по количеству подписывается товарно-транспортная накладная СП-31, по утвержденной ' \
            'в Приложении к настоящей Спецификации форме'

    # Документ 1
    date_finish_of_contract = '31 декабря 2021 г.'
    ul_address = '346601, Ростовская обл, Багаевский р-н, Манычская ст-ца, Магаданская ул, дом 7'
    inn = '6166018099'
    kpp = '610301001'
    phone_number = '8-86357-43-2-33'
    email_of_head = 'manychagro@mail.ru'
    ogrn = '1026103161336'
    payment_account = '40702810900900000450'
    name_of_bank = 'ЮГ-ИНВЕСТБАНК (ПАО) г. Краснодар'
    correspondent_account = '30101810600000000966'
    bik = '040349966'
    position_head_of_provider = 'Директор'
    short_fio = 'Ротко А.В.'

    doc = DocxTemplate("./temp_file/text1.docx")
    context = {
        'number_of_spec': number_of_spec,
        'name_of_contract': name_of_contract,
        'date_of_contract': date_of_contract,
        'date_of_spec': date_of_spec,
        'name_of_provider': name_of_provider,
        'head_of_provider': head_of_provider,
        'basis_of_doc': basis_of_doc,
        'name_of_product': name_of_product,
        'harvest_year': harvest_year,
        'volume_product': volume_product,
        'volume_product_in_words': volume_product_in_words,
        'date_start_shipment': date_start_shipment,
        'date_finish_shipment': date_finish_shipment,
        'sum_per_tonne': sum_per_tonne,
        'sum_per_tonne_in_words': sum_per_tonne_in_words,
        'size_NDS_per_tonne': size_NDS_per_tonne,
        'total_sum': total_sum,
        'total_sum_in_words': total_sum_in_words,
        'size_NDS': size_NDS,
        'address_load': address_load,
        'TEXT1': TEXT1,
        'TEXT2': TEXT2,
        'date_finish_of_contract': date_finish_of_contract,
        'ul_address': ul_address,
        'inn': inn,
        'kpp': kpp,
        'phone_number': phone_number,
        'email_of_head': email_of_head,
        'ogrn': ogrn,
        'payment_account': payment_account,
        'name_of_bank': name_of_bank,
        'correspondent_account': correspondent_account,
        'bik': bik,
        'position_head_of_provider': position_head_of_provider,
        'short_fio': short_fio,
    }
    doc.render(context)
    doc.save("generated.docx")

#
# {
#   "name_of_provider": "Общество с ограниченной ответственностью 'Маныч-Агро'",
#   "head_of_provider": "Ротко Анатолия Викторовича",
#   "short_fio": "Ротко А.В.",
#   "position_head_of_provider": "Директор",
#   "basis_of_doc": "Устава",
#   "address_load": "344002. г. Ростов-на-Дону. ул. 1-я Луговая 42",
#   "ul_address": "346601. Ростовская обл. Багаевский р-н. Манычская ст-ца. Магаданская ул дом 7",
#   "inn": 6166018099,
#   "kpp": 610301001,
#   "ogrn": 1026103161336,
#   "bik": 040349966,
#   "payment_account": "40702810900900000450",
#   "correspondent_account": "30101810600000000966",
#   "phone_number": "8-86357-43-2-33",
#   "email_of_head": "manychagro@mail.ru",
#   "name_of_bank": "ЮГ-ИНВЕСТБАНК (ПАО) г. Краснодар"
# }