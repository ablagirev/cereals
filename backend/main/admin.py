from django.contrib import admin
from main.models import *

# Register your models here.

myModels = [Company, NameOfSpecification, TypeOfSpecification,
            UnitOfMeasurementOfSpecification, SpecificationsOfProduct,
            Product, Warehouse, Offer, Document, Deal, CoefficientOfDistance,
            BaseRateForDelivery
            ]

admin.site.register(myModels)
