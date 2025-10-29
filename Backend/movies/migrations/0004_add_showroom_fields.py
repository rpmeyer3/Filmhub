# Generated manually to add showroom fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0003_user_movieshow_showroom_usertype_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='showroom',
            name='name',
            field=models.CharField(default='Showroom 1', max_length=100),
        ),
        migrations.AddField(
            model_name='showroom',
            name='rows',
            field=models.IntegerField(default=10),
        ),
        migrations.AddField(
            model_name='showroom',
            name='seats_per_row',
            field=models.IntegerField(default=12),
        ),
    ]
