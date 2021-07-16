import os.path
import csv
import json
from main import models

from Daylesford.settings import BASE_DIR



def read_byte_file(path_file):
    with open(path_file, "rb") as file:
        raw = file.read()
    return raw


def save_file(content, path):
    with open(path, "wb") as file:
        file.write(content)
    return path


# Todo: change!
def get_data_of_cost_delivery(user, warehouse, volume):
    warehouses_user = models.Warehouse.objects.filter(owner=user)
    result_cost_delivery_map = {}
    for warehouse_user in warehouses_user:

        result_cost_delivery_map[warehouse_user.id] = {
            "cost_delivery": 0,
            "cost_delivery_per_tonne": 0,
            "warehouse_from": warehouse_user,
            "warehouse_to": warehouse,
        }

    return result_cost_delivery_map.values()


def calc_cost_delivery(distance, volume):
    coefficient = models.CoefficientOfDistance.objects.get(
        min_distance__lte=distance, max_distance__gte=distance
    ).coefficient
    if coefficient == 1:
        base_rate = models.BaseRateForDelivery.objects.last().cost_per_tonne
        return volume * (base_rate * coefficient), (base_rate * coefficient)
    else:
        return volume * (distance * coefficient), (distance * coefficient)


def find_distance(warehouse, warehouse_user):
    return abs(warehouse_user.distance - warehouse.distance)


def load_data_for_spec():
    with open(os.path.join(BASE_DIR, 'temp_file', 'spec.csv')) as file:
        data = csv.DictReader(file)

        # Единица измерения
        if not models.UnitOfMeasurementOfSpecification.objects.filter(
                unit='текст').exists():
            models.UnitOfMeasurementOfSpecification.objects.create(unit='текст')

        # Склад
        if not models.Warehouse.objects.filter(
                title='Склад 1').exists():
            models.Warehouse.objects.create(
                title='Склад 1',
                address='Складкая 32',
                owner=models.User.objects.get(id=1)
            )

        for d in data:
            if not models.UnitOfMeasurementOfSpecification.objects.filter(
                    unit=d['Единица измерения']).exists() and len(d['Единица измерения']) < 9:
                models.UnitOfMeasurementOfSpecification.objects.create(unit=d['Единица измерения'])

            # Показатель
            name = d['Показатель зерна']
            if not models.SpecificationsOfProduct.objects.filter(name=name).exists():
                spec = models.SpecificationsOfProduct()
                spec.name = name
                if d['Тип поля'] == 'Числовое':
                    spec.type = 'range'
                    spec.unit_of_measurement = models.UnitOfMeasurementOfSpecification.objects.get(
                        unit=d['Единица измерения'])

                    is_editable_min = True if d['Редакт. min-знач'] in ['да', 'Да'] else False
                    is_editable_max = True if d['Редакт max-знач'] in ['да', 'Да'] else False
                    min_value = d['Минимальное значение'] if d['Минимальное значение'] not in ['нет', 'Нет'] \
                        else None
                    max_value = d['Максимальное значение'] if d['Максимальное значение'] not in ['нет', 'Нет'] \
                        else None

                    spec_data = {
                        'isEditableMin': is_editable_min,
                        'isEditableMax': is_editable_max,
                    }
                    if max_value is not None:
                        try:
                            max_value = int(max_value)
                        except:
                            max_value = float(max_value.replace(',', '.'))
                        print(max_value)
                        spec_data['max'] = max_value

                    if min_value is not None:
                        try:
                            min_value = int(min_value)
                        except:
                            min_value = float(min_value.replace(',', '.'))
                        print(min_value)
                        spec_data['min'] = min_value

                    spec.spec = json.dumps(spec_data, ensure_ascii=False)
                if d['Тип поля'] == 'Текстовое':
                    spec.type = 'string'
                    spec.unit_of_measurement = models.UnitOfMeasurementOfSpecification.objects.get(
                        unit='текст')
                    spec.description = d['Единица измерения']
                    spec.spec = json.dumps({"isEditable": False}, ensure_ascii=False)

                spec.GOST = d['ГОСТ']
                spec.save()

            # Культура
            if not models.Culture.objects.filter(name=d['Культура']).exists():
                culture = models.Culture()
                culture.name = d['Культура']
                culture.save()
            else:
                culture = models.Culture.objects.get(name=d['Культура'])
                culture.specifications.add(models.SpecificationsOfProduct.objects.get(name=d['Показатель зерна']))

            # Продукт
            if not models.Product.objects.filter(title=d['Культура']).exists():
                models.Product.objects.create(
                    title=d['Культура'],
                    culture=models.Culture.objects.get(name=d['Культура'])
                )

            # Предложение
            if not models.Offer.objects.filter(
                    title='Предложение 1').exists():
                offer = models.Offer()
                offer.title = 'Предложение 1'
                offer.volume = 100
                offer.creator = models.User.objects.get(id=1)
                offer.product = models.Product.objects.get(title=d['Культура'])
                offer.warehouse = models.Warehouse.objects.get(id=1)
                offer.cost = 10000
                offer.save()

            # Показатели предложения
            # if not models.OfferSpecification.objects.filter(
            #         offer__title='Предложение 1', specification__name=d['Показатель зерна']).exists() and \
            #         d['Культура'] == models.Offer.objects.get(title='Предложение 1').product.title:
            #
            #     offer_specification = models.OfferSpecification()
            #     offer_specification.offer = models.Offer.objects.get(title='Предложение 1')
            #     offer_specification.specification = models.SpecificationsOfProduct.objects.get(
            #         name=d['Показатель зерна']
            #     )
            #     if d['Минимальное значение'] not in ['нет', 'Нет']:
            #         offer_specification.value = d['Минимальное значение']
            #     if d['Максимальное значение'] not in ['нет', 'Нет']:
            #         offer_specification.value = d['Максимальное значение']
            #     offer_specification.save()

