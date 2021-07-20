from django.contrib import admin

from . import models


@admin.register(models.Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name_of_provider", "inn", "kpp", "ogrn")
    list_filter = ("name_of_provider", "inn", "kpp", "ogrn")
    search_fields = ("name_of_provider__startswith", "inn__startswith")


@admin.register(models.UnitOfMeasurementOfSpecification)
class UnitOfMeasurementOfSpecificationAdmin(admin.ModelAdmin):
    list_display = ("unit",)
    list_filter = ("unit",)
    search_fields = ("unit__startswith",)


@admin.register(models.SpecificationsOfProduct)
class SpecificationsOfProductAdmin(admin.ModelAdmin):
    list_display = ("name", "required", "type", "unit_of_measurement", "GOST")
    list_filter = ("name", "required", "type", "unit_of_measurement", "GOST")
    search_fields = ("name__startswith",)


@admin.register(models.OfferSpecification)
class OfferSpecificationAdmin(admin.ModelAdmin):
    list_display = ("offer", "specification", "value")
    list_filter = ("offer", "specification", "value")


class CultureSpecificationsInline(admin.TabularInline):
    model = models.Culture.specifications.through


@admin.register(models.Culture)
class CultureAdmin(admin.ModelAdmin):
    list_display = ("name",)
    list_filter = ("name",)
    search_fields = ("name__startswith",)

    inlines = (CultureSpecificationsInline,)


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "culture", "harvest_year", "harvest_type")
    list_filter = (
        "title",
        # "specifications",
        "culture",
        "harvest_year",
        "harvest_type",
    )
    search_fields = ("title__startswith",)


@admin.register(models.Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ("title", "address", "owner")
    list_filter = ("title", "address", "owner")
    search_fields = ("title__startswith",)


@admin.register(models.WarehouseDistance)
class WarehouseDistanceAdmin(admin.ModelAdmin):
    list_display = ("start", "to", "distance", "price")
    list_filter = ("start", "to", "distance", "price")


class OfferSpecificationsInline(admin.TabularInline):
    model = models.Offer.specifications.through


@admin.register(models.Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "volume",
        "status",
        "creator",
        "product",
        "warehouse",
        "cost",
        "date_start_shipment",
        "date_finish_shipment",
    )
    list_filter = (
        "title",
        "volume",
        "status",
        "creator",
        "product",
        "warehouse",
        "cost",
        "date_start_shipment",
        "date_finish_shipment",
    )
    search_fields = ("title__startswith",)

    inlines = (OfferSpecificationsInline,)


@admin.register(models.Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("name",)
    list_filter = ("name",)
    search_fields = ("name__startswith",)


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "offer",
        "status",
        "provider",
        "accepted_volume",
        "customer",
        "name_of_contract",
        "date_start_of_contract",
        "date_finish_of_contract",
    )
    list_filter = (
        "offer",
        "status",
        "provider",
        "accepted_volume",
        "customer",
        "name_of_contract",
        "date_start_of_contract",
        "date_finish_of_contract",
    )
    search_fields = ("offer__startswith",)


@admin.register(models.RateForDelivery)
class RateForDeliveryAdmin(admin.ModelAdmin):
    list_display = (
        "way",
        "cost_per_tonne",
        "min",
        "max",
        "delta",
    )
    list_filter = (
        "way",
        "cost_per_tonne",
        "min",
        "max",
        "delta",
    )


@admin.register(models.Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "company", "type")
    list_filter = ("user", "company", "type")
    search_fields = ("user__startswith",)
