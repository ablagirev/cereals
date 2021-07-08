from django.contrib import admin
from main.models import *

# Register your models here.


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name_of_provider', 'inn', 'kpp', 'ogrn')
    list_filter = ('name_of_provider', 'inn', 'kpp', 'ogrn')
    search_fields = (
        "name_of_provider__startswith",
        "inn__startswith"
    )


@admin.register(NameOfSpecification)
class NameOfSpecificationAdmin(admin.ModelAdmin):
    list_display = ('name',)
    list_filter = ('name',)
    search_fields = (
        "name__startswith",
    )

@admin.register(TypeOfSpecification)
class TypeOfSpecificationAdmin(admin.ModelAdmin):
    list_display = ('type',)
    list_filter = ('type',)
    search_fields = (
        "type__startswith",
    )


@admin.register(UnitOfMeasurementOfSpecification)
class UnitOfMeasurementOfSpecificationAdmin(admin.ModelAdmin):
    list_display = ('unit',)
    list_filter = ('unit',)
    search_fields = (
        "unit__startswith",
    )


@admin.register(SpecificationsOfProduct)
class SpecificationsOfProductAdmin(admin.ModelAdmin):
    list_display = (
        'name_of_specification',
        'type_field',
        'unit_of_measurement',
        'GOST'
    )
    list_filter = (
        'name_of_specification',
        'type_field',
        'unit_of_measurement',
        'GOST'
    )
    search_fields = (
        "name_of_specification__startswith",
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'harvest_year',
        'harvest_type'
    )
    list_filter = (
        'title',
        'specifications',
        'harvest_year',
        'harvest_type'
    )
    search_fields = (
        "title__startswith",
    )


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'address',
        'owner'
    )
    list_filter = (
        'title',
        'address',
        'owner'
    )
    search_fields = (
        "title__startswith",
    )


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'volume',
        'status',
        'creator',
        'product',
        'warehouse',
        'cost',
        'date_start_shipment',
        'date_finish_shipment',
    )
    list_filter = (
        'title',
        'volume',
        'status',
        'creator',
        'product',
        'warehouse',
        'cost',
        'date_start_shipment',
        'date_finish_shipment',
    )
    search_fields = (
        "title__startswith",
    )

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('name',)
    list_filter = ('name',)
    search_fields = (
        "name__startswith",
    )


@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = (
        'offer',
        'status',
        'provider',
        'customer',
        'name_of_contract',
        'date_start_of_contract',
        'date_finish_of_contract',
    )
    list_filter = (
        'offer',
        'status',
        'provider',
        'customer',
        'name_of_contract',
        'date_start_of_contract',
        'date_finish_of_contract',
    )
    search_fields = (
        "offer__startswith",
    )


@admin.register(BaseRateForDelivery)
class BaseRateForDeliveryAdmin(admin.ModelAdmin):
    list_display = ('cost_per_tonne',)
    list_filter = ('cost_per_tonne',)
    search_fields = (
        "cost_per_tonne__startswith",
    )

