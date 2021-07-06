from main import models


def read_byte_file(path_file):
    with open(path_file, "rb") as file:
        raw = file.read()
    return raw


def save_file(content, path):
    with open(path, "wb") as file:
        file.write(content)
    return path


# user это пользователь который сделал запрос
# warehouse это склад из предложения. Куда нужно доставить продукцию
# volume это объем продукции
def get_data_of_cost_delivery(user, warehouse, volume):
    warehouses_user = models.Warehouse.objects.filter(owner=user)
    result_cost_delivery_map = {}
    for warehouse_user in warehouses_user:
        distance = find_distance(warehouse, warehouse_user)
        cost_delivery, cost_delivery_per_tonne = calc_cost_delivery(distance, volume)

        result_cost_delivery_map[warehouses_user.id] = {
            "cost_delivery": cost_delivery,
            "cost_delivery_per_tonne": cost_delivery_per_tonne,
            "warehouse_from": warehouse_user,
            "warehouse_to": warehouse,
        }

    return result_cost_delivery_map


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
