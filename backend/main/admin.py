from django.contrib import admin
from main.models import *

# Register your models here.

myModels = [Company, NameOfSpecification, TypeOfSpecification,
            UnitOfMeasurementOfSpecification, SpecificationsOfProduct,
            Product, Warehouse, Offer, Document, Deal]

admin.site.register(myModels)
