from datetime import datetime, timezone
from typing import Optional

from django.contrib.auth.models import User
from django.db import models

from main.consts import NDS
from main.managers.offer import OfferManager
from main.querysets.offer import OfferQuerySet, DeliveryPrice


class Company(models.Model):
    name_of_provider = models.CharField("Название компании", max_length=250)
    head_of_provider = models.CharField(
        "ФИО руководителя компании", max_length=250, blank=True, null=True
    )
    short_fio = models.CharField(
        "сокращенное ФИО руководителя компании", max_length=250, blank=True, null=True
    )
    position_head_of_provider = models.CharField(
        "Должность руководителя компании", max_length=250, blank=True, null=True
    )
    basis_of_doc = models.CharField(
        "Должность руководителя компании", max_length=250, blank=True, null=True
    )
    address_load = models.CharField(
        "Должность руководителя компании", max_length=250, blank=True, null=True
    )
    ul_address = models.CharField(
        "Юридический адрес компании", max_length=500, blank=True, null=True
    )
    inn = models.IntegerField("ИНН компании", blank=True, null=True)
    kpp = models.IntegerField("КПП компании", blank=True, null=True)
    ogrn = models.IntegerField("ОГРН компании", blank=True, null=True)
    bik = models.CharField("БИК компании", max_length=250, blank=True, null=True)
    payment_account = models.CharField(
        "Расчетный счет компании", max_length=250, blank=True, null=True
    )
    correspondent_account = models.CharField(
        "Корреспондентский счет компании", max_length=250, blank=True, null=True
    )
    phone_number = models.CharField(
        "Телефонный номер компании", max_length=64, blank=True, null=True
    )
    email_of_head = models.CharField(
        "Email руководителя", max_length=250, blank=True, null=True
    )
    name_of_bank = models.CharField(
        "Название банка", max_length=250, blank=True, null=True
    )


class NameOfSpecification(models.Model):
    name = models.CharField("Название характеристики", max_length=250)

    def __str__(self):
        return self.name


class TypeOfSpecification(models.Model):
    type = models.CharField("Тип поля", max_length=250)

    def __str__(self):
        return self.type


class UnitOfMeasurementOfSpecification(models.Model):
    unit = models.CharField("Единица измерения", max_length=250)

    def __str__(self):
        return self.unit


class SpecificationsOfProduct(models.Model):
    name_of_specification = models.ForeignKey(
        NameOfSpecification,
        on_delete=models.CASCADE,
        related_name="name_of_specification",
        blank=True,
        null=True,
    )
    type_field = models.ForeignKey(
        TypeOfSpecification,
        on_delete=models.CASCADE,
        related_name="type_field",
        blank=True,
        null=True,
    )
    unit_of_measurement = models.ForeignKey(
        UnitOfMeasurementOfSpecification,
        on_delete=models.CASCADE,
        related_name="unit_of_measurement",
        blank=True,
        null=True,
    )
    description = models.TextField("Описание", blank=True, null=True)
    min_value = models.IntegerField("Минимальное значение", blank=True, null=True)
    is_edit_min_value = models.BooleanField(
        "Редактируемое минимальное значение?", blank=True, null=True
    )
    max_value = models.IntegerField("Максимальное значение", blank=True, null=True)
    is_edit_max_value = models.BooleanField(
        "Редактируемое максимальное значение?", blank=True, null=True
    )
    GOST = models.CharField("ГОСТ", max_length=250, blank=True, null=True)

    def __str__(self):
        return 'Спецификация "{0}"'.format(self.name_of_specification.name)


class Product(models.Model):
    title = models.CharField("Название", max_length=250, null=True)
    description = models.TextField("Описание", blank=True, null=True)
    specifications = models.ManyToManyField(
        SpecificationsOfProduct, blank=True, related_name="specifications", null=True
    )
    # amount_of_gluten = models.IntegerField('Количество клейковины', blank=True, null=True)
    # vitreous = models.IntegerField('Стекловидность', blank=True, null=True)
    # nature = models.IntegerField('Натура', blank=True, null=True)
    # moisture = models.IntegerField('Влажность', blank=True, null=True)
    # weed_admixture = models.IntegerField('Сорная примесь', blank=True, null=True)
    harvest_year = models.DateField("Год урожая", blank=True, null=True)
    harvest_type = models.CharField("Тип урожая", max_length=250, blank=True, null=True)
    # humidity = models.IntegerField('Влажность', blank=True, null=True)
    # grain_impurity = models.IntegerField('Зерновая примесь', blank=True, null=True)
    # broken = models.IntegerField('Битые', blank=True, null=True)
    # damaged_by_mold = models.IntegerField('Поврежденные плесенью', blank=True, null=True)
    # aflatoxin = models.IntegerField('Афлатоксин', blank=True, null=True)
    # vomitoxin = models.IntegerField('Вомитоксин', blank=True, null=True)
    # protein = models.IntegerField('Протеин', blank=True, null=True)
    # drop_number = models.IntegerField('Число падения', blank=True, null=True)
    # damage_bedbug_turtle = models.IntegerField('Повреждение клопом черепашкой', blank=True, null=True)
    # alveographic_characteristics_of_the_test = models.IntegerField(
    #     'Альвеографические характеристики теста', blank=True, null=True)
    # gluten_strain_gauge = models.IntegerField('Измеритель деформации клейковины', blank=True, null=True)
    # damaged = models.IntegerField('Поврежденные', blank=True, null=True)
    # colored = models.IntegerField('Цветные', blank=True, null=True)
    # oilseed_admixture = models.IntegerField('Масличная примесь', blank=True, null=True)
    # oil_content = models.IntegerField('Масличность', blank=True, null=True)
    # acid_number_of_the_oil = models.IntegerField('Кислотное число масла', blank=True, null=True)
    # free_fatty_acids = models.IntegerField('Свободные жирные кислоты', blank=True, null=True)
    # salmonella = models.IntegerField('Сальмонелла', blank=True, null=True)
    # pesticides = models.IntegerField('Пестициды', blank=True, null=True)
    # erucic_acid = models.IntegerField('Эруковая кислота', blank=True, null=True)
    # glucosinolates = models.IntegerField('Глюкозинолаты', blank=True, null=True)
    # genetically_modified_organism = models.IntegerField('Генетически модифицированный организм', blank=True, null=True)
    # fiber = models.IntegerField('Клетчатка', blank=True, null=True)
    # dirty_chickpeas = models.IntegerField('Грязный нут', blank=True, null=True)
    # passing_through_the_sieve = models.IntegerField('Проход через сито', blank=True, null=True)
    # smell = models.IntegerField('Запах', blank=True, null=True)
    # harmful_substances = models.IntegerField('Вредные вещества', blank=True, null=True)
    # urea = models.IntegerField('Мочевина', blank=True, null=True)
    # potassium_hydroxide = models.IntegerField('Гидрооксид калия', blank=True, null=True)
    # trypsin = models.IntegerField('Трипсин', blank=True, null=True)
    # ochratoxin = models.IntegerField('Охратоксин', blank=True, null=True)
    # zearalenon = models.IntegerField('Зеараленон', blank=True, null=True)
    # fumonisin = models.IntegerField('Фумонизин', blank=True, null=True)
    # damaged_by_drying = models.IntegerField('Поврежденные сушкой', blank=True, null=True)
    # damaged_by_pests = models.IntegerField('Поврежденные вредителями', blank=True, null=True)
    # other_cereals = models.IntegerField('Прочие зерновые', blank=True, null=True)
    # infection_is_not_allowed = models.BooleanField('Зараженность не допускается', blank=True, null=True)

    def __str__(self):
        return self.title


class Warehouse(models.Model):
    title = models.CharField("Название", max_length=250, default="")
    address = models.CharField("Адрес", max_length=250, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner")
    distance = models.IntegerField("Расстояние", blank=True, null=True)

    def __str__(self):
        return self.title


class Offer(models.Model):
    title = models.CharField("Заголовок", max_length=250, blank=True, null=True)
    volume = models.IntegerField("Объем", blank=True, null=True)
    description = models.TextField("Описание", blank=True, null=True)
    # offer_lifetime = models.DateTimeField('Время жизни предложения', blank=True, null=True)
    status = models.CharField(
        "Статус", max_length=250, blank=True, null=True, default="active"
    )
    creator = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField("Создано (время)", auto_now_add=True)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, blank=True, null=True
    )
    warehouse = models.ForeignKey(
        Warehouse, on_delete=models.CASCADE, blank=True, null=True
    )
    date_start_shipment = models.DateTimeField(
        "Дата старта поставки", blank=True, null=True
    )
    date_finish_shipment = models.DateTimeField(
        "Дата окончания поставки", blank=True, null=True
    )
    cost = models.FloatField("Цена", blank=True, null=True)

    prices: Optional[list[DeliveryPrice]] = None

    objects = OfferQuerySet.as_manager()
    service = OfferManager()

    @property
    def cost_with_NDS(self):
        if self.cost:
            return self.cost + (self.cost / 100) * NDS
        else:
            return 0

    @property
    def cost_by_tonne(self):
        return 0

    @property
    def period_of_export(self):
        if self.date_finish_shipment and self.date_start_shipment:
            delta = self.date_finish_shipment - self.date_start_shipment
            return delta.days
        else:
            return 0

    @property
    def days_till_end(self):
        if self.date_finish_shipment:
            res = datetime.now(timezone.utc) - self.date_finish_shipment
            return res.days if res.days >= 0 else 0
        return 0

    def __str__(self):
        if self.title:
            return self.title
        else:
            return str(self.id)


class Notification(models.Model):
    pass


class Document(models.Model):
    name = models.CharField("Имя документа", max_length=250, default="")
    type_doc = models.CharField("Тип документа", max_length=250, null=True, blank=True)
    file = models.FileField("Файл", upload_to="uploads/%Y/%m/%d/%H/%M/%S", null=True)
    sign_file = models.FileField(
        "Файл подписи", upload_to="uploads/%Y/%m/%d/%H/%M/%S", null=True
    )


class QualityControl(models.Model):
    pass


class Payment(models.Model):
    pass


class CarsForShipment(models.Model):
    name = models.CharField(max_length=250)
    company = models.CharField(max_length=250)
    shipment_fact = models.IntegerField()


class Shipment(models.Model):
    status = models.CharField(max_length=250)
    documents = models.ManyToManyField(Document)
    cars = models.ManyToManyField(CarsForShipment)


class Сontrol(models.Model):
    pass


class Deal(models.Model):
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name="offer")
    status = models.CharField(max_length=250)
    provider = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name="provider"
    )
    customer = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name="customer"
    )
    documents = models.ManyToManyField(Document)
    quality_control = models.ManyToManyField(QualityControl)
    payment = models.ManyToManyField(Payment)
    shipment = models.ManyToManyField(Shipment)
    control = models.ManyToManyField(Сontrol)

    name_of_contract = models.CharField(
        "Название договора", max_length=250, blank=True, null=True
    )
    number_of_spec = models.CharField(
        "Номер спецификации", max_length=250, blank=True, null=True
    )
    date_start_of_spec = models.DateTimeField(
        "Дата начала спецификации", blank=True, null=True
    )
    date_finish_of_spec = models.DateTimeField(
        "Дата окончания спецификации", blank=True, null=True
    )
    date_start_of_contract = models.DateTimeField(
        "Дата начала договора", blank=True, null=True
    )
    date_finish_of_contract = models.DateTimeField(
        "Дата окончания договора", blank=True, null=True
    )

    date_start_shipment = models.DateTimeField(
        "Дата старта экспорта", blank=True, null=True
    )
    date_finish_shipment = models.DateTimeField(
        "Дата окончания экспорта", blank=True, null=True
    )
    amount_of_NDS = models.IntegerField("Размер НДС", blank=True, null=True)


class CoefficientOfDistance(models.Model):
    min_distance = models.IntegerField("Дистанция от", blank=True, null=True)
    max_distance = models.IntegerField("Дистанция до", blank=True, null=True)
    coefficient = models.FloatField("Коэффициент умножения", blank=True, null=True)

    def __str__(self):
        return "От {0} до {1}".format(self.min_distance, self.max_distance)


class BaseRateForDelivery(models.Model):
    cost_per_tonne = models.IntegerField("Стоимость за 1 тонну", blank=True, null=True)

    def __str__(self):
        return "{}р за 1 тонну".format(self.cost_per_tonne)
