# Generated by Django 3.2.3 on 2021-06-23 08:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0016_auto_20210623_1107'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='specifications',
            field=models.ManyToManyField(blank=True, related_name='specifications', to='backend.SpecificationsOfProduct'),
        ),
    ]